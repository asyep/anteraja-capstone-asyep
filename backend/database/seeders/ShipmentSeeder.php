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
