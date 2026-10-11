<?php

/**
 * ============================================================================
 * BOOTSTRAP APLIKASI LARAVEL: bootstrap/app.php (Laravel 11)
 * ============================================================================
 * 
 * FUNGSI FILE:
 * Titik awal inisialisasi dan konfigurasi inti aplikasi Laravel 11, mengatur
 * pendaftaran rute (Web, API, Console), middleware global, dan penanganan exception.
 * 
 * SEKILAS LOGIKA KONFIGURASI:
 * 1. withRouting: Mendaftarkan file rute `routes/api.php` untuk API RESTful sistem
 *    pelacakan, `routes/web.php` untuk rute web standar, serta endpoint `/up` untuk health check.
 * 2. withExceptions: Mengonfigurasi `shouldRenderJsonWhen()` agar setiap rute yang
 *    berawalan `api/*` atau meminta `expectsJson()` otomatis merender pesan kesalahan
 *    dalam format respons JSON murni (mencegah error HTML page bocor ke klien frontend).
 * ============================================================================
 */

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
