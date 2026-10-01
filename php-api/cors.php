<?php

declare(strict_types=1);

// React Vite dan PHP dapat berjalan pada alamat yang berbeda saat development.
// Header ini mengizinkan browser menerima respons JSON dari endpoint latihan.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Browser kadang mengirim OPTIONS lebih dulu untuk memeriksa izin CORS.
// Request ini tidak membawa data yang perlu diproses endpoint.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
