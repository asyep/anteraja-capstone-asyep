<?php

declare(strict_types=1);

/**
 * A validated shipment request used by the Day 12 PHP exercise.
 * The distance tiers are training rates, not official Anteraja tariffs.
 */
class ShipmentRequest
{
    private const DISTANCE_TIERS = [
        ['maximumKm' => 10, 'name' => 'Lokal', 'ratePerKg' => 9000],
        ['maximumKm' => 25, 'name' => 'Regional', 'ratePerKg' => 15000],
        ['maximumKm' => 50, 'name' => 'Antarkota', 'ratePerKg' => 28000],
        ['maximumKm' => null, 'name' => 'Jarak jauh', 'ratePerKg' => 35000],
    ];

    public readonly string $trackingNumber;

    public readonly float $weightKg;

    public readonly float $distanceKm;

    public function __construct(string $trackingNumber, float $weightKg, float $distanceKm)
    {
        $trackingNumber = strtoupper(trim($trackingNumber));
        if (preg_match('/^(?:\d{13,14}|[A-Z0-9]{32})$/', $trackingNumber) !== 1) {
            throw new InvalidArgumentException('Nomor resi harus 13–14 digit atau 32 karakter alfanumerik.');
        }
        if (!is_finite($weightKg) || $weightKg <= 0) {
            throw new InvalidArgumentException('Berat harus berupa angka yang lebih besar dari nol.');
        }
        if (!is_finite($distanceKm) || $distanceKm <= 0) {
            throw new InvalidArgumentException('Jarak harus berupa angka yang lebih besar dari nol.');
        }

        $this->trackingNumber = $trackingNumber;
        $this->weightKg = $weightKg;
        $this->distanceKm = $distanceKm;
    }

    public function calculateCost(): int
    {
        $ratePerKg = self::DISTANCE_TIERS[array_key_last(self::DISTANCE_TIERS)]['ratePerKg'];
        foreach (self::DISTANCE_TIERS as $tier) {
            if ($tier['maximumKm'] === null || $this->distanceKm <= $tier['maximumKm']) {
                $ratePerKg = $tier['ratePerKg'];
                break;
            }
        }

        return (int) ceil($this->weightKg) * $ratePerKg;
    }

    public function distanceTier(): string
    {
        foreach (self::DISTANCE_TIERS as $tier) {
            if ($tier['maximumKm'] === null || $this->distanceKm <= $tier['maximumKm']) {
                return $tier['name'];
            }
        }

        return 'Jarak jauh';
    }
}
