<?php

declare(strict_types=1);

use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\TrackingController;
use App\Http\Middleware\CatatWaktu;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->middleware(CatatWaktu::class)->group(function (): void {
    Route::get('/tracking/{waybill_number}', [TrackingController::class, 'show'])
        ->middleware([
            'throttle:tracking',
            'cache.headers:public;max_age=5;etag',
        ])
        ->name('tracking.show');

    Route::post('/feedback', [FeedbackController::class, 'store'])
        ->name('feedback.store');
});
