<?php

declare(strict_types=1);

require_once __DIR__ . '/ShipmentRequest.php';

session_start();

$providedToken = is_string($_GET['token'] ?? null) ? $_GET['token'] : '';
$sessionToken = is_string($_SESSION['shipment_history_clear_token'] ?? null)
    ? $_SESSION['shipment_history_clear_token']
    : '';

if ($sessionToken === '' || !hash_equals($sessionToken, $providedToken)) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Tautan clear history tidak valid. Buka halaman riwayat dan coba lagi.';
    exit;
}

unset($_SESSION['shipment_requests']);
$_SESSION['shipment_history_clear_token'] = bin2hex(random_bytes(32));

header('Location: request-history.php', true, 303);
exit;
