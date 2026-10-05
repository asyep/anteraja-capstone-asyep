<?php

namespace Tests\Feature;

use App\Models\Courier;
use App\Models\Feedback;
use App\Models\Shipment;
use Database\Seeders\CourierSeeder;
use Database\Seeders\FeedbackSeeder;
use Database\Seeders\ShipmentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatasetSeederTest extends TestCase
{
    use RefreshDatabase;

    private const SEEDERS = [
        CourierSeeder::class,
        ShipmentSeeder::class,
        FeedbackSeeder::class,
    ];

    public function test_laravel_seeders_create_at_least_twenty_five_rows_per_table(): void
    {
        $this->seed(self::SEEDERS);

        $this->assertGreaterThanOrEqual(25, Courier::query()->count());
        $this->assertGreaterThanOrEqual(25, Shipment::query()->count());
        $this->assertGreaterThanOrEqual(25, Feedback::query()->count());
    }

    public function test_laravel_seeders_are_idempotent(): void
    {
        $this->seed(self::SEEDERS);
        $countsAfterFirstRun = $this->tableCounts();

        $this->seed(self::SEEDERS);

        $this->assertSame($countsAfterFirstRun, $this->tableCounts());
    }

    public function test_shipment_resi_are_valid_and_feedback_uses_the_same_dataset(): void
    {
        $this->seed(self::SEEDERS);

        $trackingNumbers = Shipment::query()->pluck('tracking_number');

        $this->assertSame(26, $trackingNumbers->unique()->count());
        $this->assertTrue(
            $trackingNumbers->every(
                fn (string $resi): bool => preg_match('/^[A-Za-z0-9]{32}$/', $resi) === 1,
            ),
        );
        $this->assertSame(
            [],
            Feedback::query()->pluck('resi')->diff($trackingNumbers)->values()->all(),
        );
    }

    /**
     * @return array<int, int>
     */
    private function tableCounts(): array
    {
        return [
            Courier::query()->count(),
            Shipment::query()->count(),
            Feedback::query()->count(),
        ];
    }
}
