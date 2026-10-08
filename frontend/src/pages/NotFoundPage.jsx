import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getRouteForResi } from "@/data/shipmentsData";

export default function NotFoundPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const waybillParam = searchParams.get("waybill_number") || "1000998877665544332211";
  
  const [resi, setResi] = useState(waybillParam);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (resi.trim()) {
      navigate(getRouteForResi(resi.trim()));
    }
  };

  const handleKoreksiResi = () => {
    const input = document.getElementById('resi-input');
    if (input) {
      input.focus();
      input.select();
    }
  };

  return (
    <main className="w-full bg-surface min-h-[calc(100vh-20rem)] pt-12 md:pt-16">
      <div className="flex flex-col w-full">
        <div className="w-full max-w-[1200px] mx-auto px-margin md:px-margin-desktop py-space-lg flex flex-col gap-space-lg">
          {/* SEARCH & AI HEADER SECTION (Structured to match SCREEN_14) */}
          <section className="flex flex-col gap-space-md">
            {/* Diagnostic AI Tag */}
            <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-ai-surface w-fit shadow-sm">
              <span className="material-symbols-outlined text-ai-accent text-[18px]">auto_awesome</span>
              <span className="font-label-sm text-label-sm text-ai-accent font-bold tracking-wide uppercase">AI-POWERED TRACKING DIAGNOSTICS</span>
            </div>
            {/* Section Title & Subtitle */}
            <div className="flex flex-col gap-space-xs">
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-extrabold">
                Lacak Pengiriman Smart AI
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Pantau status paket real-time dengan asisten pintar Satria AI, akurasi rute dinamis, dan jaminan estimasi waktu terpercaya.
              </p>
            </div>
            {/* Resi Search Bar & Validation matching SCREEN_14 */}
            <div className="w-full bg-surface-container-lowest rounded-2xl shadow-xl p-space-lg mb-space-xl relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
              <form className="flex flex-col gap-space-md" id="tracking-form" onSubmit={handleSearchSubmit}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
                  <div className="relative flex-1 flex items-center">
                    <span className="material-symbols-outlined text-text-placeholder absolute left-4 text-[22px] pointer-events-none">tag</span>
                    <input
                      className="w-full h-14 pl-12 pr-12 rounded-xl bg-surface-card text-text-primary font-mono-code text-mono-code focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-inner tracking-wide transition-all"
                      id="resi-input"
                      maxLength="32"
                      placeholder="Masukkan 32 Karakter Nomor Resi / Order ID"
                      type="text"
                      value={resi}
                      onChange={(e) => setResi(e.target.value)}
                    />
                  </div>
                  <button className="h-14 px-space-xl rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-lg hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2" type="submit">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                    <span>Lacak Paket</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-space-sm text-on-surface-variant">
                  <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider text-text-muted">Pencarian Terakhir:</span>
                  <button className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-primary-fixed/40 hover:text-primary text-on-surface font-mono-code text-label-sm shadow-sm transition-all flex items-center gap-1" type="button" onClick={() => navigate(getRouteForResi('100028471928'))}>
                    <span className="w-1.5 h-1.5 rounded-full bg-success-base"></span>
                    100028471928...
                  </button>
                  <button className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-primary-fixed/40 hover:text-primary text-on-surface font-mono-code text-label-sm shadow-sm transition-all flex items-center gap-1" type="button" onClick={() => navigate(getRouteForResi('100039201948'))}>
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim"></span>
                    100039201948...
                  </button>
                  <span className="bg-error-surface text-error px-3 py-1 rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-error inline-block"></span>
                    Nomor Resi Tidak Terdaftar
                  </span>
                </div>
              </form>
            </div>
          </section>

          {/* STATUS ALERT BANNER (Error / Not Found) */}
          <section className="w-full bg-gradient-to-r from-red-950 via-red-900 to-red-950 rounded-2xl p-6 shadow-xl border border-red-800/50 text-white relative overflow-hidden flex flex-col gap-4">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
            <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 text-white">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                </div>
                <span className="font-label-sm text-label-sm font-extrabold uppercase tracking-wider text-red-200">STATUS RESI: TIDAK TERDAFTAR / BELUM DITEMUKAN</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/10 border border-white/10 text-white/90 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>Sinkronisasi Server: 2 menit lalu
                </span>
                <span className="bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm font-mono-code">Error 404</span>
                <span className="bg-black/25 text-white/90 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium border border-white/10">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>Cek Berkala 1x24 Jam
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1 relative z-10">
              <div className="flex flex-col gap-1 max-w-3xl">
                <h2 className="font-headline-md text-[20px] md:text-[24px] font-extrabold text-white leading-tight tracking-tight">
                  Nomor <span style={{letterSpacing: "-0.025em"}}>Resi {waybillParam}</span>
                  <span style={{letterSpacing: "-0.025em"}}> Belum Tercatat </span><br/>
                </h2>
                <p className="font-body-sm text-sm text-white/80 leading-relaxed">
                  Sistem database AI kami telah memeriksa jaringan Hub & Staging Store nasional, namun riwayat pemindaian barcode fisik belum ditemukan.
                </p>
              </div>
              <button 
                className="px-space-md py-2.5 bg-white text-red-950 hover:bg-white/90 font-label-lg text-label-lg font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 self-start md:self-center" 
                onClick={handleKoreksiResi} 
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>Koreksi Resi</span>
              </button>
            </div>
          </section>

          {/* MAIN TWO-COLUMN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start mt-6">
            {/* LEFT COLUMN (~65%): Assistant Guidance, Probable Causes, and Actionable Steps */}
            <div className="lg:col-span-8 flex flex-col gap-space-lg">
              {/* CARD 1: Satria Assistant Direct Help */}
              <article className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary-fixed shadow-sm">
                      <img alt="Satria AI Assistant Anteraja" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1WUt0-30DAVBT5fGSC3OEhE40Rc-0nTXi_xa9Kj58U6pbAB6lG6aOuegHuvAvhS9R6s2AgrsFI9YX0WBmwqUPvOthWdAzaWESBaAKjHPUXPK9rl8zjgEg6YSlNaA5Zn_wE4xiCCMGBwXa-X9xR1khj0d09u_M_XCjH0T8Y6LgfKQxis52hybBTVLRnXs4iVp6ANwFIfDG0ASeI47WWGhGDuZySLffW-5enH036hGqXj2IhGtbSNyzBic50V" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-base rounded-full shadow-sm"></span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Satria Assistant</h3>
                        <span className="bg-primary-fixed text-primary px-2 py-0.5 rounded-full font-label-sm text-label-sm font-extrabold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">verified</span> Satria AI
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Duta Layanan Pelanggan Terverifikasi • Online 24/7</span>
                    </div>
                  </div>
                  <span className="text-text-muted font-mono-code text-label-sm">ID: SAT-8821-IDN</span>
                </div>
                {/* Message Bubble */}
                <div className="bg-surface-container-low p-space-md rounded-2xl rounded-tl-sm flex flex-col gap-space-sm">
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    Halo Kak! Mohon maaf, nomor resi ini belum terbaca di sistem pelacakan Anteraja. Jangan khawatir, hal ini umumnya terjadi jika pihak merchant/pengirim baru saja mencetak label pengiriman dan paket fisik belum diserahterimakan ke gerai fisik Satria kami, atau terdapat kekeliruan pengetikan karakter resi.
                  </p>
                  <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-ai-accent">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    <span>Satria AI mendeteksi 0 log webhook pemindaian pada nomor ini.</span>
                  </div>
                </div>
                {/* Quick Satria Action Buttons */}
                <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                  <a className="px-space-md py-2.5 bg-secondary-container text-on-secondary-container font-label-lg text-label-lg rounded-xl hover:bg-secondary-fixed transition-colors flex items-center gap-2 shadow-sm" href={`https://wa.me/6281119603333?text=Halo%20Satria%2C%20saya%20ingin%20cek%20resi%20${waybillParam}`} rel="noopener noreferrer" target="_blank">
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Hubungi Satria via WhatsApp</span>
                  </a>
                  <button className="px-space-md py-2.5 bg-surface-container-low hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg rounded-xl transition-colors flex items-center gap-2" onClick={handleKoreksiResi} type="button">
                    <span className="material-symbols-outlined text-[18px]">replay</span>
                    <span>Cek Ulang Digit Resi</span>
                  </button>
                  <button className="px-space-md py-2.5 bg-surface-container-low hover:bg-error-surface text-error font-label-lg text-label-lg rounded-xl transition-colors flex items-center gap-2 ml-auto" onClick={() => alert('Laporan kendala resi telah diteruskan ke Customer Care Satria Anteraja. Tim kami akan mengecek dalam 15 menit.')} type="button">
                    <span className="material-symbols-outlined text-[18px]">flag</span>
                    <span>Laporkan Kendala</span>
                  </button>
                </div>
              </article>
              
              {/* CARD 2: Kemungkinan Mengapa Resi Belum Ditemukan */}
              <article className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-warning-base"></span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Kemungkinan Mengapa Resi Belum Ditemukan
                    </h3>
                  </div>
                  <span className="font-label-sm text-label-sm text-text-muted">Analisis Diagnostik Otomatis</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant -mt-1">
                  Berdasarkan pola logistik Anteraja, 98% kasus resi tidak tercatat disebabkan oleh 3 faktor di bawah ini:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs">
                  {/* Cause 1 */}
                  <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">label_important</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold text-[16px] leading-snug">
                      Label Baru Dibuat
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Seller di marketplace atau pengirim baru memproses booking dan nomor resi terbit, namun barang belum diserahkan ke kurir.
                    </p>
                    <div className="mt-auto pt-space-xs">
                      <span className="text-primary font-label-sm text-label-sm font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span> Estimasi scan: 3-6 jam
                      </span>
                    </div>
                  </div>
                  {/* Cause 2 */}
                  <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">two_wheeler</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold text-[16px] leading-snug">
                      Proses Penjemputan
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Satria kurir sedang dalam rute perjalanan penjemputan fisik barang di lokasi penjual (first-mile route) sebelum barcode di-scan di Hub.
                    </p>
                    <div className="mt-auto pt-space-xs">
                      <span className="text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">local_shipping</span> First-Mile Hub Transit
                      </span>
                    </div>
                  </div>
                  {/* Cause 3 */}
                  <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-error-container text-error flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">spellcheck</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold text-[16px] leading-snug">
                      Kesalahan Input / Typo
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Terdapat spasi ekstra, kelebihan digit angka, atau tidak sengaja menyalin nomor pesanan e-commerce sebagai nomor resi.
                    </p>
                    <div className="mt-auto pt-space-xs">
                      <span className="text-error font-label-sm text-label-sm font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">warning</span> Cek digit kembali
                      </span>
                    </div>
                  </div>
                </div>
              </article>

              {/* CARD 3: Panduan Langkah Penanganan Praktis */}
              <article className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">task_alt</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Panduan Langkah Penanganan Praktis
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  {/* Step 1 */}
                  <div className="flex items-start gap-space-md bg-surface-container-low p-space-md rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-mono-code font-extrabold flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-label-lg text-label-lg text-on-surface font-bold">
                        Periksa kembali nomor resi yang Anda masukkan
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Pastikan nomor resi terdiri dari awalan <span className="font-mono-code font-bold text-on-surface">1000</span> atau <span className="font-mono-code font-bold text-on-surface">1001</span> dengan panjang 12 hingga 24 digit angka murni tanpa kombinasi huruf acak.
                      </p>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="flex items-start gap-space-md bg-surface-container-low p-space-md rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-mono-code font-extrabold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-label-lg text-label-lg text-on-surface font-bold">
                        Tunggu dan cek berkala dalam 1x24 jam
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Jika pesanan baru dibuat hari ini, beri jeda beberapa jam hingga kurir Satria kami menyelesaikan scan fisik awal di staging store terdekat.
                      </p>
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div className="flex items-start gap-space-md bg-surface-container-low p-space-md rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-mono-code font-extrabold flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-label-lg text-label-lg text-on-surface font-bold">
                        Konfirmasi langsung ke pihak penjual (seller / merchant)
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Tanyakan apakah paket sudah benar-benar diserahkan ke gerai Anteraja atau baru diproses secara administratif di aplikasi marketplace.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Bottom Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low p-space-md rounded-2xl">
                <div className="flex items-center gap-space-sm">
                  <button className="px-space-md py-2 bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-label-lg rounded-xl shadow-sm transition-all flex items-center gap-2" onClick={() => window.location.reload()} type="button">
                    <span className="material-symbols-outlined text-[18px]">sync</span>
                    <span>Muat Ulang Halaman</span>
                  </button>
                  <button className="px-space-md py-2 bg-surface-container-highest hover:bg-primary-fixed hover:text-primary text-on-surface font-label-lg text-label-lg rounded-xl transition-all flex items-center gap-2" onClick={() => { setResi(''); handleKoreksiResi(); }} type="button">
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    <span>Lacak Resi Lain</span>
                  </button>
                </div>
                <span className="font-mono-code text-label-sm text-text-muted">
                  Kode Status: <strong className="text-error">ERR_MANIFEST_NOT_INITIALIZED</strong>
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN (~35%): Resi Validation Checklist and CS Hub */}
            <div className="lg:col-span-4 flex flex-col gap-space-lg">
              {/* CARD 1: Ciri-Ciri Resi Resmi Anteraja */}
              <article className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">policy</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Ciri Resi Resmi Anteraja
                  </h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Gunakan panduan berikut untuk memastikan format resi yang Anda terima adalah sah:
                </p>
                <div className="flex flex-col gap-space-sm">
                  {/* Item 1 */}
                  <div className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl">
                    <span className="material-symbols-outlined text-success-base text-[20px] shrink-0">check_circle</span>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Awalan Angka Standar</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Selalu diawali kode angka <strong>1000</strong> atau <strong>1001</strong>.</span>
                    </div>
                  </div>
                  {/* Item 2 */}
                  <div className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl">
                    <span className="material-symbols-outlined text-success-base text-[20px] shrink-0">check_circle</span>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Panjang Digit Konsisten</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Memiliki 12 hingga 24 karakter numerik tanpa huruf abjad.</span>
                    </div>
                  </div>
                  {/* Item 3 */}
                  <div className="flex items-start gap-3 p-3 bg-error-surface rounded-xl">
                    <span className="material-symbols-outlined text-error text-[20px] shrink-0">cancel</span>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-error font-bold">Bukan Nomor Invoice</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Bukan format nomor pesanan marketplace seperti <em>INV/2024/...</em>.</span>
                    </div>
                  </div>
                </div>
              </article>
              {/* CARD 2: Pusat Bantuan Satria 24 Jam */}
              <article className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">support_agent</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Pusat Bantuan Satria
                    </h3>
                  </div>
                  <span className="font-label-sm text-label-sm text-success-base font-bold bg-success-surface px-2 py-0.5 rounded-full">
                    Siap 24 Jam
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Jika resi Anda belum tercatat setelah lebih dari 24 jam sejak pengiriman, segera hubungi kanal resmi kami:
                </p>
                <div className="flex flex-col gap-2">
                  {/* Contact Row 1 */}
                  <a className="flex items-center justify-between p-3 bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors" href="tel:02150663333">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px]">call</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-text-muted">Call Center Resmi</span>
                        <span className="font-mono-code text-mono-code text-on-surface font-bold">021 - 5066 - 3333</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_forward</span>
                  </a>
                  {/* Contact Row 2 */}
                  <a className="flex items-center justify-between p-3 bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors" href="https://wa.me/6281119603333" rel="noopener noreferrer" target="_blank">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary text-[20px]">chat</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-text-muted">WhatsApp Satria Care</span>
                        <span className="font-mono-code text-mono-code text-on-surface font-bold">0811 - 1960 - 3333</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_forward</span>
                  </a>
                  {/* Contact Row 3 */}
                  <a className="flex items-center justify-between p-3 bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors" href="mailto:cs@anteraja.id">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-text-muted">Customer Service Email</span>
                        <span className="font-body-md text-body-md text-on-surface font-bold">cs@anteraja.id</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_forward</span>
                  </a>
                </div>
                {/* Bottom Action CTAs */}
                <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                  <a className="px-space-md py-2.5 bg-primary-container text-on-primary-container font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-1.5 shadow hover:bg-primary transition-colors text-center" href="tel:02150663333">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    <span>Hubungi CS</span>
                  </a>
                  <a className="px-space-md py-2.5 bg-secondary-container text-on-secondary-container font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-1.5 shadow hover:bg-secondary-fixed transition-colors text-center" href="https://wa.me/6281119603333" rel="noopener noreferrer" target="_blank">
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Bantuan WA</span>
                  </a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
