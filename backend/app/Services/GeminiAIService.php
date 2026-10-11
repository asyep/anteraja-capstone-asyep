<?php

namespace App\Services;

use App\Models\AiNarrative;
use App\Models\Shipment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Service untuk integrasi Google Gemini LLM API & Rule-Based Fallback Engine.
 * Mengacu pada FRD F-03 (AI Status Narrative Box) dan Flow Map Anteraja.
 */
class GeminiAIService
{
    protected ?string $apiKey;
    protected string $model;
    protected float $timeout;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key') ?: env('GEMINI_API_KEY');
        $this->model = config('services.gemini.model', 'gemini-3.5-flash-lite');
        $this->timeout = (float) config('services.gemini.timeout', 5.0);
    }

    /**
     * Memproses narasi AI dan langsung menyimpannya ke tabel `ai_narratives`.
     */
    public function generateAndSaveNarrative(Shipment $shipment): AiNarrative
    {
        $narrativeData = $this->generateNarrativeText($shipment);

        return AiNarrative::create([
            'waybill_number' => $shipment->waybill_number,
            'ai_title' => $narrativeData['title'],
            'ai_subtitle' => $narrativeData['subtitle'],
            'narrative_text' => $narrativeData['text'],
            'is_fallback' => $narrativeData['is_fallback'],
            'provider' => 'gemini',
            'generation_status' => $narrativeData['generation_status'],
            'generated_at' => now(),
        ]);
    }

    /**
     * Menghasilkan teks narasi: mencoba Live Gemini API jika API Key tersedia,
     * atau otomatis fallback jika API Key kosong / timeout / terjadi error.
     */
    public function generateNarrativeText(Shipment $shipment): array
    {
        $sellerCity = Shipment::cityFromAddress($shipment->sender_address) ?: 'Kota Asal';
        $customerCity = Shipment::cityFromAddress($shipment->receiver_address) ?: 'Kota Tujuan';
        $courier = $shipment->activeCourier();
        $courierName = $courier ? ($courier->courier_name ?? $courier->name ?? 'Operasional') : 'Operasional';
        $telemetry = $shipment->telemetry;

        $title = 'Satria Assistant';
        $subtitle = "Satria {$courierName} (AI Live Assistant)";

        // 1. Jika API Key belum dikonfigurasi, gunakan Rule-Based Fallback
        if (blank($this->apiKey)) {
            Log::info("Gemini API Key belum diisi. Menggunakan Rule-Based Fallback untuk resi: {$shipment->waybill_number}");
            return [
                'title' => $title,
                'subtitle' => $subtitle,
                'text' => $this->buildFallbackNarrative($shipment, $sellerCity, $customerCity),
                'is_fallback' => true,
                'generation_status' => 'fallback',
            ];
        }

        // 2. Bangun Prompt Payload sesuai spesifikasi FRD F-03
        $prompt = $this->buildPrompt($shipment, $sellerCity, $customerCity, $courierName, $telemetry);

        try {
            $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post($endpoint, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 800,
                    ],
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $generatedText = data_get($data, 'candidates.0.content.parts.0.text');

                if (filled($generatedText)) {
                    $cleanText = trim(preg_replace('/\s+/', ' ', $generatedText));
                    // Bersihkan tanda petik ganda di awal/akhir jika ada
                    $cleanText = trim($cleanText, '"\'');

                    return [
                        'title' => $title,
                        'subtitle' => $subtitle,
                        'text' => $cleanText,
                        'is_fallback' => false,
                        'generation_status' => 'success',
                    ];
                }
            }

            Log::warning("Gemini API merespons dengan kode {$response->status()} untuk resi {$shipment->waybill_number}: " . $response->body());
        } catch (Throwable $e) {
            Log::error("Gagal memanggil Gemini API untuk resi {$shipment->waybill_number}: " . $e->getMessage());
        }

        // 3. Fallback jika ada kendala jaringan / timeout / error dari Google
        return [
            'title' => $title,
            'subtitle' => $subtitle,
            'text' => $this->buildFallbackNarrative($shipment, $sellerCity, $customerCity),
            'is_fallback' => true,
            'generation_status' => 'fallback',
        ];
    }

    /**
     * Membangun prompt terstruktur untuk Gemini LLM.
     */
    protected function buildPrompt(
        Shipment $shipment,
        string $sellerCity,
        string $customerCity,
        ?string $courierName,
        mixed $telemetry
    ): string {
        $status = $shipment->shipment_status;
        $delayReason = $telemetry?->logistics_delay_reason ?? 'Tidak ada kendala';
        $traffic = $telemetry?->traffic_status ?? 'Lancar';
        $weather = $telemetry?->weather_condition ?? 'Cerah';
        $location = $telemetry?->location_name ?? 'Rute Pengiriman';

        return <<<PROMPT
Anda adalah "Satria Assistant", asisten AI resmi dari ekspedisi Anteraja.
Tugas Anda: Buat narasi status pengiriman paket yang ramah, sopan, dan menenangkan hati pelanggan.

Data Pengiriman:
- Nomor Resi: {$shipment->waybill_number}
- Status Saat Ini: {$status}
- Kota Pengirim: {$sellerCity}
- Kota Penerima: {$customerCity}
- Nama Kurir/Armada: {$courierName}
- Posisi Terakhir: {$location}
- Kondisi Cuaca: {$weather}
- Kondisi Lalu Lintas: {$traffic}
- Kendala Operasional: {$delayReason}

Aturan Penulisan (Wajib Dipatuhi):
1. Gunakan Bahasa Indonesia santai, ramah, dan profesional (sapaan: "Halo Kak!").
2. Panjang teks harus ringkas antara 150 sampai 250 karakter (sekitar 2-3 kalimat).
3. Sebutkan kota tujuan atau posisi paket secara natural.
4. JANGAN gunakan istilah kode teknis internal logistik (misal: "HUB_JKT_01" atau "MANIFESTED").
5. Jika ada kendala, jelaskan dengan tenang dan sampaikan bahwa kurir terus berupaya mengantarkan paket dengan aman.
6. Berikan HANYA teks narasi langsung, tanpa pembuka/penutup tambahan seperti "Berikut narasinya:" atau tanda kutip.
PROMPT;
    }

    /**
     * Rule-Based Fallback Engine sesuai FRD BR-03.3.
     */
    protected function buildFallbackNarrative(Shipment $shipment, string $sellerCity, string $customerCity): string
    {
        $telemetry = $shipment->telemetry;
        $delayReason = $telemetry?->logistics_delay_reason;

        if ($shipment->shipment_status === Shipment::STATUS_DELIVERED) {
            return "Kabar gembira Kak! Paketmu dari {$sellerCity} telah berhasil diantar dengan aman ke alamat tujuan di {$customerCity}. Terima kasih telah menggunakan Anteraja!";
        }

        if ($shipment->shipment_status === Shipment::STATUS_OUT_FOR_DELIVERY) {
            return "Paketmu sedang dibawa oleh Kurir Satria menuju alamat tujuan di {$customerCity}. Pastikan ada penerima di lokasi ya Kak!";
        }

        if (filled($delayReason) || $telemetry?->traffic_status === 'Heavy') {
            $reason = filled($delayReason) ? $delayReason : 'kepadatan lalu lintas';
            return "Paketmu dalam perjalanan dari {$sellerCity} ke {$customerCity}. Ada sedikit hambatan {$reason} di rute transit, namun kurir Satria terus mengupayakan paket tiba secepatnya.";
        }

        return "Halo Kak! Paketmu saat ini sedang dalam perjalanan lancar dari {$sellerCity} menuju {$customerCity} dan diproyeksikan tiba tepat waktu.";
    }
}
