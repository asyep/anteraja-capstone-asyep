<?php

declare(strict_types=1);

/**
 * Mengubah kode teknis dari sistem kurir menjadi kalimat yang mudah dipahami
 * pelanggan. Daftar kode dapat ditambah jika sistem kurir memiliki status baru.
 */
function statusRamah(string $kode): string
{
    $terjemahan = [
        'MANIFESTED' => 'Paket sudah dicatat, menunggu diambil kurir.',
        'ARRIVED_AT_HUB' => 'Paket tiba di gudang sortir.',
        'OUT_FOR_DELIVERY' => 'Kurir sedang menuju alamatmu.',
    ];

    // isset() memastikan kode tersedia sehingga pelanggan tidak melihat kode teknis.
    if (isset($terjemahan[$kode])) {
        return $terjemahan[$kode];
    }

    return 'Status sedang diperbarui.';
}
