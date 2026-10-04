<?php

namespace App\Http\Controllers;

use App\Models\Courier;
use App\Models\Shipment;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ShipmentController extends Controller
{
    public function index(): View
    {
        $shipments = Shipment::query()
            ->with('courier')
            ->latest()
            ->paginate(10);

        return view('shipments.index', compact('shipments'));
    }

    public function create(): View
    {
        $couriers = Courier::query()->orderBy('name')->get();
        $statuses = Shipment::STATUSES;

        return view('shipments.create', compact('couriers', 'statuses'));
    }

    public function store(Request $request): RedirectResponse
    {
        $shipment = Shipment::create($this->validatedData($request));

        return redirect()
            ->route('shipments.show', $shipment)
            ->with('status', 'Data pengiriman berhasil ditambahkan.');
    }

    public function show(Shipment $shipment): View
    {
        $shipment->load('courier');

        return view('shipments.show', compact('shipment'));
    }

    public function edit(Shipment $shipment): View
    {
        $couriers = Courier::query()->orderBy('name')->get();
        $statuses = Shipment::STATUSES;

        return view('shipments.edit', compact('shipment', 'couriers', 'statuses'));
    }

    public function update(Request $request, Shipment $shipment): RedirectResponse
    {
        $shipment->update($this->validatedData($request, $shipment));

        return redirect()
            ->route('shipments.show', $shipment)
            ->with('status', 'Data pengiriman berhasil diperbarui.');
    }

    public function destroy(Shipment $shipment): RedirectResponse
    {
        $shipment->delete();

        return redirect()
            ->route('shipments.index')
            ->with('status', 'Data pengiriman berhasil dihapus.');
    }

    /**
     * @return array{tracking_number: string, weight_kg: string, status: string, courier_id: string}
     */
    private function validatedData(Request $request, ?Shipment $shipment = null): array
    {
        return $request->validate(
            [
                'tracking_number' => [
                    'required',
                    'string',
                    'regex:/^[A-Za-z0-9]{32}$/',
                    Rule::unique('shipments', 'tracking_number')->ignore($shipment),
                ],
                'weight_kg' => ['required', 'numeric', 'gt:0', 'max:999999.99'],
                'status' => ['required', Rule::in(array_keys(Shipment::STATUSES))],
                'courier_id' => ['required', 'integer', Rule::exists('couriers', 'id')],
            ],
            [
                'tracking_number.required' => 'Nomor resi wajib diisi.',
                'tracking_number.regex' => 'Nomor resi harus 32 karakter alfanumerik.',
                'tracking_number.unique' => 'Nomor resi sudah terdaftar.',
                'weight_kg.required' => 'Berat paket wajib diisi.',
                'weight_kg.numeric' => 'Berat paket harus berupa angka.',
                'weight_kg.gt' => 'Berat paket harus lebih dari 0 kg.',
                'status.required' => 'Status pengiriman wajib dipilih.',
                'status.in' => 'Status pengiriman tidak valid.',
                'courier_id.required' => 'Kurir wajib dipilih.',
                'courier_id.exists' => 'Kurir yang dipilih tidak ditemukan.',
            ],
        );
    }
}
