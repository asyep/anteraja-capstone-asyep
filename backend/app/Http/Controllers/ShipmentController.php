<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShipmentSummaryResource;
use App\Models\Shipment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ShipmentController extends Controller
{
    private const SCENARIOS = ['normal', 'live', 'warning', 'delivered'];

    /**
     * GET /api/v1/shipments?status=&scenario=&search=&per_page=
     * Daftar kiriman (riwayat / smart widget).
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', Rule::in(Shipment::MILESTONES)],
            'scenario' => ['nullable', Rule::in(self::SCENARIOS)],
            'search' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Shipment::query()
            ->with('telemetry')
            ->where('shipment_status', '!=', Shipment::STATUS_NOT_FOUND)
            ->when($validated['status'] ?? null, fn ($q, $status) => $q->where('shipment_status', $status))
            ->when($validated['search'] ?? null, function ($q, $search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('waybill_number', 'like', "%{$search}%")
                        ->orWhere('receiver_name', 'ilike', "%{$search}%")
                        ->orWhere('sender_name', 'ilike', "%{$search}%");
                });
            })
            ->orderByDesc('purchase_date');

        // Skenario dihitung dari beberapa tabel, jadi difilter setelah data dimuat.
        if ($scenario = $validated['scenario'] ?? null) {
            $items = $query->get()->filter(fn (Shipment $s) => $s->scenario() === $scenario)->values();
            $items = $items->take($validated['per_page'] ?? 15);

            return response()->json([
                'ok' => true,
                'data' => ShipmentSummaryResource::collection($items),
            ]);
        }

        $page = $query->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'ok' => true,
            'data' => ShipmentSummaryResource::collection($page->items()),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
                'per_page' => $page->perPage(),
                'total' => $page->total(),
            ],
        ]);
    }

    /**
     * GET /api/v1/shipments/samples
     * Satu contoh resi per skenario tampilan, untuk chip "Uji Coba Resi" di frontend.
     */
    public function samples(): JsonResponse
    {
        $shipments = Shipment::query()
            ->with('telemetry')
            ->orderBy('waybill_number')
            ->get();

        $samples = collect(self::SCENARIOS)
            ->map(fn (string $scenario) => $shipments->first(fn (Shipment $s) => $s->scenario() === $scenario
                && $s->shipment_status !== Shipment::STATUS_NOT_FOUND))
            ->filter()
            ->values();

        $notFound = $shipments->firstWhere('shipment_status', Shipment::STATUS_NOT_FOUND);

        return response()->json([
            'ok' => true,
            'data' => ShipmentSummaryResource::collection($samples),
            'not_found_example' => $notFound?->waybill_number,
        ]);
    }
}
