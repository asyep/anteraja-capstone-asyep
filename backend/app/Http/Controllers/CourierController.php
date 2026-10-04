<?php

namespace App\Http\Controllers;

use App\Models\Courier;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CourierController extends Controller
{
    public function index(): View
    {
        $couriers = Courier::query()
            ->withCount('shipments')
            ->orderBy('name')
            ->paginate(10);

        return view('couriers.index', compact('couriers'));
    }

    public function create(): View
    {
        return view('couriers.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $courier = Courier::create($this->validatedData($request));

        return redirect()
            ->route('couriers.index')
            ->with('status', "Kurir {$courier->name} berhasil ditambahkan.");
    }

    public function edit(Courier $courier): View
    {
        return view('couriers.edit', compact('courier'));
    }

    public function update(Request $request, Courier $courier): RedirectResponse
    {
        $courier->update($this->validatedData($request));

        return redirect()
            ->route('couriers.index')
            ->with('status', "Data kurir {$courier->name} berhasil diperbarui.");
    }

    public function destroy(Courier $courier): RedirectResponse
    {
        if ($courier->shipments()->exists()) {
            return redirect()
                ->route('couriers.index')
                ->withErrors(['courier' => 'Kurir masih terhubung dengan data pengiriman dan tidak dapat dihapus.']);
        }

        $courier->delete();

        return redirect()
            ->route('couriers.index')
            ->with('status', 'Data kurir berhasil dihapus.');
    }

    /**
     * @return array{name: string, rating: string|null}
     */
    private function validatedData(Request $request): array
    {
        return $request->validate(
            [
                'name' => ['required', 'string', 'max:100'],
                'rating' => ['nullable', 'numeric', 'between:0,5'],
            ],
            [
                'name.required' => 'Nama kurir wajib diisi.',
                'name.max' => 'Nama kurir maksimal 100 karakter.',
                'rating.numeric' => 'Rating harus berupa angka.',
                'rating.between' => 'Rating harus berada di antara 0 dan 5.',
            ],
        );
    }
}
