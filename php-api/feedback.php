<?php

declare(strict_types=1);

require_once __DIR__ . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'pesan' => 'Gunakan metode POST.']);
    exit;
}

// React mengirim object JavaScript yang sudah diubah menjadi JSON.
$data = json_decode((string) file_get_contents('php://input'), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'pesan' => 'Data JSON tidak valid.']);
    exit;
}

$resi = trim((string) ($data['resi'] ?? ''));
$punyaNilaiMembantu = array_key_exists('membantu', $data);

if ($resi === '' || !$punyaNilaiMembantu) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'pesan' => 'Resi dan penilaian wajib diisi.']);
    exit;
}

// Simpan satu baris log sebagai latihan sebelum data dipindahkan ke database.
$folderPenyimpanan = __DIR__ . '/storage';
if (!is_dir($folderPenyimpanan)) {
    mkdir($folderPenyimpanan, 0775, true);
}

$jawaban = (bool) $data['membantu'] ? 'ya' : 'tidak';
$baris = date('Y-m-d H:i:s') . ' | ' . $resi . ' | ' . $jawaban . PHP_EOL;
file_put_contents($folderPenyimpanan . '/feedback.txt', $baris, FILE_APPEND | LOCK_EX);

echo json_encode([
    'ok' => true,
    'pesan' => 'Terima kasih atas masukanmu.',
], JSON_UNESCAPED_UNICODE);
