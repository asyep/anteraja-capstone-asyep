<?php

declare(strict_types=1);

require_once __DIR__ . '/ShipmentRequest.php';

session_start();

$requests = $_SESSION['shipment_requests'] ?? [];
if (!is_array($requests)) {
    $requests = [];
    $_SESSION['shipment_requests'] = [];
}

if (!isset($_SESSION['shipment_history_clear_token']) || !is_string($_SESSION['shipment_history_clear_token'])) {
    $_SESSION['shipment_history_clear_token'] = bin2hex(random_bytes(32));
}
$clearToken = $_SESSION['shipment_history_clear_token'];
$escape = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$totalCost = 0;
foreach ($requests as $entry) {
    if (is_array($entry) && ($entry['request'] ?? null) instanceof ShipmentRequest) {
        $totalCost += $entry['request']->calculateCost();
    }
}
?>
<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Riwayat Permintaan Pengiriman</title>
    <style>
      body { max-width: 900px; margin: 3rem auto; padding: 0 1rem; color: #29232a; font: 16px/1.5 system-ui, sans-serif; }
      table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
      th, td { padding: .8rem; border-bottom: 1px solid #eadde5; text-align: left; }
      th { background: #fff3f9; }
      .actions { display: flex; align-items: center; gap: 1rem; margin: 1.5rem 0; }
      .button { display: inline-block; padding: .65rem .9rem; border-radius: .5rem; background: #c80070; color: white; font-weight: 700; text-decoration: none; }
      .clear { color: #a0005b; }
      .total { margin-top: 1.5rem; padding: 1rem; border-radius: .75rem; background: #fff3f9; font-size: 1.15rem; font-weight: 700; }
      .empty { margin-top: 1.5rem; padding: 1.2rem; border: 1px dashed #cfc3ca; border-radius: .75rem; color: #685d64; }
      @media (max-width: 620px) { table { font-size: .85rem; } th, td { padding: .5rem .3rem; } }
    </style>
  </head>
  <body>
    <main>
      <h1>Riwayat Permintaan Pengiriman</h1>
      <p>Riwayat ini tersimpan dalam session browser PHP yang sedang aktif.</p>
      <div class="actions">
        <a class="button" href="shipment-form.html">Buat Permintaan</a>
        <a class="clear" href="clear-history.php?token=<?= rawurlencode($clearToken) ?>">Clear History</a>
      </div>

      <?php if ($requests === []): ?>
        <p class="empty">Belum ada permintaan pengiriman di sesi ini.</p>
      <?php else: ?>
        <div style="overflow-x:auto">
          <table>
            <thead>
              <tr><th>#</th><th>Nomor Resi</th><th>Berat</th><th>Jarak</th><th>Tier Jarak</th><th>Biaya</th><th>Waktu Request</th></tr>
            </thead>
            <tbody>
              <?php foreach ($requests as $index => $entry): ?>
                <?php if (!is_array($entry) || !($entry['request'] ?? null) instanceof ShipmentRequest) { continue; } ?>
                <?php $request = $entry['request']; ?>
                <tr>
                  <td><?= (int) $index + 1 ?></td>
                  <td><?= $escape($request->trackingNumber) ?></td>
                  <td><?= $escape(number_format($request->weightKg, 2, ',', '.')) ?> kg</td>
                  <td><?= $escape(number_format($request->distanceKm, 2, ',', '.')) ?> km</td>
                  <td><?= $escape($request->distanceTier()) ?></td>
                  <td>Rp <?= $escape(number_format($request->calculateCost(), 0, ',', '.')) ?></td>
                  <td><?= $escape((string) ($entry['requestedAt'] ?? '-')) ?></td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php endif; ?>
      <p class="total">Total biaya keseluruhan: Rp <?= $escape(number_format($totalCost, 0, ',', '.')) ?></p>
      <p><small>Tarif tier jarak pada latihan ini hanya simulasi dan bukan tarif resmi Anteraja.</small></p>
    </main>
  </body>
</html>
