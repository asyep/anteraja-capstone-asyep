<?php

declare(strict_types=1);

use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\TrackingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Smart AI Shipment Tracking
|--------------------------------------------------------------------------
|
| Mapping dari php-api lama ke endpoint Laravel:
|
|   tracking.php + tracking-widget.php  →  GET  /api/tracking/{resi}
|   shipment-history.php                →  GET  /api/tracking/{resi}/history
|   tracking-download.php               →  GET  /api/tracking/{resi}/download
|   feedback.php                        →  POST /api/feedback
|
*/

Route::prefix('tracking')->group(function () {

    // Menggantikan: tracking.php & tracking-widget.php
    // Contoh: GET /api/tracking/00010242fe8c5a6d1ba2dd792cb16214
    Route::get('/{resi}', [TrackingController::class, 'show'])
        ->name('tracking.show');

    // Menggantikan: shipment-history.php
    // Contoh: GET /api/tracking/00010242fe8c5a6d1ba2dd792cb16214/history
    Route::get('/{resi}/history', [TrackingController::class, 'history'])
        ->name('tracking.history');

    // Menggantikan: tracking-download.php
    // Contoh: GET /api/tracking/00010242fe8c5a6d1ba2dd792cb16214/download
    Route::get('/{resi}/download', [TrackingController::class, 'download'])
        ->name('tracking.download');
});

// Menggantikan: feedback.php
// POST /api/feedback  dengan body: { "resi": "...", "membantu": true }
Route::post('/feedback', [FeedbackController::class, 'store'])
    ->name('feedback.store');
