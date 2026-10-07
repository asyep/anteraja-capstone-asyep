/**
 * Smart AI Shipment Tracking Widget - React-Ready Vanilla JS
 * Modular, Clean, and Functional.
 */

// ==========================================
// DATA MOCKUPS & UTILS
// ==========================================
const MOCK_TIMELINE = [
  { id: 1, title: 'Paket Diterima di Hub', status: 'In Transit', date: '26 Sep 2024' },
  { id: 2, title: 'Dalam Perjalanan ke Kota Tujuan', status: 'In Transit', date: '27 Sep 2024' },
  { id: 3, title: 'Paket Sedang Diantar Kurir', status: 'In Transit', date: '28 Sep 2024' },
  { id: 4, title: 'Paket Selesai Dikirim', status: 'Delivered', date: '29 Sep 2024' },
  { id: 5, title: 'Kendala Rute / Cuaca', status: 'Delayed', date: '28 Sep 2024' }
];

const SERVICE_RATES = {
  reguler: 10000,
  nextday: 15000,
  sameday: 25000
};

// ==========================================
// 1. Form Validation & Anti-Double Submit
// ==========================================
const initSearchValidation = () => {
  const inputResi = document.getElementById('input-resi');
  const btnLacak = document.getElementById('btn-lacak');
  const resiWarning = document.getElementById('resi-warning');
  const trackingForm = document.getElementById('tracking-form');

  if (!inputResi || !btnLacak || !trackingForm) return;

  // Real-time validation
  inputResi.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length < 32 || val.length > 32) {
      resiWarning.classList.remove('hidden');
      btnLacak.disabled = true;
    } else {
      resiWarning.classList.add('hidden');
      btnLacak.disabled = false;
    }
  });

  // Anti-double submit
  trackingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (btnLacak.disabled) return;
    
    btnLacak.disabled = true;
    btnLacak.innerHTML = `<svg class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Loading...`;
    
    // Simulate API Call
    setTimeout(() => {
      btnLacak.disabled = false;
      btnLacak.innerText = 'Lacak';
      alert('Tracking Data Berhasil Ditarik!');
    }, 2000);
  });
};

// ==========================================
// 2. Dynamic Personalized Greeting Header
// ==========================================
const initPersonalizedGreeting = () => {
  const banner = document.getElementById('user-greeting-banner');
  if (!banner) return;

  // Mock Session Storage for demo
  if (!sessionStorage.getItem('activeUser')) {
    sessionStorage.setItem('activeUser', 'Kak Asep'); // Simulate logged in user
  }

  const activeUser = sessionStorage.getItem('activeUser');
  if (activeUser) {
    banner.innerHTML = `👋 Halo <strong>${activeUser}</strong>! Satria siap membantu melacak posisi paketmu.`;
  } else {
    banner.innerHTML = `👋 Halo! Satria siap membantu melacak posisi paketmu.`;
  }
};

// ==========================================
// 3. Interactive Shipping Fee & ETA Calculator
// ==========================================
const initCalculator = () => {
  const inputWeight = document.getElementById('input-weight');
  const selectService = document.getElementById('select-service');
  const ongkirDisplay = document.getElementById('ongkir-display');
  const etaDisplay = document.getElementById('eta-display');

  if (!inputWeight || !selectService || !ongkirDisplay || !etaDisplay) return;

  const calculate = () => {
    const weight = parseFloat(inputWeight.value) || 1;
    const service = selectService.value;
    
    // Calculate fee
    const fee = weight * SERVICE_RATES[service];
    ongkirDisplay.innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(fee);

    // Calculate ETA
    const today = new Date();
    let daysToAdd = 3; // Reguler
    if (service === 'nextday') daysToAdd = 1;
    if (service === 'sameday') daysToAdd = 0;
    
    today.setDate(today.getDate() + daysToAdd);
    const etaDate = today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    etaDisplay.innerText = service === 'sameday' ? 'Hari ini' : etaDate;
  };

  inputWeight.addEventListener('input', calculate);
  selectService.addEventListener('change', calculate);
  
  calculate(); // Init
};

// ==========================================
// 4. Dynamic Status Timeline Filter
// ==========================================
const initTimelineFilter = () => {
  const container = document.getElementById('timeline-container');
  const filters = document.querySelectorAll('.filter-btn');
  if (!container || !filters.length) return;

  const renderTimeline = (statusFilter) => {
    container.innerHTML = '';
    const filteredData = statusFilter === 'Semua' 
      ? MOCK_TIMELINE 
      : MOCK_TIMELINE.filter(item => item.status === statusFilter);

    if (filteredData.length === 0) {
      container.innerHTML = `<div class="p-4 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">Tidak ada paket dengan status ini.</div>`;
      return;
    }

    filteredData.forEach(item => {
      let badgeColor = 'bg-gray-200 text-gray-700';
      if (item.status === 'In Transit') badgeColor = 'bg-blue-100 text-blue-700';
      if (item.status === 'Delivered') badgeColor = 'bg-green-100 text-green-700';
      if (item.status === 'Delayed') badgeColor = 'bg-yellow-100 text-yellow-700';

      container.innerHTML += `
        <div class="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
          <div>
            <h4 class="font-bold text-sm text-gray-800">${item.title}</h4>
            <p class="text-xs text-gray-500">${item.date}</p>
          </div>
          <span class="px-2 py-1 text-xs font-bold rounded-full ${badgeColor}">${item.status}</span>
        </div>
      `;
    });
  };

  filters.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Update Active State UI
      filters.forEach(f => {
        f.classList.remove('bg-[#E20074]', 'text-white');
        f.classList.add('bg-gray-200', 'text-gray-700');
      });
      e.target.classList.remove('bg-gray-200', 'text-gray-700');
      e.target.classList.add('bg-[#E20074]', 'text-white');

      const status = e.target.getAttribute('data-status');
      renderTimeline(status);
    });
  });

  renderTimeline('Semua'); // Init
};

// ==========================================
// 5. Operational Warning Toggle & AI Narrative
// ==========================================
const initWarningToggle = () => {
  const btnToggle = document.getElementById('toggle-delay-sim');
  const warningBanner = document.getElementById('warning-banner');
  const aiNarrative = document.getElementById('ai-narrative-box');
  
  if (!btnToggle || !warningBanner || !aiNarrative) return;

  let hasDelay = false;

  btnToggle.addEventListener('click', () => {
    hasDelay = !hasDelay;
    
    if (hasDelay) {
      btnToggle.innerText = 'Matikan Simulasi Kendala';
      btnToggle.classList.replace('bg-gray-200', 'bg-red-200');
      
      warningBanner.classList.remove('hidden');
      
      aiNarrative.innerText = '"Halo Kak! Mohon maaf, saat ini ada kendala macet di jalur transit. Satria kami sedang memandu paketmu lewat jalur alternatif yang aman."';
      aiNarrative.classList.replace('text-blue-800', 'text-yellow-800');
      aiNarrative.parentElement.classList.replace('bg-blue-50', 'bg-yellow-50');
      aiNarrative.parentElement.classList.replace('border-blue-200', 'border-yellow-200');
      aiNarrative.previousElementSibling.classList.replace('text-blue-900', 'text-yellow-900');
    } else {
      btnToggle.innerText = 'Simulasikan Kendala Cuaca/Macet';
      btnToggle.classList.replace('bg-red-200', 'bg-gray-200');
      
      warningBanner.classList.add('hidden');
      
      aiNarrative.innerText = '"Halo Kak! Paketmu sedang dalam perjalanan dengan aman bersama kurir Satria kami."';
      aiNarrative.classList.replace('text-yellow-800', 'text-blue-800');
      aiNarrative.parentElement.classList.replace('bg-yellow-50', 'bg-blue-50');
      aiNarrative.parentElement.classList.replace('border-yellow-200', 'border-blue-200');
      aiNarrative.previousElementSibling.classList.replace('text-yellow-900', 'text-blue-900');
    }
  });
};

// ==========================================
// INITIALIZER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initSearchValidation();
  initPersonalizedGreeting();
  initCalculator();
  initTimelineFilter();
  initWarningToggle();
});
