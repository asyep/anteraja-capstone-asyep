<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class GeminiAIService
{
    public function __construct(private FallbackEngineService $fallbackEngine) {}

    public function generate(array $shipment): array
    {
        $apiKey = (string) config('services.gemini.api_key', '');

        if ($apiKey === '') {
            return $this->fallbackEngine->generate($shipment);
        }

        $model = (string) config('services.gemini.model', 'gemini-2.5-flash');
        $endpoint = sprintf(
            'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent',
            rawurlencode($model),
        );
        $prompt = $this->buildPrompt($shipment);

        try {
            $response = Http::timeout(1.2)
                ->withHeaders(['x-goog-api-key' => $apiKey])
                ->acceptJson()
                ->post($endpoint, [
                    'contents' => [[
                        'parts' => [['text' => $prompt]],
                    ]],
                    'generationConfig' => [
                        'temperature' => 0.5,
                        'maxOutputTokens' => 180,
                    ],
                ]);
        } catch (ConnectionException) {
            return $this->fallbackEngine->generate($shipment);
        }

        if (! $response->successful()) {
            return $this->fallbackEngine->generate($shipment);
        }

        $text = trim((string) $response->json('candidates.0.content.parts.0.text', ''));
        $text = trim($text, " \t\n\r\0\x0B\"'");
        $characterCount = mb_strlen($text);

        if ($characterCount < 150 || $characterCount > 250) {
            return $this->fallbackEngine->generate($shipment);
        }

        return [
            'text' => $text,
            'is_fallback' => false,
            'provider' => 'gemini',
            'model' => $model,
            'generated_at' => now()->toIso8601String(),
        ];
    }

    private function buildPrompt(array $shipment): string
    {
        $status = (string) ($shipment['order_status'] ?? 'sedang diproses');
        $destination = (string) ($shipment['customer_city'] ?? 'alamat tujuan');
        $delay = ($shipment['has_delay'] ?? false) === true
            ? (string) ($shipment['logistics_delay_reason'] ?? 'kendala operasional')
            : 'tidak ada kendala yang dilaporkan';
        $eta = (string) ($shipment['formatted_eta'] ?? 'belum tersedia');

        return "Berperan sebagai Assistant Satria Anteraja yang ramah. Tulis dalam Bahasa Indonesia sehari-hari, tanpa istilah teknis internal, tepat 150 sampai 250 karakter dan 3-4 kalimat ringkas. Jangan mengarang fakta. Status kiriman: {$status}. Kota tujuan: {$destination}. Kondisi: {$delay}. Estimasi: {$eta}. Keluarkan hanya narasinya.";
    }
}
