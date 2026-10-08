<?php

use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\TrackingController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:60,1')->group(function () {
    Route::get('/tracking/{waybill}', [TrackingController::class, 'show']);

    Route::get('/shipments/samples', [ShipmentController::class, 'samples']);
    Route::get('/shipments', [ShipmentController::class, 'index']);

    Route::post('/feedback', [FeedbackController::class, 'store'])->middleware('throttle:10,1');
});
