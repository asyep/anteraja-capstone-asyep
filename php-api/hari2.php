<?php

declare(strict_types=1);

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/fungsi.php';
require_once __DIR__ . '/kelas.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['pesan' => 'Gunakan metode POST.']);
    exit;
}

$data = json_decode((string) file_get_contents('php://input'), true);
$validationError = validasiKalkulator($data, true);
if ($validationError !== null) {
    http_response_code(422);
    echo json_encode($validationError, JSON_UNESCAPED_UNICODE);
    exit;
}

$tarif = ['REG' => 9000, 'NEXTDAY' => 15000, 'SAMEDAY' => 28000];
$hari = ['REG' => 3, 'NEXTDAY' => 1, 'SAMEDAY' => 0];
$daftar = hitungLayanan($data, $tarif, $hari);
$batasOngkir = isset($data['batasOngkir']) ? (float) $data['batasOngkir'] : null;
$preferensi = (string) ($data['preferensi'] ?? 'tercepat');

$terbaik = (new RekomendasiOngkir((float) $data['marginMin'], $batasOngkir, $preferensi))->pilih($daftar);
if ($terbaik !== null) {
    unset($terbaik['ongkir']);
}

echo json_encode(['rekomendasi' => $terbaik], JSON_UNESCAPED_UNICODE);
