@extends('layouts.app')

@section('title', 'Tambah Pengiriman')

@section('content')
    <div class="mb-6">
        <a href="{{ route('shipments.index') }}" class="text-sm font-semibold text-primary hover:underline">&larr; Kembali ke pengiriman</a>
        <h1 class="mt-3 text-3xl font-extrabold">Tambah pengiriman</h1>
        <p class="mt-2 text-sm text-slate-600">Isi data resi dan hubungkan ke kurir yang bertugas.</p>
    </div>
    @include('shipments._form', ['formAction' => route('shipments.store'), 'httpMethod' => 'POST', 'submitLabel' => 'Simpan pengiriman'])
@endsection
