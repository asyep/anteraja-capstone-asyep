<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShipmentTrackingResource;
use App\Models\Shipment;
use App\Services\GeminiAIService;
use Illuminate\Http\JsonResponse;

class TrackingController extends Controller
{
    /** Nomor resi Anteraja selalu 14 digit angka. */
    public const WAYBILL_PATTERN = '/^\d{14}$/';

    /**
     * GET /api/v1/tracking/{waybill}
     * Detail lengkap satu kiriman untuk halaman tracking.
     */
    public function show(string $waybill, GeminiAIService $geminiService): JsonResponse
    {
        $waybill = trim($waybill);

        if (! preg_match(self::WAYBILL_PATTERN, $waybill)) {
            return response()->json([
                'ok' => false,
                'code' => 'INVALID_WAYBILL',
                'message' => 'Format nomor resi tidak valid. Nomor resi Anteraja terdiri dari 14 digit angka.',
            ], 422);
        }

        $shipment = Shipment::query()
            ->with(['trackingEvents', 'telemetry', 'latestNarrative', 'couriers'])
            ->find($waybill);

        if (! $shipment || $shipment->shipment_status === Shipment::STATUS_NOT_FOUND) {
            return response()->json([
                'ok' => false,
                'code' => 'NOT_FOUND',
                'message' => 'Nomor resi tidak ditemukan, mohon periksa kembali input Anda.',
            ], 404);
        }

        // Jika belum ada narasi AI tersimpan, otomatis panggil Gemini AI Service
        if (! $shipment->latestNarrative) {
            $geminiService->generateAndSaveNarrative($shipment);
            $shipment->load('latestNarrative');
        }

        return response()->json([
            'ok' => true,
            'data' => new ShipmentTrackingResource($shipment),
        ]);
    }

    /**
     * POST /api/v1/tracking/{waybill}/regenerate-ai
     * Memanggil Live Gemini LLM API untuk menghasilkan narasi status terkini secara real-time.
     */
    public function regenerateAi(string $waybill, GeminiAIService $geminiService): JsonResponse
    {
        $waybill = trim($waybill);

        if (! preg_match(self::WAYBILL_PATTERN, $waybill)) {
            return response()->json([
                'ok' => false,
                'code' => 'INVALID_WAYBILL',
                'message' => 'Format nomor resi tidak valid.',
            ], 422);
        }

        $shipment = Shipment::query()
            ->with(['telemetry', 'couriers'])
            ->find($waybill);

        if (! $shipment) {
            return response()->json([
                'ok' => false,
                'code' => 'NOT_FOUND',
                'message' => 'Nomor resi tidak ditemukan.',
            ], 404);
        }

        $newNarrative = $geminiService->generateAndSaveNarrative($shipment);

        return response()->json([
            'ok' => true,
            'message' => 'Narasi AI berhasil diperbarui secara live.',
            'data' => [
                'title' => $newNarrative->ai_title,
                'subtitle' => $newNarrative->ai_subtitle,
                'text' => $newNarrative->narrative_text,
                'is_fallback' => (bool) $newNarrative->is_fallback,
                'provider' => $newNarrative->provider,
                'generation_status' => $newNarrative->generation_status,
                'generated_at' => $newNarrative->generated_at?->toIso8601String(),
            ],
        ]);
    }
}
