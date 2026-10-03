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

function beratDitagih(float $beratKg, float $panjang, float $lebar, float $tinggi, int $pembagiVolume = 6000): int
{
    $beratVolume = ($panjang * $lebar * $tinggi) / $pembagiVolume;

    return (int) ceil(max($beratKg, $beratVolume));
}

function hitungMargin(float $hargaJual, float $modal, float $ongkir): float
{
    if ($hargaJual <= 0) {
        return 0.0;
    }

    return round(($hargaJual - $modal - $ongkir) / $hargaJual * 100, 1);
}

function rupiah(float|int $angka): string
{
    return 'Rp ' . number_format($angka, 0, ',', '.');
}

/** @param array<string, int> $tarifPerKg
 *  @param array<string, int> $lamaHari
 *  @return array<int, array{nama: string, ongkir: int, margin: float, hari: int}>
 */
function hitungLayanan(array $data, array $tarifPerKg, array $lamaHari): array
{
    $berat = beratDitagih(
        (float) $data['berat'],
        (float) $data['p'],
        (float) $data['l'],
        (float) $data['t'],
        (int) ($data['pembagiVolume'] ?? 6000),
    );
    $layanan = [];
    foreach ($tarifPerKg as $nama => $tarif) {
        $ongkirDasar = $tarif * $berat;
        $ongkir = (int) round($ongkirDasar * (1 + (float) ($data['asuransiPersen'] ?? 0) / 100)
            + (float) ($data['biayaTambahan'] ?? 0));
        $layanan[] = [
            'nama' => $nama,
            'ongkir' => $ongkir,
            'margin' => hitungMargin((float) $data['harga'], (float) $data['modal'], $ongkir),
            'hari' => $lamaHari[$nama],
        ];
    }

    return $layanan;
}

/** @return array<string, mixed>|null Error payload if validation fails. */
function validasiKalkulator(mixed $data, bool $butuhMargin): ?array
{
    if (!is_array($data)) {
        return ['pesan' => 'Kirim data JSON yang valid.'];
    }

    $fields = ['berat', 'p', 'l', 't', 'harga', 'modal'];
    if ($butuhMargin) {
        $fields[] = 'marginMin';
    }
    foreach (['batasOngkir', 'asuransiPersen', 'biayaTambahan', 'pembagiVolume'] as $field) {
        if (array_key_exists($field, $data)) {
            $fields[] = $field;
        }
    }
    foreach ($fields as $field) {
        if (!isset($data[$field]) || !is_numeric($data[$field]) || (float) $data[$field] < 0) {
            return ['pesan' => "Nilai {$field} wajib berupa angka nol atau lebih."];
        }
    }
    if ((float) $data['berat'] <= 0 || (float) $data['harga'] <= 0) {
        return ['pesan' => 'Berat dan harga jual harus lebih besar dari nol.'];
    }
    if (isset($data['asuransiPersen']) && (float) $data['asuransiPersen'] > 100) {
        return ['pesan' => 'Asuransi tidak boleh melebihi 100 persen.'];
    }
    if (isset($data['pembagiVolume']) && (float) $data['pembagiVolume'] <= 0) {
        return ['pesan' => 'Pembagi volumetrik harus lebih besar dari nol.'];
    }
    if (isset($data['preferensi']) && !in_array($data['preferensi'], ['tercepat', 'termurah', 'margin'], true)) {
        return ['pesan' => 'Preferensi harus tercepat, termurah, atau margin.'];
    }

    return null;
}

/** @param array<int, array{nama: string, ongkir: int, margin: float, hari: int}> $layanan
 *  @return array{termurah: string|null, tercepat: string|null, marginTerbaik: string|null}
 */
function labelTerbaik(array $layanan): array
{
    if ($layanan === []) {
        return ['termurah' => null, 'tercepat' => null, 'marginTerbaik' => null];
    }

    $termurah = $tercepat = $marginTerbaik = $layanan[0];
    foreach ($layanan as $opsi) {
        if ($opsi['ongkir'] < $termurah['ongkir']) {
            $termurah = $opsi;
        }
        if ($opsi['hari'] < $tercepat['hari']) {
            $tercepat = $opsi;
        }
        if ($opsi['margin'] > $marginTerbaik['margin']) {
            $marginTerbaik = $opsi;
        }
    }

    return [
        'termurah' => $termurah['nama'],
        'tercepat' => $tercepat['nama'],
        'marginTerbaik' => $marginTerbaik['nama'],
    ];
}

/** Stream comparison results to a CSV download. */
function unduhLayananCsv(array $hasil, int $beratDitagih): never
{
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="perbandingan-ongkir.csv"');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['Berat ditagih (kg)', 'Layanan', 'Ongkir (Rp)', 'Margin (%)', 'Estimasi (hari)']);
    foreach ($hasil as $opsi) {
        fputcsv($output, [$beratDitagih, $opsi['nama'], $opsi['ongkir'], $opsi['margin'], $opsi['hari']]);
    }
    fclose($output);
    exit;
}
