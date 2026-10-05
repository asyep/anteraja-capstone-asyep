<?php

namespace Database\Seeders;

use App\Models\Feedback;
use Illuminate\Database\Seeder;

class FeedbackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Satu feedback per nomor resi dari database/dataset.sql. Kombinasi
     * resi + catatan dipakai sebagai kunci firstOrCreate agar seeder
     * idempoten tanpa constraint unik tambahan pada tabel feedback.
     */
    public function run(): void
    {
        /** @var array<int, array{resi: string, membantu: bool, catatan: string|null}> $demoFeedbacks */
        $demoFeedbacks = [
            ['resi' => '00010242fe8c5a6d1ba2dd792cb16214', 'membantu' => true, 'catatan' => null],
            ['resi' => '0008288aa423d2a3f00fcb17cd7d8719', 'membantu' => false, 'catatan' => 'Estimasi bergeser karena macet, mohon info lebih awal.'],
            ['resi' => '11111111111111111111111111111111', 'membantu' => true, 'catatan' => 'Paket cepat sampai, terima kasih.'],
            ['resi' => '22222222222222222222222222222222', 'membantu' => false, 'catatan' => 'Pembatalan tidak dijelaskan alasannya.'],
            ['resi' => '33333333333333333333333333333333', 'membantu' => true, 'catatan' => null],
            ['resi' => '44444444444444444444444444444444', 'membantu' => true, 'catatan' => 'Penyortiran di gudang cepat.'],
            ['resi' => '55555555555555555555555555555555', 'membantu' => true, 'catatan' => 'Lebih cepat dari estimasi.'],
            ['resi' => '66666666666666666666666666666666', 'membantu' => true, 'catatan' => null],
            ['resi' => '77777777777777777777777777777777', 'membantu' => false, 'catatan' => 'Dibatalkan sepihak padahal pesanan sudah dibayar.'],
            ['resi' => '88888888888888888888888888888888', 'membantu' => false, 'catatan' => 'Ada tambahan waktu 20 menit tanpa notifikasi.'],
            ['resi' => 'ina20260928cgkbdo000000000000001', 'membantu' => true, 'catatan' => null],
            ['resi' => 'ina20260929bksupg000000000000002', 'membantu' => true, 'catatan' => 'Status pengiriman jelas dan mudah dipantau.'],
            ['resi' => 'ina20260927mdnbpn000000000000003', 'membantu' => false, 'catatan' => 'Tertunda karena cuaca, mohon estimasi baru ditampilkan.'],
            ['resi' => 'ina20260926plmmlg000000000000004', 'membantu' => true, 'catatan' => 'Pengalihan rute diinformasikan dengan baik.'],
            ['resi' => 'ina20260930subpku000000000000005', 'membantu' => true, 'catatan' => 'Gratis ongkir dan paket diterima dengan aman.'],
            ['resi' => 'ina20260924smgpdg000000000000006', 'membantu' => true, 'catatan' => null],
            ['resi' => 'ina20260922mlgbjm000000000000007', 'membantu' => true, 'catatan' => 'Tiba tepat waktu sesuai estimasi.'],
            ['resi' => 'ina20260928pkupnk000000000000008', 'membantu' => false, 'catatan' => 'Dibatalkan tanpa pemberitahuan sebelumnya.'],
            ['resi' => 'ina20260923pdgmdc000000000000009', 'membantu' => false, 'catatan' => 'Stok kosong sehingga pesanan tidak bisa diproses.'],
            ['resi' => 'ina20260925bpnbth000000000000010', 'membantu' => false, 'catatan' => 'Kendala kendaraan membuat paket tertunda lama.'],
            ['resi' => 'ina20260930bjmsoc000000000000011', 'membantu' => true, 'catatan' => null],
            ['resi' => 'ina20260920pnkcbn000000000000012', 'membantu' => true, 'catatan' => 'Sampai lebih awal dari perkiraan.'],
            ['resi' => 'ina20261002mdcbog000000000000013', 'membantu' => true, 'catatan' => 'Tiga paket diproses bersamaan, cukup efisien.'],
            ['resi' => 'ina20260929bthdpk000000000000014', 'membantu' => false, 'catatan' => 'Macet 45 menit, mohon estimasi diperbarui.'],
            ['resi' => 'ina20261003cbntng000000000000015', 'membantu' => true, 'catatan' => null],
            ['resi' => 'ina20260918bogbks000000000000016', 'membantu' => false, 'catatan' => 'Terlambat tiga hari karena cuaca buruk.'],
        ];

        foreach ($demoFeedbacks as $feedbackData) {
            Feedback::firstOrCreate(
                ['resi' => $feedbackData['resi'], 'catatan' => $feedbackData['catatan']],
                ['membantu' => $feedbackData['membantu']],
            );
        }
    }
}
