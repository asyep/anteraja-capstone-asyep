<form method="POST" action="{{ $formAction }}" class="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    @csrf
    @if ($httpMethod !== 'POST')
        @method($httpMethod)
    @endif

    <div>
        <label for="tracking_number" class="mb-2 block text-sm font-bold">Nomor resi</label>
        <input id="tracking_number" name="tracking_number" type="text" required maxlength="32" minlength="32" pattern="[A-Za-z0-9]{32}" autocomplete="off"
            value="{{ old('tracking_number', $shipment->tracking_number ?? '') }}" placeholder="32 karakter alfanumerik"
            class="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-pink-100">
        <p class="mt-1 text-xs text-slate-500">Mengikuti format waybill 32 karakter pada FRD project.</p>
        @error('tracking_number') <p class="mt-1 text-sm text-rose-700">{{ $message }}</p> @enderror
    </div>

    <div>
        <label for="weight_kg" class="mb-2 block text-sm font-bold">Berat paket (kg)</label>
        <input id="weight_kg" name="weight_kg" type="number" required min="0.01" max="999999.99" step="0.01"
            value="{{ old('weight_kg', $shipment->weight_kg ?? '') }}"
            class="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-pink-100">
        @error('weight_kg') <p class="mt-1 text-sm text-rose-700">{{ $message }}</p> @enderror
    </div>

    <div>
        <label for="status" class="mb-2 block text-sm font-bold">Status</label>
        <select id="status" name="status" required class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-pink-100">
            <option value="">Pilih status</option>
            @foreach ($statuses as $value => $label)
                <option value="{{ $value }}" @selected(old('status', $shipment->status ?? 'created') === $value)>{{ $label }}</option>
            @endforeach
        </select>
        @error('status') <p class="mt-1 text-sm text-rose-700">{{ $message }}</p> @enderror
    </div>

    <div>
        <label for="courier_id" class="mb-2 block text-sm font-bold">Kurir</label>
        <select id="courier_id" name="courier_id" required class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-pink-100">
            <option value="">Pilih kurir</option>
            @foreach ($couriers as $courier)
                <option value="{{ $courier->id }}" @selected((string) old('courier_id', $shipment->courier_id ?? '') === (string) $courier->id)>
                    {{ $courier->name }}@if ($courier->rating !== null) - Rating {{ number_format((float) $courier->rating, 1, ',', '.') }}@endif
                </option>
            @endforeach
        </select>
        @if ($couriers->isEmpty())
            <p class="mt-2 text-sm text-amber-800">Belum ada kurir. <a href="{{ route('couriers.create') }}" class="font-bold underline">Tambahkan kurir</a> terlebih dahulu.</p>
        @endif
        @error('courier_id') <p class="mt-1 text-sm text-rose-700">{{ $message }}</p> @enderror
    </div>

    <div class="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
        <button type="submit" class="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-pink-700">{{ $submitLabel }}</button>
        <a href="{{ route('shipments.index') }}" class="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Batal</a>
    </div>
</form>
