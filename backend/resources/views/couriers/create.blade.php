@extends('layouts.app')

@section('title', 'Tambah Kurir')

@section('content')
    <div class="mb-6">
        <a href="{{ route('couriers.index') }}" class="text-sm font-semibold text-primary hover:underline">&larr; Kembali ke kurir</a>
        <h1 class="mt-3 text-3xl font-extrabold">Tambah kurir</h1>
    </div>
    @include('couriers._form', ['formAction' => route('couriers.store'), 'httpMethod' => 'POST', 'submitLabel' => 'Simpan kurir'])
@endsection
