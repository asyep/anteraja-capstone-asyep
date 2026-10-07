<?php

declare(strict_types=1);

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/fungsi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'pesan' => 'Gunakan metode GET.']);
    exit;
}

// Data contoh. Pada tahap backend berikutnya, data dapat berasal dari API kurir.
$riwayat = [
    ['jam' => '08:10', 'kode' => 'MANIFESTED'],
    ['jam' => '13:45', 'kode' => 'ARRIVED_AT_HUB'],
    ['jam' => '17:30', 'kode' => 'OUT_FOR_DELIVERY'],
];

$hasil = [];
foreach ($riwayat as $langkah) {
    $hasil[] = [
        'jam' => $langkah['jam'],
        'pesan' => statusRamah($langkah['kode']),
    ];
}

echo json_encode($hasil, JSON_UNESCAPED_UNICODE);
