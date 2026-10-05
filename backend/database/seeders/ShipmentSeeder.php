<?php

namespace Database\Seeders;

use App\Models\Courier;
use App\Models\Shipment;
use Illuminate\Database\Seeder;

class ShipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Nomor resi sepuluh baris pertama sama dengan resi di database/dataset.sql
     * sehingga halaman detail shipment dapat menampilkan tracking_events yang
     * sama. Seeder ini berjalan pada Oktober 2026, sesuai bulan yang dipakai
     * query analisis di docs/sql-queries.md.
     */
    public function run(): void
    {
        /** @var array<int, array{tracking_number: string, weight_kg: float, status: string, courier_name: string}> $demoShipments */
        $demoShipments = [
            ['tracking_number' => '00010242fe8c5a6d1ba2dd792cb16214', 'weight_kg' => 2.50, 'status' => 'in_transit', 'courier_name' => 'Satria Demo 01'],
            ['tracking_number' => '0008288aa423d2a3f00fcb17cd7d8719', 'weight_kg' => 1.25, 'status' => 'in_transit', 'courier_name' => 'Satria Demo 02'],
            ['tracking_number' => '11111111111111111111111111111111', 'weight_kg' => 0.75, 'status' => 'delivered', 'courier_name' => 'Satria Demo 03'],
            ['tracking_number' => '22222222222222222222222222222222', 'weight_kg' => 4.00, 'status' => 'canceled', 'courier_name' => 'Satria Demo 01'],
            ['tracking_number' => '33333333333333333333333333333333', 'weight_kg' => 0.30, 'status' => 'created', 'courier_name' => 'Satria Demo 01'],
            ['tracking_number' => '44444444444444444444444444444444', 'weight_kg' => 3.20, 'status' => 'processing', 'courier_name' => 'Satria Demo 02'],
            ['tracking_number' => '55555555555555555555555555555555', 'weight_kg' => 0.10, 'status' => 'delivered', 'courier_name' => 'Satria Demo 03'],
            ['tracking_number' => '66666666666666666666666666666666', 'weight_kg' => 10.50, 'status' => 'in_transit', 'courier_name' => 'Satria Demo 01'],
            ['tracking_number' => '77777777777777777777777777777777', 'weight_kg' => 1.90, 'status' => 'canceled', 'courier_name' => 'Satria Demo 02'],
            ['tracking_number' => '88888888888888888888888888888888', 'weight_kg' => 6.75, 'status' => 'shipped', 'courier_name' => 'Satria Demo 03'],
            ['tracking_number' => 'ina20260928cgkbdo000000000000001', 'weight_kg' => 1.40, 'status' => 'approved', 'courier_name' => 'Satria Demo 04'],
            ['tracking_number' => 'ina20260929bksupg000000000000002', 'weight_kg' => 2.80, 'status' => 'processing', 'courier_name' => 'Satria Demo 05'],
            ['tracking_number' => 'ina20260927mdnbpn000000000000003', 'weight_kg' => 12.25, 'status' => 'in_transit', 'courier_name' => 'Satria Demo 06'],
            ['tracking_number' => 'ina20260926plmmlg000000000000004', 'weight_kg' => 0.85, 'status' => 'in_transit', 'courier_name' => 'Satria Demo 07'],
            ['tracking_number' => 'ina20260930subpku000000000000005', 'weight_kg' => 5.60, 'status' => 'in_transit', 'courier_name' => 'Satria Demo 08'],
            ['tracking_number' => 'ina20260924smgpdg000000000000006', 'weight_kg' => 2.10, 'status' => 'delivered', 'courier_name' => 'Satria Demo 09'],
            ['tracking_number' => 'ina20260922mlgbjm000000000000007', 'weight_kg' => 7.35, 'status' => 'delivered', 'courier_name' => 'Satria Demo 10'],
            ['tracking_number' => 'ina20260928pkupnk000000000000008', 'weight_kg' => 3.75, 'status' => 'canceled', 'courier_name' => 'Satria Demo 11'],
            ['tracking_number' => 'ina20260923pdgmdc000000000000009', 'weight_kg' => 0.45, 'status' => 'unavailable', 'courier_name' => 'Satria Demo 12'],
            ['tracking_number' => 'ina20260925bpnbth000000000000010', 'weight_kg' => 15.20, 'status' => 'shipped', 'courier_name' => 'Satria Demo 13'],
            ['tracking_number' => 'ina20260930bjmsoc000000000000011', 'weight_kg' => 4.55, 'status' => 'in_transit', 'courier_name' => 'Satria Demo 14'],
            ['tracking_number' => 'ina20260920pnkcbn000000000000012', 'weight_kg' => 1.05, 'status' => 'delivered', 'courier_name' => 'Satria Demo 15'],
            ['tracking_number' => 'ina20261002mdcbog000000000000013', 'weight_kg' => 9.80, 'status' => 'processing', 'courier_name' => 'Satria Demo 16'],
            ['tracking_number' => 'ina20260929bthdpk000000000000014', 'weight_kg' => 2.65, 'status' => 'in_transit', 'courier_name' => 'Satria Demo 17'],
            ['tracking_number' => 'ina20261003cbntng000000000000015', 'weight_kg' => 0.20, 'status' => 'created', 'courier_name' => 'Satria Demo 18'],
            ['tracking_number' => 'ina20260918bogbks000000000000016', 'weight_kg' => 3.40, 'status' => 'delivered', 'courier_name' => 'Satria Demo 19'],
        ];

        foreach ($demoShipments as $shipmentData) {
            $courier = Courier::where('name', $shipmentData['courier_name'])->firstOrFail();

            Shipment::updateOrCreate(
                ['tracking_number' => $shipmentData['tracking_number']],
                [
                    'weight_kg' => $shipmentData['weight_kg'],
                    'status' => $shipmentData['status'],
                    'courier_id' => $courier->id,
                ],
            );
        }
    }
}
