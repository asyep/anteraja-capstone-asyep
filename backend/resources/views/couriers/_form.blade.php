<form method="POST" action="{{ $formAction }}" class="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    @csrf
    @if ($httpMethod !== 'POST')
        @method($httpMethod)
    @endif

    <div>
        <label for="name" class="mb-2 block text-sm font-bold">Nama kurir</label>
        <input id="name" name="name" type="text" required maxlength="100" value="{{ old('name', $courier->name ?? '') }}"
            class="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-pink-100">
        @error('name') <p class="mt-1 text-sm text-rose-700">{{ $message }}</p> @enderror
    </div>

    <div>
        <label for="rating" class="mb-2 block text-sm font-bold">Rating (0-5, opsional)</label>
        <input id="rating" name="rating" type="number" min="0" max="5" step="0.1" value="{{ old('rating', $courier->rating ?? '') }}"
            class="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-pink-100">
        @error('rating') <p class="mt-1 text-sm text-rose-700">{{ $message }}</p> @enderror
    </div>

    <div class="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
        <button type="submit" class="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-pink-700">{{ $submitLabel }}</button>
        <a href="{{ route('couriers.index') }}" class="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Batal</a>
    </div>
</form>
