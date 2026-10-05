<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TrackingFormRequest;
use App\Services\GeminiAIService;
use App\Services\MilestoneMapperService;
use App\Services\TrackingWidget;
use App\Support\CacheAman;
use Illuminate\Http\JsonResponse;

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
        $missingKey = 'tracking:waybill:not-found:'.$waybillNumber;

        if (CacheAman::ada($missingKey)) {
            return $this->notFoundResponse();
        }

        $shipment = CacheAman::ingat($cacheKey, 300, function () use ($waybillNumber, $missingKey): ?array {
            $shipment = $this->trackingWidget->dataWidget($waybillNumber);

            if ($shipment === null) {
                CacheAman::ingat($missingKey, 30, fn (): bool => true);

                return null;
            }

            $shipment = array_merge($shipment, $this->milestoneMapper->map($shipment));
            $shipment['ai_narrative'] = $this->geminiAI->generate($shipment);

            return $shipment;
        });

        if ($shipment === null) {
            return $this->notFoundResponse();
        }

        return response()->json([
            'ok' => true,
            'data' => $shipment,
        ]);
    }

    private function notFoundResponse(): JsonResponse
    {
        return response()->json([
            'ok' => false,
            'message' => 'Nomor resi tidak ditemukan. Mohon periksa kembali nomor resi yang Anda masukkan.',
        ], 404);
    }
}
