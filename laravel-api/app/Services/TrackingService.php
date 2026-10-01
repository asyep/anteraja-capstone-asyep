<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\DB;

/**
 * TrackingService
 *
 * Menggantikan kelas.php + fungsi.php dari php-api lama.
 * Berisi semua logika bisnis pengambilan dan transformasi data tracking.
 */
class TrackingService
{
    /**
     * Mapping kode status teknis kurir → kalimat ramah pengguna.
     * Menggantikan fungsi statusRamah() di fungsi.php.
     */
    private array $statusLabels = [
        'MANIFESTED'       => 'Paket sudah dicatat, menunggu diambil kurir.',
        'ARRIVED_AT_HUB'   => 'Paket tiba di gudang sortir.',
        'OUT_FOR_DELIVERY' => 'Kurir sedang menuju alamatmu.',
        'ORDER_CREATED'    => 'Pesanan dibuat.',
        'PICKUP_READY'     => 'Paket diterima kurir.',
        'IN_TRANSIT_HUB'   => 'Paket bergerak ke hub tujuan.',
        'TRAFFIC_DELAY'    => 'Perjalanan tertunda karena lalu lintas padat.',
        'DELIVERED'        => 'Paket diterima pelanggan.',
        'CANCELED'         => 'Pengiriman dibatalkan.',
    ];

    /**
     * Mengubah kode teknis menjadi label ramah pengguna.
     * Menggantikan statusRamah() di fungsi.php.
     */
    public function statusRamah(string $kode): string
    {
        return $this->statusLabels[$kode] ?? 'Status sedang diperbarui.';
    }

    /**
     * Mengambil data lengkap widget untuk satu nomor resi dari database.
     * Menggantikan TrackingWidget::dataWidget() di kelas.php.
     *
     * @return array|null  null jika resi tidak ditemukan
     */
    public function dataWidget(string $resi): ?array
    {
        // Ambil data order + customer dari view tracking_summary
        $summary = DB::selectOne(
            'SELECT * FROM tracking_summary WHERE waybill_number = ?',
            [$resi]
        );

        if (! $summary) {
            return null;
        }

        // Ambil riwayat event tracking
        $events = DB::select(
            'SELECT event_code, milestone_stage, description, facility_name, event_at
             FROM tracking_events
             WHERE order_id = ?
             ORDER BY event_at ASC',
            [$resi]
        );

        // Ambil narasi AI terbaru (jika ada)
        $narrative = DB::selectOne(
            'SELECT text, is_fallback, provider FROM ai_narratives
             WHERE order_id = ?
             ORDER BY generated_at DESC
             LIMIT 1',
            [$resi]
        );

        $riwayat = array_map(function ($event) {
            return [
                'jam'            => date('H:i', strtotime($event->event_at)),
                'tanggal'        => date('d M Y', strtotime($event->event_at)),
                'kode'           => $event->event_code,
                'tahap'          => $event->milestone_stage,
                'pesan'          => $event->description ?? $this->statusRamah($event->event_code),
                'lokasi'         => $event->facility_name,
            ];
        }, $events);

        return [
            'resi'              => $summary->waybill_number,
            'status'            => $summary->order_status,
            'kota_tujuan'       => $summary->customer_city,
            'kota_asal'         => $summary->seller_city,
            'total_barang'      => (float) $summary->item_total,
            'total_ongkir'      => (float) $summary->freight_total,
            'gratis_ongkir'     => (bool) $summary->has_free_shipping,
            'tanggal_pesan'     => $summary->order_purchase_timestamp,
            'estimasi_tiba'     => $summary->order_estimated_delivery_date,
            'tiba_carrier'      => $summary->order_delivered_carrier_date,
            'tiba_pelanggan'    => $summary->order_delivered_customer_date,
            'ada_keterlambatan' => (bool) $summary->has_delay,
            'alasan_delay'      => $summary->logistics_delay_reason,
            'status_lalulintas' => $summary->traffic_status,
            'menit_tunggu'      => (int) $summary->waiting_time_minutes,
            'narasi_ai'         => $narrative ? [
                'teks'       => $narrative->text,
                'is_fallback'=> (bool) $narrative->is_fallback,
                'provider'   => $narrative->provider,
            ] : null,
            'riwayat'           => $riwayat,
        ];
    }

    /**
     * Mengambil riwayat event singkat (untuk endpoint history).
     * Menggantikan shipment-history.php.
     */
    public function riwayatSingkat(string $resi): array
    {
        $events = DB::select(
            'SELECT event_code, description, facility_name, event_at
             FROM tracking_events
             WHERE order_id = ?
             ORDER BY event_at ASC',
            [$resi]
        );

        return array_map(function ($event) {
            return [
                'jam'    => date('H:i', strtotime($event->event_at)),
                'kode'   => $event->event_code,
                'pesan'  => $event->description ?? $this->statusRamah($event->event_code),
                'lokasi' => $event->facility_name,
            ];
        }, $events);
    }

    /**
     * Format teks plain untuk unduhan.
     * Menggantikan tracking-download.php.
     */
    public function formatUnduhan(array $data): string
    {
        $baris  = "Riwayat Resi: {$data['resi']}" . PHP_EOL;
        $baris .= "Status      : {$data['status']}" . PHP_EOL;
        $baris .= "Tujuan      : {$data['kota_tujuan']}" . PHP_EOL;
        $baris .= str_repeat('-', 50) . PHP_EOL;

        foreach ($data['riwayat'] as $r) {
            $baris .= "{$r['tanggal']} {$r['jam']}  [{$r['kode']}]  {$r['pesan']}";
            if ($r['lokasi']) {
                $baris .= " – {$r['lokasi']}";
            }
            $baris .= PHP_EOL;
        }

        return $baris;
    }
}
