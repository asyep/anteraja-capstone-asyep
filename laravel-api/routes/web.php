<?php

use Illuminate\Support\Facades\Route;

// Halaman utama → redirect ke widget
Route::get('/', function () {
    return redirect()->route('widget');
});

// Smart Tracking Widget
Route::get('/widget', fn () => view('widget.index'))->name('widget');
