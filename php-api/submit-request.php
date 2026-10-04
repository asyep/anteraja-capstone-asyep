<?php

declare(strict_types=1);

require_once __DIR__ . '/ShipmentRequest.php';

session_start();

$errors = [];
$trackingNumber = is_string($_POST['trackingNumber'] ?? null)
    ? strtoupper(trim($_POST['trackingNumber']))
    : '';
$weightInput = is_string($_POST['weightKg'] ?? null) ? trim($_POST['weightKg']) : '';
$distanceInput = is_string($_POST['distanceKm'] ?? null) ? trim($_POST['distanceKm']) : '';

if ($trackingNumber === '') {
    $errors[] = 'Nomor resi wajib diisi.';
} elseif (preg_match('/^(?:\d{13,14}|[A-Z0-9]{32})$/', $trackingNumber) !== 1) {
    $errors[] = 'Nomor resi harus 13–14 digit atau 32 karakter alfanumerik.';
}

$weightKg = filter_var($weightInput, FILTER_VALIDATE_FLOAT);
if ($weightInput === '' || $weightKg === false || !is_finite((float) $weightKg) || (float) $weightKg <= 0) {
    $errors[] = 'Berat harus berupa angka yang lebih besar dari nol.';
}

$distanceKm = filter_var($distanceInput, FILTER_VALIDATE_FLOAT);
if ($distanceInput === '' || $distanceKm === false || !is_finite((float) $distanceKm) || (float) $distanceKm <= 0) {
    $errors[] = 'Jarak harus berupa angka yang lebih besar dari nol.';
}

if ($errors !== []) {
    http_response_code(422);
    $escape = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    ?>
    <!doctype html>
    <html lang="id">
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Periksa Permintaan</title></head>
      <body style="max-width:680px;margin:3rem auto;padding:0 1rem;font:16px/1.5 system-ui,sans-serif;color:#29232a">
        <main>
          <h1>Permintaan belum disimpan</h1>
          <p>Perbaiki data berikut, lalu kirim kembali:</p>
          <ul style="color:#a40045"><?php foreach ($errors as $error): ?><li><?= $escape($error) ?></li><?php endforeach; ?></ul>
          <p><a href="shipment-form.html">Kembali ke formulir</a></p>
          <p>Pastikan nomor resi 13–14 digit atau 32 karakter alfanumerik, berat dan jarak harus angka positif.</p>
        </main>
      </body>
    </html>
    <?php
    exit;
}

try {
    $request = new ShipmentRequest($trackingNumber, (float) $weightKg, (float) $distanceKm);
} catch (InvalidArgumentException $exception) {
    http_response_code(422);
    echo htmlspecialchars($exception->getMessage(), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    exit;
}

if (!isset($_SESSION['shipment_requests']) || !is_array($_SESSION['shipment_requests'])) {
    $_SESSION['shipment_requests'] = [];
}
$_SESSION['shipment_requests'][] = [
    'request' => $request,
    'requestedAt' => date(DATE_ATOM),
];

header('Location: request-history.php', true, 303);
exit;
