<?php

namespace Database\Seeders;

use App\Models\Courier;
use App\Models\Shipment;
use Illuminate\Database\Seeder;

class ShipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
