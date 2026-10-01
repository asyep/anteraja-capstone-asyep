<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TrackingFormRequest;
use App\Services\GeminiAIService;
use App\Services\MilestoneMapperService;
use App\Services\TrackingWidget;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class TrackingController extends Controller
{
    public function __construct(
        private TrackingWidget $trackingWidget,
        private MilestoneMapperService $milestoneMapper,
        private GeminiAIService $geminiAI,
    ) {}

    public function show(TrackingFormRequest $request): JsonResponse
    {
        $waybillNumber = $request->validated('waybill_number');
        $cacheKey = 'tracking:waybill:'.$waybillNumber;

        if (Cache::has($cacheKey)) {
            return response()->json([
                'ok' => true,
                'data' => Cache::get($cacheKey),
            ]);
        }

        $shipment = $this->trackingWidget->dataWidget($waybillNumber);

        if ($shipment === null) {
            return response()->json([
                'ok' => false,
                'message' => 'Nomor resi tidak ditemukan. Mohon periksa kembali nomor resi yang Anda masukkan.',
            ], 404);
        }

        $shipment = array_merge($shipment, $this->milestoneMapper->map($shipment));
        $shipment['ai_narrative'] = $this->geminiAI->generate($shipment);

        Cache::put($cacheKey, $shipment, now()->addMinutes(5));

        return response()->json([
            'ok' => true,
            'data' => $shipment,
        ]);
    }
}
