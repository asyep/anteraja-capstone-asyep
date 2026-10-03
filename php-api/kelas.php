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

class RekomendasiOngkir
{
    public function __construct(
        private float $marginMinimum,
        private ?float $batasOngkir = null,
        private string $preferensi = 'tercepat',
    )
    {
    }

    /** @param array<int, array{nama: string, ongkir: int, margin: float, hari: int}> $daftarLayanan
     *  @return array{nama: string, ongkir: int, margin: float, hari: int}|null
     */
    public function pilih(array $daftarLayanan): ?array
    {
        $terbaik = null;
        foreach ($daftarLayanan as $layanan) {
            if ($layanan['margin'] < $this->marginMinimum
                || ($this->batasOngkir !== null && $layanan['ongkir'] > $this->batasOngkir)) {
                continue;
            }
            if ($terbaik === null || $this->lebihBaik($layanan, $terbaik)) {
                $terbaik = $layanan;
            }
        }

        return $terbaik;
    }

    /** @param array{nama: string, ongkir: int, margin: float, hari: int} $calon
     *  @param array{nama: string, ongkir: int, margin: float, hari: int} $terbaik
     */
    private function lebihBaik(array $calon, array $terbaik): bool
    {
        return match ($this->preferensi) {
            'termurah' => $calon['ongkir'] < $terbaik['ongkir'],
            'margin' => $calon['margin'] > $terbaik['margin'],
            default => $calon['hari'] < $terbaik['hari'],
        };
    }
}
