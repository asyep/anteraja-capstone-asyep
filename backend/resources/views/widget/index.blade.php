<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Smart AI Shipment Tracking – Anteraja</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#E20074', // Magenta Anteraja
            success: '#10B981',
            warning: '#F59E0B'
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50 text-gray-900 p-8 font-sans antialiased min-h-screen">
  <div class="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">

    {{-- Header logo + judul --}}
    <div class="mb-6 flex items-center gap-3">
      <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900">Satria Smart Widget</h1>
        <p class="text-sm text-gray-500">UX Eksploratif Anteraja Prototype · Laravel Edition</p>
      </div>
      <a href="{{ route('shipments.index') }}" class="ml-auto rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-[#c9006e]">
        Kelola Pengiriman
      </a>
    </div>

    {{-- Interaksi 2: Dynamic Personalized Greeting Header --}}
    <div id="user-greeting-banner" class="mb-8 p-4 bg-primary/10 text-primary rounded-xl font-medium">
      {{-- Injected via JS --}}
    </div>

    {{-- Interaksi 1: Form Input Search Resi Validation --}}
    <form id="tracking-form" class="mb-8 bg-gray-50 p-5 rounded-xl border border-gray-200">
      @csrf
      <div class="flex flex-col gap-2">
        <label for="input-resi" class="font-bold text-gray-800">
          Cari Resi <span class="text-xs font-normal text-gray-500">(Harus 32 Karakter)</span>
        </label>
        <div class="flex flex-col sm:flex-row gap-3">
          <input type="text" id="input-resi"
            class="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-sm"
            placeholder="Contoh: 00010242fe8c5a6d1ba2dd792cb16214">
          <button type="submit" id="btn-lacak" disabled
            class="bg-primary text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] transition-all hover:bg-[#c9006e]">
            Lacak Paket
          </button>
        </div>
        <span id="resi-warning" class="text-red-500 text-sm font-semibold hidden mt-1">
          Nomor resi harus persis 32 karakter
        </span>
      </div>
    </form>

    {{-- Hasil tracking (ditampilkan setelah fetch API) --}}
    <div id="tracking-result" class="hidden mb-8"></div>

    {{-- Interaksi 3: Interactive Shipping Fee & ETA Calculator --}}
    <div class="mb-8 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Kalkulator Ongkir & ETA Dinamis
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label for="input-weight" class="text-sm font-bold text-gray-700 block mb-1">Berat Paket (Kg)</label>
          <input type="number" id="input-weight" min="1" value="1"
            class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all bg-gray-50">
        </div>
        <div>
          <label for="select-service" class="text-sm font-bold text-gray-700 block mb-1">Layanan Pengiriman</label>
          <select id="select-service" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all bg-gray-50">
            <option value="reguler">Reguler</option>
            <option value="nextday">NextDay</option>
            <option value="sameday">SameDay</option>
          </select>
        </div>
      </div>
      <div class="flex flex-wrap justify-between items-center text-lg font-bold bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div class="flex flex-col">
          <span class="text-xs text-gray-500 font-medium uppercase tracking-wide">Estimasi Biaya</span>
          <span id="ongkir-display" class="text-primary text-xl">Rp 10.000</span>
        </div>
        <div class="w-px h-10 bg-gray-200 hidden sm:block"></div>
        <div class="flex flex-col text-right">
          <span class="text-xs text-gray-500 font-medium uppercase tracking-wide">Perkiraan Tiba</span>
          <span id="eta-display" class="text-success text-xl">...</span>
        </div>
      </div>
    </div>

    {{-- Interaksi 5: Operational Warning Banner Toggle & AI Narrative --}}
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-800">Simulasi Kondisi Operasional</h3>
        <button id="toggle-delay-sim" type="button"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
          Simulasikan Kendala Cuaca/Macet
        </button>
      </div>

      <div id="warning-banner"
        class="hidden bg-warning/10 border-l-4 border-warning text-yellow-900 p-4 rounded-xl mb-4 transition-all duration-300 flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-warning shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="font-medium">Perhatian: Terdapat kendala Kemacetan Lalu Lintas di jalur transit.</div>
      </div>

      <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl relative overflow-hidden transition-colors duration-300">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
        <h4 class="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Satria Assistant AI
        </h4>
        <p id="ai-narrative-box" class="text-sm text-blue-800 italic font-medium leading-relaxed transition-colors duration-300">
          "Halo Kak! Paketmu sedang dalam perjalanan dengan aman bersama kurir Satria kami."
        </p>
      </div>
    </div>

    {{-- Interaksi 4: Dynamic Status Timeline Filter --}}
    <div class="bg-gray-50 p-5 rounded-xl border border-gray-200">
      <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Timeline Perjalanan Terfilter
      </h3>
      <div class="flex flex-wrap gap-2 mb-5" id="status-filters">
        <button class="filter-btn bg-[#E20074] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-all" data-status="Semua">Semua</button>
        <button class="filter-btn bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-300 transition-all" data-status="In Transit">In Transit</button>
        <button class="filter-btn bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-300 transition-all" data-status="Delivered">Delivered</button>
        <button class="filter-btn bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-300 transition-all" data-status="Delayed">Delayed</button>
      </div>
      <div id="timeline-container"
        class="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
        {{-- Injected via JS --}}
      </div>
    </div>

  </div>

  <script>
    // ==========================================
    // CONFIG — URL endpoint Laravel API
    // ==========================================
    const API_BASE = '{{ url('/api') }}';
    const CSRF     = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // ==========================================
    // DATA MOCKUPS & UTILS
    // ==========================================
    const MOCK_TIMELINE = [
      { id: 1, title: 'Paket Diterima di Hub',           status: 'In Transit', date: '26 Sep 2024' },
      { id: 2, title: 'Dalam Perjalanan ke Kota Tujuan', status: 'In Transit', date: '27 Sep 2024' },
      { id: 3, title: 'Paket Sedang Diantar Kurir',      status: 'In Transit', date: '28 Sep 2024' },
      { id: 4, title: 'Paket Selesai Dikirim',           status: 'Delivered',  date: '29 Sep 2024' },
      { id: 5, title: 'Kendala Rute / Cuaca',            status: 'Delayed',    date: '28 Sep 2024' }
    ];

    const SERVICE_RATES = { reguler: 10000, nextday: 15000, sameday: 25000 };

    // ==========================================
    // 1. Form Validation & Fetch ke /api/tracking/{resi}
    // Menggantikan: tracking.php / tracking-widget.php
    // ==========================================
    const initSearchValidation = () => {
      const inputResi   = document.getElementById('input-resi');
      const btnLacak    = document.getElementById('btn-lacak');
      const resiWarning = document.getElementById('resi-warning');
      const form        = document.getElementById('tracking-form');
      const result      = document.getElementById('tracking-result');

      if (!inputResi || !btnLacak || !form) return;

      inputResi.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        const ok  = val.length === 32;
        resiWarning.classList.toggle('hidden', ok);
        btnLacak.disabled = !ok;
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (btnLacak.disabled) return;

        const resi = inputResi.value.trim();
        btnLacak.disabled = true;
        btnLacak.innerHTML = `<svg class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Loading...`;

        try {
          // Fetch ke endpoint Laravel: GET /api/tracking/{resi}
          const res  = await fetch(`${API_BASE}/tracking/${resi}`);
          const json = await res.json();

          if (!json.ok) {
            result.innerHTML = `<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">${json.pesan}</div>`;
          } else {
            const d = json.data;
            result.innerHTML = `
              <div class="p-5 bg-green-50 border border-green-200 rounded-xl">
                <h3 class="font-bold text-green-800 mb-3">📦 Data Resi Ditemukan</h3>
                <dl class="grid grid-cols-2 gap-2 text-sm">
                  <dt class="text-gray-500">Status</dt>     <dd class="font-bold uppercase">${d.status}</dd>
                  <dt class="text-gray-500">Asal</dt>       <dd>${d.kota_asal ?? '-'}</dd>
                  <dt class="text-gray-500">Tujuan</dt>     <dd>${d.kota_tujuan}</dd>
                  <dt class="text-gray-500">Est. Tiba</dt>  <dd>${d.estimasi_tiba}</dd>
                  <dt class="text-gray-500">Ongkir</dt>     <dd>${new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(d.total_ongkir)}</dd>
                  <dt class="text-gray-500">Keterlambatan</dt><dd>${d.ada_keterlambatan ? '⚠️ ' + d.alasan_delay : '✅ Tidak ada'}</dd>
                </dl>
                ${d.narasi_ai ? `<p class="mt-3 text-sm text-blue-800 italic border-t pt-3">"${d.narasi_ai.teks}"</p>` : ''}
                <a href="${API_BASE}/tracking/${resi}/download"
                   class="mt-4 inline-block text-xs text-primary underline">⬇ Unduh riwayat .txt</a>
              </div>`;

            // Update AI narrative box dengan data nyata
            if (d.narasi_ai) {
              document.getElementById('ai-narrative-box').innerText = `"${d.narasi_ai.teks}"`;
            }
          }
          result.classList.remove('hidden');
        } catch (err) {
          result.innerHTML = `<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">Gagal menghubungi server: ${err.message}</div>`;
          result.classList.remove('hidden');
        } finally {
          btnLacak.disabled = false;
          btnLacak.innerText = 'Lacak Paket';
        }
      });
    };

    // ==========================================
    // 2. Dynamic Personalized Greeting Header
    // ==========================================
    const initPersonalizedGreeting = () => {
      const banner = document.getElementById('user-greeting-banner');
      if (!banner) return;
      if (!sessionStorage.getItem('activeUser')) {
        sessionStorage.setItem('activeUser', 'Kak Asep');
      }
      const activeUser = sessionStorage.getItem('activeUser');
      banner.innerHTML = `👋 Halo <strong>${activeUser}</strong>! Satria siap membantu melacak posisi paketmu.`;
    };

    // ==========================================
    // 3. Interactive Shipping Fee & ETA Calculator
    // ==========================================
    const initCalculator = () => {
      const inputWeight  = document.getElementById('input-weight');
      const selectSvc    = document.getElementById('select-service');
      const ongkirDisplay= document.getElementById('ongkir-display');
      const etaDisplay   = document.getElementById('eta-display');
      if (!inputWeight || !selectSvc) return;

      const calculate = () => {
        const weight  = parseFloat(inputWeight.value) || 1;
        const service = selectSvc.value;
        const fee     = weight * SERVICE_RATES[service];
        ongkirDisplay.innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(fee);

        const today = new Date();
        const days  = { reguler: 3, nextday: 1, sameday: 0 };
        today.setDate(today.getDate() + days[service]);
        etaDisplay.innerText = service === 'sameday' ? 'Hari ini'
          : today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      };

      inputWeight.addEventListener('input', calculate);
      selectSvc.addEventListener('change', calculate);
      calculate();
    };

    // ==========================================
    // 4. Dynamic Status Timeline Filter
    // ==========================================
    const initTimelineFilter = () => {
      const container = document.getElementById('timeline-container');
      const filters   = document.querySelectorAll('.filter-btn');
      if (!container || !filters.length) return;

      const renderTimeline = (statusFilter) => {
        container.innerHTML = '';
        const data = statusFilter === 'Semua' ? MOCK_TIMELINE
          : MOCK_TIMELINE.filter(i => i.status === statusFilter);

        if (!data.length) {
          container.innerHTML = `<div class="p-4 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">Tidak ada paket dengan status ini.</div>`;
          return;
        }

        data.forEach(item => {
          const badge = {
            'In Transit': 'bg-blue-100 text-blue-700',
            'Delivered' : 'bg-green-100 text-green-700',
            'Delayed'   : 'bg-yellow-100 text-yellow-700',
          }[item.status] ?? 'bg-gray-200 text-gray-700';

          container.innerHTML += `
            <div class="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div>
                <h4 class="font-bold text-sm text-gray-800">${item.title}</h4>
                <p class="text-xs text-gray-500">${item.date}</p>
              </div>
              <span class="px-2 py-1 text-xs font-bold rounded-full ${badge}">${item.status}</span>
            </div>`;
        });
      };

      filters.forEach(btn => {
        btn.addEventListener('click', (e) => {
          filters.forEach(f => { f.classList.remove('bg-[#E20074]','text-white'); f.classList.add('bg-gray-200','text-gray-700'); });
          e.target.classList.remove('bg-gray-200','text-gray-700');
          e.target.classList.add('bg-[#E20074]','text-white');
          renderTimeline(e.target.getAttribute('data-status'));
        });
      });

      renderTimeline('Semua');
    };

    // ==========================================
    // 5. Operational Warning Toggle & AI Narrative
    // ==========================================
    const initWarningToggle = () => {
      const btnToggle    = document.getElementById('toggle-delay-sim');
      const warningBanner= document.getElementById('warning-banner');
      const aiNarrative  = document.getElementById('ai-narrative-box');
      if (!btnToggle || !warningBanner || !aiNarrative) return;

      let hasDelay = false;
      btnToggle.addEventListener('click', () => {
        hasDelay = !hasDelay;
        if (hasDelay) {
          btnToggle.innerText = 'Matikan Simulasi Kendala';
          btnToggle.classList.replace('bg-gray-200','bg-red-200');
          warningBanner.classList.remove('hidden');
          aiNarrative.innerText = '"Halo Kak! Mohon maaf, saat ini ada kendala macet di jalur transit. Satria kami sedang memandu paketmu lewat jalur alternatif yang aman."';
          aiNarrative.classList.replace('text-blue-800','text-yellow-800');
          aiNarrative.parentElement.classList.replace('bg-blue-50','bg-yellow-50');
          aiNarrative.parentElement.classList.replace('border-blue-200','border-yellow-200');
          aiNarrative.previousElementSibling.classList.replace('text-blue-900','text-yellow-900');
        } else {
          btnToggle.innerText = 'Simulasikan Kendala Cuaca/Macet';
          btnToggle.classList.replace('bg-red-200','bg-gray-200');
          warningBanner.classList.add('hidden');
          aiNarrative.innerText = '"Halo Kak! Paketmu sedang dalam perjalanan dengan aman bersama kurir Satria kami."';
          aiNarrative.classList.replace('text-yellow-800','text-blue-800');
          aiNarrative.parentElement.classList.replace('bg-yellow-50','bg-blue-50');
          aiNarrative.parentElement.classList.replace('border-yellow-200','border-blue-200');
          aiNarrative.previousElementSibling.classList.replace('text-yellow-900','text-blue-900');
        }
      });
    };

    // ==========================================
    // INITIALIZER
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
      initPersonalizedGreeting();
      initSearchValidation();
      initCalculator();
      initTimelineFilter();
      initWarningToggle();
    });
  </script>
</body>
</html>
