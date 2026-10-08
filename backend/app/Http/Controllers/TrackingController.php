<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShipmentTrackingResource;
use App\Models\Shipment;
use Illuminate\Http\JsonResponse;

class TrackingController extends Controller
{
    /** Nomor resi Anteraja selalu 14 digit angka. */
    public const WAYBILL_PATTERN = '/^\d{14}$/';

    /**
     * GET /api/v1/tracking/{waybill}
     * Detail lengkap satu kiriman untuk halaman tracking.
     */
    public function show(string $waybill): JsonResponse
    {
        $waybill = trim($waybill);

        if (! preg_match(self::WAYBILL_PATTERN, $waybill)) {
            return response()->json([
                'ok' => false,
                'code' => 'INVALID_WAYBILL',
                'message' => 'Format nomor resi tidak valid. Nomor resi Anteraja terdiri dari 14 digit angka.',
            ], 422);
        }

        $shipment = Shipment::query()
            ->with(['trackingEvents', 'telemetry', 'latestNarrative', 'couriers'])
            ->find($waybill);

        if (! $shipment || $shipment->shipment_status === Shipment::STATUS_NOT_FOUND) {
            return response()->json([
                'ok' => false,
                'code' => 'NOT_FOUND',
                'message' => 'Nomor resi tidak ditemukan, mohon periksa kembali input Anda.',
            ], 404);
        }

        return response()->json([
            'ok' => true,
            'data' => new ShipmentTrackingResource($shipment),
        ]);
    }
}
