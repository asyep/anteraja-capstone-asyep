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
        /** @var array<int, array{name: string, rating: float}> $demoCouriers */
        $demoCouriers = [
            ['name' => 'Satria Demo 01', 'rating' => 4.8],
            ['name' => 'Satria Demo 02', 'rating' => 4.6],
            ['name' => 'Satria Demo 03', 'rating' => 4.9],
            ['name' => 'Satria Demo 04', 'rating' => 4.7],
            ['name' => 'Satria Demo 05', 'rating' => 4.5],
            ['name' => 'Satria Demo 06', 'rating' => 4.4],
            ['name' => 'Satria Demo 07', 'rating' => 4.8],
            ['name' => 'Satria Demo 08', 'rating' => 4.9],
            ['name' => 'Satria Demo 09', 'rating' => 4.3],
            ['name' => 'Satria Demo 10', 'rating' => 4.7],
            ['name' => 'Satria Demo 11', 'rating' => 4.6],
            ['name' => 'Satria Demo 12', 'rating' => 5.0],
            ['name' => 'Satria Demo 13', 'rating' => 4.2],
            ['name' => 'Satria Demo 14', 'rating' => 4.8],
            ['name' => 'Satria Demo 15', 'rating' => 4.5],
            ['name' => 'Satria Demo 16', 'rating' => 4.9],
            ['name' => 'Satria Demo 17', 'rating' => 4.4],
            ['name' => 'Satria Demo 18', 'rating' => 4.7],
            ['name' => 'Satria Demo 19', 'rating' => 4.6],
            ['name' => 'Satria Demo 20', 'rating' => 5.0],
            ['name' => 'Satria Demo 21', 'rating' => 4.3],
            ['name' => 'Satria Demo 22', 'rating' => 4.8],
            ['name' => 'Satria Demo 23', 'rating' => 4.5],
            ['name' => 'Satria Demo 24', 'rating' => 4.9],
            ['name' => 'Satria Demo 25', 'rating' => 4.6],
        ];

        foreach ($demoCouriers as $courierData) {
            Courier::updateOrCreate(
                ['name' => $courierData['name']],
                ['rating' => $courierData['rating']],
            );
        }
    }
}
