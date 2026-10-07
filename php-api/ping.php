<?php

declare(strict_types=1);

// Endpoint sederhana untuk memastikan server PHP dan CORS sudah aktif.
require_once __DIR__ . '/cors.php';

echo json_encode([
    'ok' => true,
    'pesan' => 'PHP API siap',
], JSON_UNESCAPED_UNICODE);
