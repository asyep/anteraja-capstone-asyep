<?php

use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\TrackingController;
use Illuminate\Support\Facades\Route;

/**
 * =============================================================================
 * routes/api.php - Definisi Routing REST API Publik (v1)
 * =============================================================================
 * FUNGSI UTAMA:
 * Mendaftarkan seluruh endpoint API backend yang dikonsumsi oleh widget pelacakan.
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Prefix Versi API (`/api/v1`):
 *    Menjaga konsistensi kontrak API dengan frontend sesuai spesifikasi FRD.
 * 2. Rate Limiting (Throttle Middleware):
 *    - `throttle:60,1`: Membatasi maksimal 60 request per menit untuk endpoint pembacaan
 *      guna mencegah scraping berlebihan dan serangan denial of service (DoS).
 *    - `throttle:10,1`: Membatasi maksimal 10 request per menit untuk endpoint feedback
 *      guna mencegah spamming pengiriman formulir.
 * 3. Daftar Endpoint:
 *    - `GET  /api/v1/tracking/{waybill}`        : Detail lengkap pelacakan resi.
 *    - `POST /api/v1/tracking/{waybill}/regenerate-ai`: Trigger live Gemini AI narrative.
 *    - `GET  /api/v1/shipments/samples`         : 1 sampel resi per skenario tampilan.
 *    - `GET  /api/v1/shipments`                 : Riwayat daftar resi dengan filter/paginasi.
 *    - `POST /api/v1/feedback`                  : Umpan balik kepuasan narasi AI.
 * =============================================================================
 */

Route::prefix('v1')->middleware('throttle:60,1')->group(function () {
    // --- Modul Pelacakan Resi & AI Satria ---
    Route::get('/tracking/{waybill}', [TrackingController::class, 'show']);
    Route::post('/tracking/{waybill}/regenerate-ai', [TrackingController::class, 'regenerateAi']);

    // --- Modul Daftar Kiriman & Sampel Demo ---
    Route::get('/shipments/samples', [ShipmentController::class, 'samples']);
    Route::get('/shipments', [ShipmentController::class, 'index']);

    // --- Modul Umpan Balik Pelanggan (Rate-limited ketat: 10 req/menit) ---
    Route::post('/feedback', [FeedbackController::class, 'store'])->middleware('throttle:10,1');
});

