<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Manajemen Pengiriman') - Anteraja</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { theme: { extend: { colors: { primary: '#E20074' } } } };
    </script>
</head>
<body class="min-h-screen bg-slate-50 text-slate-900 antialiased">
    <header class="border-b border-slate-200 bg-white">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <a href="{{ route('widget') }}" class="text-lg font-extrabold text-primary">Anteraja Tracking</a>
            <nav class="flex flex-wrap gap-2 text-sm font-semibold" aria-label="Navigasi utama">
                <a href="{{ route('shipments.index') }}" class="rounded-lg px-3 py-2 {{ request()->routeIs('shipments.*') ? 'bg-pink-50 text-primary' : 'text-slate-600 hover:bg-slate-100' }}">Pengiriman</a>
                <a href="{{ route('couriers.index') }}" class="rounded-lg px-3 py-2 {{ request()->routeIs('couriers.*') ? 'bg-pink-50 text-primary' : 'text-slate-600 hover:bg-slate-100' }}">Kurir</a>
                <a href="{{ route('widget') }}" class="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Widget tracking</a>
            </nav>
        </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        @if (session('status'))
            <div class="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">
                {{ session('status') }}
            </div>
        @endif

        @if ($errors->any())
            <div class="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
                <p class="font-bold">Periksa kembali data berikut:</p>
                <ul class="mt-2 list-inside list-disc">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @yield('content')
    </main>
</body>
</html>
