<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TrackingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * TrackingController
 *
 * Menggantikan tiga endpoint PHP lama:
 *   - tracking.php        → show()
 *   - tracking-widget.php → show()         (sama, digabung)
 *   - shipment-history.php → history()
 *   - tracking-download.php → download()
 *
 * Route (didefinisikan di routes/api.php):
 *   GET  /api/tracking/{resi}
 *   GET  /api/tracking/{resi}/history
 *   GET  /api/tracking/{resi}/download
 */
class TrackingController extends Controller
{
    public function __construct(private readonly TrackingService $service) {}

    /**
     * Menampilkan data lengkap widget untuk satu nomor resi.
     * Menggantikan tracking.php + tracking-widget.php.
     *
     * GET /api/tracking/{resi}
     */
    public function show(string $resi): JsonResponse
    {
        $resi = trim($resi);

        if (strlen($resi) !== 32) {
            return response()->json([
                'ok'    => false,
                'pesan' => 'Nomor resi harus persis 32 karakter.',
            ], 422);
        }

        $data = $this->service->dataWidget($resi);

        if (! $data) {
            return response()->json([
                'ok'    => false,
                'pesan' => 'Nomor resi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'ok'   => true,
            'data' => $data,
        ]);
    }

    /**
     * Menampilkan riwayat event pengiriman singkat.
     * Menggantikan shipment-history.php.
     *
     * GET /api/tracking/{resi}/history
     */
    public function history(string $resi): JsonResponse
    {
        $resi = trim($resi);

        if (strlen($resi) !== 32) {
            return response()->json([
                'ok'    => false,
                'pesan' => 'Nomor resi harus persis 32 karakter.',
            ], 422);
        }

        $riwayat = $this->service->riwayatSingkat($resi);

        return response()->json([
            'ok'      => true,
            'resi'    => $resi,
            'riwayat' => $riwayat,
        ]);
    }

    /**
     * Mengunduh riwayat pengiriman sebagai file teks.
     * Menggantikan tracking-download.php.
     *
     * GET /api/tracking/{resi}/download
     */
    public function download(string $resi): Response
    {
        $resi = trim($resi);

        if (strlen($resi) !== 32) {
            abort(422, 'Nomor resi harus persis 32 karakter.');
        }

        $data = $this->service->dataWidget($resi);

        if (! $data) {
            abort(404, 'Nomor resi tidak ditemukan.');
        }

        $isiFile   = $this->service->formatUnduhan($data);
        $namaFile  = 'tracking-' . preg_replace('/[^A-Za-z0-9_-]/', '', $resi) . '.txt';

        return response($isiFile, 200)
            ->header('Content-Type', 'text/plain; charset=UTF-8')
            ->header('Content-Disposition', "attachment; filename=\"{$namaFile}\"");
    }
}
