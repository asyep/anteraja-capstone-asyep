<?php

use App\Http\Controllers\CourierController;
use App\Http\Controllers\ShipmentController;
use Illuminate\Support\Facades\Route;

// Halaman utama → redirect ke widget
Route::get('/', function () {
    return redirect()->route('widget');
});

// Smart Tracking Widget
Route::get('/widget', fn () => view('widget.index'))->name('widget');

Route::resource('shipments', ShipmentController::class);
Route::resource('couriers', CourierController::class)->except('show');
