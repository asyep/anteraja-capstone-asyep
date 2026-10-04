@extends('layouts.app')

@section('title', 'Edit Pengiriman')

@section('content')
    <div class="mb-6">
        <a href="{{ route('shipments.show', $shipment) }}" class="text-sm font-semibold text-primary hover:underline">&larr; Kembali ke detail</a>
        <h1 class="mt-3 text-3xl font-extrabold">Edit pengiriman</h1>
        <p class="mt-2 text-sm text-slate-600">Perbarui berat, status, kurir, atau nomor resi.</p>
    </div>
    @include('shipments._form', ['formAction' => route('shipments.update', $shipment), 'httpMethod' => 'PUT', 'submitLabel' => 'Simpan perubahan'])
@endsection
