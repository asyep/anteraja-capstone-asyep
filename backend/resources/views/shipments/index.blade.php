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

    <form method="GET" action="{{ route('shipments.index') }}" class="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label class="grid gap-1 text-sm font-semibold text-slate-700">
            Cari nomor resi
            <input name="q" value="{{ request('q') }}" maxlength="32" class="rounded-lg border-slate-300 text-sm" placeholder="Masukkan nomor resi">
        </label>
        <label class="grid gap-1 text-sm font-semibold text-slate-700">
            Status
            <select name="status" class="rounded-lg border-slate-300 text-sm">
                <option value="">Semua status</option>
                @foreach (\App\Models\Shipment::STATUSES as $value => $label)
                    <option value="{{ $value }}" @selected(request('status') === $value)>{{ $label }}</option>
                @endforeach
            </select>
        </label>
        <label class="grid gap-1 text-sm font-semibold text-slate-700">
            Baris per halaman
            <select name="per_page" class="rounded-lg border-slate-300 text-sm">
                @foreach ([10, 25, 50] as $size)
                    <option value="{{ $size }}" @selected((int) request('per_page', 10) === $size)>{{ $size }}</option>
                @endforeach
            </select>
        </label>
        <button class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white">Terapkan</button>
        <a href="{{ route('shipments.index') }}" class="px-2 py-2 text-sm font-semibold text-slate-600 hover:underline">Reset</a>
    </form>

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
                            <th class="px-5 py-4"><a href="{{ route('shipments.index', array_merge(request()->query(), ['sort' => 'tracking_number', 'direction' => request('sort') === 'tracking_number' && request('direction') === 'asc' ? 'desc' : 'asc'])) }}" class="hover:underline">Nomor resi</a></th>
                            <th class="px-5 py-4"><a href="{{ route('shipments.index', array_merge(request()->query(), ['sort' => 'weight_kg', 'direction' => request('sort') === 'weight_kg' && request('direction') === 'asc' ? 'desc' : 'asc'])) }}" class="hover:underline">Berat</a></th>
                            <th class="px-5 py-4"><a href="{{ route('shipments.index', array_merge(request()->query(), ['sort' => 'status', 'direction' => request('sort') === 'status' && request('direction') === 'asc' ? 'desc' : 'asc'])) }}" class="hover:underline">Status</a></th>
                            <th class="px-5 py-4">Status perjalanan terbaru</th>
                            <th class="px-5 py-4">Feedback</th>
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
                                <td class="whitespace-nowrap px-5 py-4">{{ $shipment->latestTrackingEvent?->event_code ?? '-' }}</td>
                                <td class="whitespace-nowrap px-5 py-4">{{ $shipment->feedback_count }}</td>
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
