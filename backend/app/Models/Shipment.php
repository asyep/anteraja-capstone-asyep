<?php

namespace App\Models;

use Database\Factories\ShipmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Shipment extends Model
{
    /** @use HasFactory<ShipmentFactory> */
    use HasFactory;

    public const STATUSES = [
        'created' => 'Pesanan dibuat',
        'approved' => 'Disetujui',
        'processing' => 'Diproses',
        'in_transit' => 'Dalam perjalanan',
        'shipped' => 'Dikirim',
        'delivered' => 'Terkirim',
        'canceled' => 'Dibatalkan',
        'unavailable' => 'Tidak tersedia',
    ];

    protected $fillable = [
        'tracking_number',
        'weight_kg',
        'status',
        'courier_id',
    ];

    protected function casts(): array
    {
        return [
            'weight_kg' => 'decimal:2',
        ];
    }

    public function courier(): BelongsTo
    {
        return $this->belongsTo(Courier::class);
    }

    public function latestTrackingEvent(): HasOne
    {
        return $this->hasOne(TrackingEvent::class, 'order_id', 'tracking_number')
            ->latestOfMany('event_at');
    }

    public function feedback(): HasMany
    {
        return $this->hasMany(Feedback::class, 'resi', 'tracking_number');
    }
}
