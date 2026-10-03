<?php

declare(strict_types=1);

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/fungsi.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['aksi'] ?? '') === 'unduh') {
    $encoded = (string) ($_GET['data'] ?? '');
    $json = base64_decode(strtr($encoded, '-_', '+/'), true);
    $data = is_string($json) ? json_decode($json, true) : null;
    $validationError = validasiKalkulator($data, false);
    if ($validationError !== null) {
        http_response_code(422);
        echo json_encode($validationError);
        exit;
    }
    $tarif = ['REG' => 9000, 'NEXTDAY' => 15000, 'SAMEDAY' => 28000];
    $hari = ['REG' => 3, 'NEXTDAY' => 1, 'SAMEDAY' => 0];
    $layanan = hitungLayanan($data, $tarif, $hari);
    unduhLayananCsv($layanan, beratDitagih((float) $data['berat'], (float) $data['p'], (float) $data['l'], (float) $data['t'], (int) ($data['pembagiVolume'] ?? 6000)));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['pesan' => 'Gunakan metode POST.']);
    exit;
}

$data = json_decode((string) file_get_contents('php://input'), true);
$validationError = validasiKalkulator($data, false);
if ($validationError !== null) {
    http_response_code(422);
    echo json_encode($validationError, JSON_UNESCAPED_UNICODE);
    exit;
}

$layanan = ['REG' => 9000, 'NEXTDAY' => 15000, 'SAMEDAY' => 28000];
$hari = ['REG' => 3, 'NEXTDAY' => 1, 'SAMEDAY' => 0];
$beratTagih = beratDitagih((float) $data['berat'], (float) $data['p'], (float) $data['l'], (float) $data['t']);
$hasil = hitungLayanan($data, $layanan, $hari);
$batasOngkir = isset($data['batasOngkir']) ? (float) $data['batasOngkir'] : null;
$hasil = array_values(array_filter($hasil, static fn (array $opsi): bool => $batasOngkir === null || $opsi['ongkir'] <= $batasOngkir));

echo json_encode([
    'beratDitagih' => $beratTagih,
    'layanan' => $hasil,
    'label' => labelTerbaik($hasil),
], JSON_UNESCAPED_UNICODE);
