@extends('layouts.app')

@section('title', 'Data Kurir')

@section('content')
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
            <p class="text-sm font-bold uppercase tracking-wide text-primary">Data master</p>
            <h1 class="mt-1 text-3xl font-extrabold">Data kurir</h1>
            <p class="mt-2 text-sm text-slate-600">Kelola kurir yang dapat dipilih pada data pengiriman.</p>
        </div>
        <a href="{{ route('couriers.create') }}" class="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-pink-700">Tambah kurir</a>
    </div>

    @if ($errors->has('courier'))
        <div class="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">{{ $errors->first('courier') }}</div>
    @endif

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        @if ($couriers->isEmpty())
            <div class="px-6 py-12 text-center">
                <h2 class="font-bold">Belum ada data kurir</h2>
                <p class="mt-2 text-sm text-slate-600">Tambahkan kurir atau jalankan database seeder untuk data contoh.</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                        <tr><th class="px-5 py-4">Nama kurir</th><th class="px-5 py-4">Rating</th><th class="px-5 py-4">Jumlah pengiriman</th><th class="px-5 py-4">Aksi</th></tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach ($couriers as $courier)
                            <tr class="hover:bg-slate-50">
                                <td class="px-5 py-4 font-semibold">{{ $courier->name }}</td>
                                <td class="whitespace-nowrap px-5 py-4">@if ($courier->rating !== null) {{ number_format((float) $courier->rating, 1, ',', '.') }} / 5 @else Belum dinilai @endif</td>
                                <td class="px-5 py-4">{{ $courier->shipments_count }}</td>
                                <td class="whitespace-nowrap px-5 py-4">
                                    <div class="flex items-center gap-3">
                                        <a href="{{ route('couriers.edit', $courier) }}" class="font-semibold text-primary hover:underline">Edit</a>
                                        @if ($courier->shipments_count === 0)
                                            <form method="POST" action="{{ route('couriers.destroy', $courier) }}" onsubmit="return confirm('Hapus data kurir ini?')">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="font-semibold text-rose-700 hover:underline">Hapus</button>
                                            </form>
                                        @else
                                            <span class="text-xs text-slate-500">Terhubung ke pengiriman</span>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div class="border-t border-slate-200 px-5 py-4">{{ $couriers->links() }}</div>
        @endif
    </div>
@endsection
