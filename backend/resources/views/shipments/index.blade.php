@extends('layouts.app')

@section('title', 'Data Pengiriman')

@section('content')
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
            <p class="text-sm font-bold uppercase tracking-wide text-primary">Day 13 - Laravel CRUD</p>
            <h1 class="mt-1 text-3xl font-extrabold">Data pengiriman</h1>
            <p class="mt-2 text-sm text-slate-600">Kelola resi dan kurir yang menangani pengiriman.</p>
        </div>
        <a href="{{ route('shipments.create') }}" class="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-pink-700">Tambah pengiriman</a>
    </div>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        @if ($shipments->isEmpty())
            <div class="px-6 py-12 text-center">
                <h2 class="font-bold">Belum ada data pengiriman</h2>
                <p class="mt-2 text-sm text-slate-600">Tambahkan pengiriman atau jalankan database seeder untuk memuat data contoh.</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                        <tr>
                            <th class="px-5 py-4">Nomor resi</th>
                            <th class="px-5 py-4">Berat</th>
                            <th class="px-5 py-4">Status</th>
                            <th class="px-5 py-4">Kurir</th>
                            <th class="px-5 py-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach ($shipments as $shipment)
                            <tr class="hover:bg-slate-50">
                                <td class="whitespace-nowrap px-5 py-4 font-mono font-semibold">{{ $shipment->tracking_number }}</td>
                                <td class="whitespace-nowrap px-5 py-4">{{ number_format((float) $shipment->weight_kg, 2, ',', '.') }} kg</td>
                                <td class="whitespace-nowrap px-5 py-4">{{ \App\Models\Shipment::STATUSES[$shipment->status] ?? $shipment->status }}</td>
                                <td class="whitespace-nowrap px-5 py-4">{{ $shipment->courier->name }}</td>
                                <td class="whitespace-nowrap px-5 py-4">
                                    <div class="flex items-center gap-3">
                                        <a href="{{ route('shipments.show', $shipment) }}" class="font-semibold text-primary hover:underline">Detail</a>
                                        <a href="{{ route('shipments.edit', $shipment) }}" class="font-semibold text-slate-700 hover:underline">Edit</a>
                                        <form method="POST" action="{{ route('shipments.destroy', $shipment) }}" onsubmit="return confirm('Hapus data pengiriman ini?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="font-semibold text-rose-700 hover:underline">Hapus</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div class="border-t border-slate-200 px-5 py-4">{{ $shipments->links() }}</div>
        @endif
    </div>
@endsection
