<?php

namespace Database\Seeders;

use App\Models\Courier;
use Illuminate\Database\Seeder;

class CourierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ([
            ['name' => 'Satria Demo 01', 'rating' => 4.8],
            ['name' => 'Satria Demo 02', 'rating' => 4.6],
            ['name' => 'Satria Demo 03', 'rating' => 4.9],
            ['name' => 'Satria Demo 04', 'rating' => 4.7],
        ] as $courierData) {
            Courier::updateOrCreate(
                ['name' => $courierData['name']],
                ['rating' => $courierData['rating']],
            );
        }
    }
}
