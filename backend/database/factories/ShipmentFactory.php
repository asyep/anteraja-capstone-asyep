<?php

namespace Database\Factories;

use App\Models\Courier;
use App\Models\Shipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Shipment>
 */
class ShipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tracking_number' => fake()->unique()->regexify('[A-F0-9]{32}'),
            'weight_kg' => fake()->randomFloat(2, 0.1, 30),
            'status' => fake()->randomElement(array_keys(Shipment::STATUSES)),
            'courier_id' => Courier::factory(),
        ];
    }
}
