<?php

declare(strict_types=1);

// Endpoint standar untuk React: /tracking.php?resi=1000849201994
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/fungsi.php';
require_once __DIR__ . '/kelas.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'pesan' => 'Gunakan metode GET.']);
    exit;
}

$resi = trim((string) ($_GET['resi'] ?? ''));

if ($resi === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'pesan' => 'Nomor resi wajib diisi.']);
    exit;
}

$widget = new TrackingWidget($resi);
echo json_encode($widget->dataWidget(), JSON_UNESCAPED_UNICODE);
