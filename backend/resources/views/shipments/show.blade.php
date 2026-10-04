@extends('layouts.app')

@section('title', 'Detail Pengiriman')

@section('content')
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
            <a href="{{ route('shipments.index') }}" class="text-sm font-semibold text-primary hover:underline">&larr; Kembali ke daftar</a>
            <h1 class="mt-3 text-3xl font-extrabold">Detail pengiriman</h1>
        </div>
        <a href="{{ route('shipments.edit', $shipment) }}" class="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-pink-700">Edit pengiriman</a>
    </div>

    <dl class="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
        <div class="bg-white p-5"><dt class="text-xs font-bold uppercase tracking-wide text-slate-500">Nomor resi</dt><dd class="mt-2 break-all font-mono font-bold">{{ $shipment->tracking_number }}</dd></div>
        <div class="bg-white p-5"><dt class="text-xs font-bold uppercase tracking-wide text-slate-500">Berat</dt><dd class="mt-2 font-semibold">{{ number_format((float) $shipment->weight_kg, 2, ',', '.') }} kg</dd></div>
        <div class="bg-white p-5"><dt class="text-xs font-bold uppercase tracking-wide text-slate-500">Status</dt><dd class="mt-2 font-semibold">{{ \App\Models\Shipment::STATUSES[$shipment->status] ?? $shipment->status }}</dd></div>
        <div class="bg-white p-5"><dt class="text-xs font-bold uppercase tracking-wide text-slate-500">Kurir</dt><dd class="mt-2 font-semibold">{{ $shipment->courier->name }}@if ($shipment->courier->rating !== null) <span class="font-normal text-slate-500">(rating {{ number_format((float) $shipment->courier->rating, 1, ',', '.') }}/5)</span>@endif</dd></div>
        <div class="bg-white p-5"><dt class="text-xs font-bold uppercase tracking-wide text-slate-500">Dibuat</dt><dd class="mt-2 font-semibold">{{ $shipment->created_at->format('d M Y H:i') }}</dd></div>
        <div class="bg-white p-5"><dt class="text-xs font-bold uppercase tracking-wide text-slate-500">Diperbarui</dt><dd class="mt-2 font-semibold">{{ $shipment->updated_at->format('d M Y H:i') }}</dd></div>
    </dl>
@endsection
