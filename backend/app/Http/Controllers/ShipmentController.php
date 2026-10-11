<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShipmentSummaryResource;
use App\Models\Shipment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * =============================================================================
 * ShipmentController.php - Controller Manajemen Daftar Kiriman & Sampel Resi
 * =============================================================================
 * FUNGSI UTAMA:
 * 1. Menyajikan daftar riwayat pengiriman paket dengan fitur pencarian dan filter (GET /shipments).
 * 2. Menyediakan sampel nomor resi untuk setiap skenario visual pengiriman (GET /shipments/samples).
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Filter Pencarian Fleksibel:
 *    Mendukung pencarian multi-kolom (nomor resi, nama penerima, atau nama pengirim)
 *    secara case-insensitive (`ilike`/`like`).
 * 2. Filter Skenario Antarmuka:
 *    Skenario UI (`normal`, `live`, `warning`, `delivered`) dihitung secara dinamis
 *    berdasarkan kombinasi status pesanan dan data telemetri IoT (GPS/hambatan rute).
 * 3. Sampel Uji Coba (Demo Chips):
 *    Menyediakan representasi 1 resi untuk setiap skenario guna mempermudah penguji/asesor
 *    mencoba seluruh variasi tampilan widget tanpa perlu mencari resi manual.
 * =============================================================================
 */
class ShipmentController extends Controller
{
    /** Daftar skenario visual tampilan yang didukung antarmuka */
    private const SCENARIOS = ['normal', 'live', 'warning', 'delivered'];

    /**
     * GET /api/v1/shipments
     * Menampilkan daftar kiriman berpaginasi dengan filter status, skenario, dan kata kunci.
     *
     * @param Request $request Request HTTP yang memuat query parameter
     * @return JsonResponse Koleksi resi terpaginasi beserta metadata
     */
    public function index(Request $request): JsonResponse
    {
        // 1. Validasi parameter input query string
        $validated = $request->validate([
            'status' => ['nullable', Rule::in(Shipment::MILESTONES)],
            'scenario' => ['nullable', Rule::in(self::SCENARIOS)],
            'search' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        // 2. Bangun query dasar (eager load telemetri, abaikan resi NOT_FOUND)
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

        // 3. Filter berdasarkan skenario visual (dievaluasi dinamis dari status & telemetri)
        if ($scenario = $validated['scenario'] ?? null) {
            $items = $query->get()->filter(fn (Shipment $s) => $s->scenario() === $scenario)->values();
            $items = $items->take($validated['per_page'] ?? 15);

            return response()->json([
                'ok' => true,
                'data' => ShipmentSummaryResource::collection($items),
            ]);
        }

        // 4. Paginasi standar untuk daftar resi umum
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
     * Mengambil 1 contoh resi untuk masing-masing skenario (Normal, GPS Live, Warning, Delivered).
     * Sangat berguna untuk tombol chip "Uji Coba Resi" di antarmuka frontend.
     *
     * @return JsonResponse Daftar resi perwakilan skenario dan contoh resi invalid (not found)
     */
    public function samples(): JsonResponse
    {
        // 1. Ambil seluruh kandidat kiriman beserta telemetri
        $shipments = Shipment::query()
            ->with('telemetry')
            ->orderBy('waybill_number')
            ->get();

        // 2. Petakan 1 sampel unik untuk setiap skenario yang tersedia
        $samples = collect(self::SCENARIOS)
            ->map(fn (string $scenario) => $shipments->first(fn (Shipment $s) => $s->scenario() === $scenario
                && $s->shipment_status !== Shipment::STATUS_NOT_FOUND))
            ->filter()
            ->values();

        // 3. Ambil juga contoh resi berstatus NOT_FOUND untuk pengujian skenario error
        $notFound = $shipments->firstWhere('shipment_status', Shipment::STATUS_NOT_FOUND);

        return response()->json([
            'ok' => true,
            'data' => ShipmentSummaryResource::collection($samples),
            'not_found_example' => $notFound?->waybill_number,
        ]);
    }
}
