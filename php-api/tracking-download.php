<?php

declare(strict_types=1);

// Endpoint unduhan mengganti Content-Type JSON dari cors.php menjadi text/plain.
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/fungsi.php';
require_once __DIR__ . '/kelas.php';

$resi = trim((string) ($_GET['resi'] ?? 'AJ12345'));
if ($resi === '') {
    http_response_code(422);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Nomor resi wajib diisi.';
    exit;
}

$widget = new TrackingWidget($resi);
$data = $widget->dataWidget();

// Header harus dikirim sebelum echo agar browser menawarkan file unduhan.
header('Content-Type: text/plain; charset=utf-8');
header('Content-Disposition: attachment; filename="tracking-' . preg_replace('/[^A-Za-z0-9_-]/', '', $resi) . '.txt"');

echo 'Riwayat resi ' . $data['resi'] . PHP_EOL . PHP_EOL;
foreach ($data['riwayat'] as $langkah) {
    echo $langkah['jam'] . ' - ' . $langkah['pesan'] . PHP_EOL;
}
