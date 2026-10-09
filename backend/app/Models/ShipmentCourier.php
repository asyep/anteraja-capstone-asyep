<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ShipmentCourier extends Pivot
{
    protected $table = 'shipment_couriers';
    public $incrementing = false;
    public $timestamps = false;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }
}
