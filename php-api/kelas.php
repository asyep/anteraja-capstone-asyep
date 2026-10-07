<?php

declare(strict_types=1);

/**
 * Widget tracking untuk satu nomor resi.
 * Pada aplikasi produksi, method ambilRiwayat() dapat mengambil data dari API
 * kurir atau database. Untuk latihan, method ini mengembalikan data contoh.
 */
class TrackingWidget
{
    private string $resi;

    public function __construct(string $resi)
    {
        $this->resi = $resi;
    }

    /** @return array<int, array{jam: string, kode: string}> */
    private function ambilRiwayat(): array
    {
        return [
            ['jam' => '08:10', 'kode' => 'MANIFESTED'],
            ['jam' => '13:45', 'kode' => 'ARRIVED_AT_HUB'],
        ];
    }

    /**
     * Mengembalikan data yang siap diubah menjadi JSON oleh endpoint.
     * React yang bertugas membuat tampilan, sehingga class ini tidak mencetak HTML.
     *
     * @return array{resi: string, riwayat: array<int, array{jam: string, pesan: string}>}
     */
    public function dataWidget(): array
    {
        $hasil = [];

        foreach ($this->ambilRiwayat() as $langkah) {
            $hasil[] = [
                'jam' => $langkah['jam'],
                'pesan' => statusRamah($langkah['kode']),
            ];
        }

        return [
            'resi' => $this->resi,
            'riwayat' => $hasil,
        ];
    }
}
