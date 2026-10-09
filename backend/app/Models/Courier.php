<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Courier extends Model
{
    protected $primaryKey = 'courier_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $guarded = [];

    public function shipments(): BelongsToMany
    {
        return $this->belongsToMany(Shipment::class, 'shipment_couriers', 'courier_id', 'waybill_number')
            ->using(ShipmentCourier::class)
            ->withPivot(['assigned_at', 'is_active']);
    }
}
