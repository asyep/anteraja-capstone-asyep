@extends('layouts.app')

@section('title', 'Edit Kurir')

@section('content')
    <div class="mb-6">
        <a href="{{ route('couriers.index') }}" class="text-sm font-semibold text-primary hover:underline">&larr; Kembali ke kurir</a>
        <h1 class="mt-3 text-3xl font-extrabold">Edit kurir</h1>
        <p class="mt-2 text-sm text-slate-600">Perbarui nama atau rating kurir.</p>
    </div>
    @include('couriers._form', ['formAction' => route('couriers.update', $courier), 'httpMethod' => 'PUT', 'submitLabel' => 'Simpan perubahan'])
@endsection
