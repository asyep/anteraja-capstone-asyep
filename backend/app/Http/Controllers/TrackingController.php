<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShipmentTrackingResource;
use App\Models\Shipment;
use App\Services\GeminiAIService;
use Illuminate\Http\JsonResponse;

/**
 * =============================================================================
 * TrackingController.php - Controller Utama Pelacakan Resi & Integrasi AI
 * =============================================================================
 * FUNGSI UTAMA:
 * Menangani permintaan publik pelacakan nomor resi pengiriman Anteraja (GET)
 * serta memicu regenerasi narasi status terkini menggunakan Gemini LLM API (POST).
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Validasi Format Resi:
 *    Nomor resi Anteraja wajib berupa 14 digit angka regex (`/^\d{14}$/`).
 *    Jika tidak valid, langsung mengembalikan HTTP 422 Unprocessable Entity.
 * 2. Eager Loading Relasi Database:
 *    Memuat relasi `trackingEvents`, `telemetry`, `latestNarrative`, dan `couriers`
 *    sekaligus dalam satu query SQL guna menghindari masalah N+1 query.
 * 3. Auto-Generate AI Narrative (Jalur Resi Baru):
 *    Jika paket belum memiliki narasi AI tersimpan di database, sistem secara
 *    otomatis memanggil `GeminiAIService` untuk membuat narasi perdana.
 * 4. Regenerasi AI Real-time:
 *    Pengguna/admin dapat meminta pembaruan narasi status terbaru secara live
 *    berdasarkan telemetri mutakhir menggunakan model Google Gemini.
 * =============================================================================
 */
class TrackingController extends Controller
{
    /** Nomor resi Anteraja selalu 14 digit angka. */
    public const WAYBILL_PATTERN = '/^\d{14}$/';

    /**
     * GET /api/v1/tracking/{waybill}
     * Mengambil detail lengkap kiriman untuk tampilan widget pelacakan.
     *
     * @param string $waybill Nomor resi pengiriman
     * @param GeminiAIService $geminiService Service generator narasi AI
     * @return JsonResponse Response JSON berisi data terstruktur atau pesan error
     */
    public function show(string $waybill, GeminiAIService $geminiService): JsonResponse
    {
        $waybill = trim($waybill);

        // 1. Validasi format resi (14 digit numerik)
        if (! preg_match(self::WAYBILL_PATTERN, $waybill)) {
            return response()->json([
                'ok' => false,
                'code' => 'INVALID_WAYBILL',
                'message' => 'Format nomor resi tidak valid. Nomor resi Anteraja terdiri dari 14 digit angka.',
            ], 422);
        }

        // 2. Query data kiriman beserta seluruh entitas terkait
        $shipment = Shipment::query()
            ->with(['trackingEvents', 'telemetry', 'latestNarrative', 'couriers'])
            ->find($waybill);

        // 3. Verifikasi ketersediaan data resi di sistem
        if (! $shipment || $shipment->shipment_status === Shipment::STATUS_NOT_FOUND) {
            return response()->json([
                'ok' => false,
                'code' => 'NOT_FOUND',
                'message' => 'Nomor resi tidak ditemukan, mohon periksa kembali input Anda.',
            ], 404);
        }

        // 4. Jika belum ada narasi AI tersimpan, otomatis panggil Gemini AI Service
        if (! $shipment->latestNarrative) {
            $geminiService->generateAndSaveNarrative($shipment);
            $shipment->load('latestNarrative');
        }

        // 5. Kembalikan data yang sudah ditransformasi melalui Resource
        return response()->json([
            'ok' => true,
            'data' => new ShipmentTrackingResource($shipment),
        ]);
    }

    /**
     * POST /api/v1/tracking/{waybill}/regenerate-ai
     * Memanggil Live Gemini LLM API untuk menghasilkan narasi status terkini secara real-time.
     *
     * @param string $waybill Nomor resi pengiriman
     * @param GeminiAIService $geminiService Service generator narasi AI
     * @return JsonResponse Response JSON berisi narasi AI terbaru hasil generate
     */
    public function regenerateAi(string $waybill, GeminiAIService $geminiService): JsonResponse
    {
        $waybill = trim($waybill);

        // 1. Validasi format resi
        if (! preg_match(self::WAYBILL_PATTERN, $waybill)) {
            return response()->json([
                'ok' => false,
                'code' => 'INVALID_WAYBILL',
                'message' => 'Format nomor resi tidak valid.',
            ], 422);
        }

        // 2. Cari data resi pengiriman
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

        // 3. Panggil Gemini AI Service untuk menghasilkan & menyimpan narasi baru
        $newNarrative = $geminiService->generateAndSaveNarrative($shipment);

        // 4. Kembalikan payload narasi baru ke antarmuka pengguna
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
