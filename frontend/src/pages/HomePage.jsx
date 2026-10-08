import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [waybill, setWaybill] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    if (waybill.trim()) {
      navigate(`/lacak`);
    } else {
      setWaybill("1000849201994");
      navigate(`/lacak`);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setWaybill(text);
      }
    } catch (err) {
      setWaybill("1000849201994");
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* HERO SECTION & RESI SEARCH COMPONENT */}
      <section className="relative w-full pt-16 pb-20 px-6 lg:px-12 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-surface-container-low/40 to-surface">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-[#E4007D]/8 rounded-full blur-[130px] pointer-events-none -z-10"></div>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#E4007D] animate-ping"></span>
            Ekspedisi Pintar Masa Depan
          </div>
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] lg:leading-[54px] text-on-surface font-extrabold tracking-tight">
              Pelacakan Cerdas. Pengiriman Andal ke Seluruh Nusantara.
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Pantau kiriman paket Anda secara real-time dengan asisten AI pintar, estimasi kedatangan presisi, dan layanan kurir Satria yang ramah.
            </p>
          </div>
          {/* Quick Floating Search Card */}
          <div className="w-full max-w-3xl mt-4 bg-white rounded-2xl shadow-sm border border-border-subtle p-5 sm:p-6 text-left transition-all">
            {/* Compact Top Tabs */}
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3 mb-5">
              <button className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs sm:text-sm font-semibold transition-colors">
                <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
                <span className="">Lacak Kiriman</span>
              </button>
              <a className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-text-muted hover:text-on-surface hover:bg-surface-container text-xs sm:text-sm font-medium transition-colors" data-path="cek-tarif" href="#">
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                <span className="">Cek Tarif Ongkir</span>
              </a>
              <a className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-text-muted hover:text-on-surface hover:bg-surface-container text-xs sm:text-sm font-medium transition-colors" data-path="titik-drop-point" href="#">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <span className="">Cari Drop Point</span>
              </a>
            </div>

            {/* Input Form Row */}
            <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3" onSubmit={handleSearch}>
              <div className="relative flex-1 w-full flex items-center bg-surface-container-low border border-border-subtle rounded-xl px-3.5 h-12 focus-within:bg-white focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(228,0,125,0.12)] transition-all group">
                <span className="material-symbols-outlined text-text-muted text-[20px] mr-2 select-none flex-shrink-0">search</span>
                <input 
                  className="w-full bg-transparent border-0 outline-none text-on-surface font-mono font-medium text-sm placeholder:text-text-placeholder placeholder:font-sans" 
                  id="resi-input" 
                  placeholder="1000849201994 (atau tempel nomor resi di sini)" 
                  type="text" 
                  value={waybill}
                  onChange={(e) => setWaybill(e.target.value)}
                />
                <button 
                  className="ml-2 px-2.5 py-1 rounded-lg bg-white hover:bg-surface-container text-xs font-semibold text-text-muted hover:text-primary transition-all flex items-center gap-1 border border-border-subtle shadow-xs flex-shrink-0" 
                  onClick={handlePaste} 
                  title="Tempel dari Clipboard" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px] text-primary">content_paste</span>
                  <span className="hidden sm:inline">Tempel</span>
                </button>
              </div>
              <button className="w-full sm:w-auto px-6 h-12 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-sm shadow-[0_4px_14px_rgba(228,0,125,0.25)] flex items-center justify-center gap-2 transition-all whitespace-nowrap flex-shrink-0" type="submit">
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span className="">Lacak Paket</span>
              </button>
            </form>

            {/* Single Clean Quick Search / Recent Chips Row */}
            <div className="mt-4 pt-3 border-t border-border-subtle flex flex-wrap items-center gap-2 text-xs">
            </div>
          </div>
        </div>
      </section>
      {/* QUICK ACTIONS STRIP (4 MODERN TILES) */}
      <section className="w-full px-6 lg:px-12 py-10 bg-white border-y border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a className="p-5 rounded-2xl bg-surface hover:bg-surface-container-low border border-border-subtle hover:border-primary/40 transition-all flex items-center justify-between group" data-path="lacak-kiriman" href="/lacak">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-[#E4007D] group-hover:text-white transition-all flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">travel_explore</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Lacak Resi Instan</h2>
                  <p className="text-xs text-on-surface-variant">Status live &amp; posisi kurir</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all text-[20px]">chevron_right</span>
            </a>
            <a className="p-5 rounded-2xl bg-surface hover:bg-surface-container-low border border-border-subtle hover:border-secondary/40 transition-all flex items-center justify-between group" data-path="cek-tarif" href="#">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">calculate</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">Kalkulator Ongkir</h2>
                  <p className="text-xs text-on-surface-variant">Estimasi biaya pengiriman</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-text-muted group-hover:text-secondary group-hover:translate-x-1 transition-all text-[20px]">chevron_right</span>
            </a>
            <a className="p-5 rounded-2xl bg-surface hover:bg-surface-container-low border border-border-subtle hover:border-tertiary/40 transition-all flex items-center justify-between group" data-path="titik-drop-point" href="#">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/40 flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-white transition-all flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">pin_drop</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-on-surface group-hover:text-tertiary transition-colors">Titik Drop Point</h2>
                  <p className="text-xs text-on-surface-variant">Lokasi agen Satria terdekat</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-text-muted group-hover:text-tertiary group-hover:translate-x-1 transition-all text-[20px]">chevron_right</span>
            </a>
            <a className="p-5 rounded-2xl bg-surface hover:bg-surface-container-low border border-border-subtle hover:border-ai-accent/40 transition-all flex items-center justify-between group" href="https://wa.me/6281119612345" rel="noopener noreferrer" target="_blank">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-ai-surface flex items-center justify-center text-ai-accent group-hover:bg-ai-accent group-hover:text-white transition-all flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">support_agent</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-on-surface group-hover:text-ai-accent transition-colors">Bantuan &amp; Klaim</h2>
                  <p className="text-xs text-on-surface-variant">Customer Care WA 24 Jam</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-text-muted group-hover:text-ai-accent group-hover:translate-x-1 transition-all text-[20px]">chevron_right</span>
            </a>
          </div>
        </div>
      </section>
      {/* FITUR CERDAS PELACAKAN (INNOVATIVE CORE PILLARS) */}
      <section className="w-full px-6 lg:px-12 py-20 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-14">
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1 rounded-full">INOVASI PELACAKAN LOGISTIK</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-on-surface font-extrabold tracking-tight">
              Teknologi Cerdas yang Memberi Rasa Tenang
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Kami merevolusi pengalaman lacak resi konvensional dengan machine learning, narasi natural, dan akurasi tinggi.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature 1: Smart AI Narrative */}
            <div className="p-8 rounded-3xl bg-white border border-border-subtle shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[30px]">auto_awesome</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">Satria AI Assistant</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Smart AI Status Narrative</h3>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Menerjemahkan kode manifest teknis gudang yang rumit menjadi penjelasan bahasa manusia yang santun, empatik, dan mudah dipahami siapa saja.
                  </p>
                </div>
                {/* Micro-card preview mockup */}
                <div className="p-4 rounded-2xl bg-surface-container-low border border-border-subtle flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-xs font-bold text-on-surface">Pesan Satria AI:</span>
                  </div>
                  <p className="text-xs text-on-surface-variant italic bg-white p-3 rounded-xl border border-border-subtle leading-relaxed">
                    “Halo Kak! Paketmu sudah selesai disortir di Gateway Halim dan saat ini sedang dibawa Satria Dimas menuju alamat tujuanmu.”
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-border-subtle flex items-center gap-2 text-primary text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span className="">Bebas dari istilah manifest rumit &amp; membingungkan</span>
              </div>
            </div>
            {/* Feature 2: Live Telemetry & ETA */}
            <div className="p-8 rounded-3xl bg-white border border-border-subtle shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[30px]">timer</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary font-bold text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                    Live Telemetry
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Live Telemetri &amp; Prediksi ETA Akurat</h3>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Machine learning menghitung jendela waktu kedatangan paket presisi 30 menit berdasarkan rute pengantaran Satria dan lalu lintas terkini.
                  </p>
                </div>
                {/* Micro-card preview mockup */}
                <div className="p-4 rounded-2xl bg-surface-container-low border border-border-subtle flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted font-medium">Perkiraan Tiba Hari Ini:</span>
                    <span className="font-bold text-tertiary">Akurasi 98.8%</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-border-subtle flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary text-[24px]">electric_moped</span>
                    <div>
                      <div className="text-sm font-extrabold text-on-surface">14:15 - 14:45 WIB</div>
                      <div className="text-[11px] text-on-surface-variant">Sisa 3 paket sebelum giliran antaran Anda</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-border-subtle flex items-center gap-2 text-tertiary text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="">Jaminan presisi estimasi waktu ketibaan</span>
              </div>
            </div>
            {/* Feature 3: Operational Warning & WhatsApp Sapaan */}
            <div className="p-8 rounded-3xl bg-white border border-border-subtle shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-fixed/40 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[30px]">notifications_active</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed text-secondary font-bold text-xs">Pencegahan Dini</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Peringatan Operasional &amp; Sapaan WA</h3>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Informasi otomatis bila ada kendala cuaca ekstrem atau penutupan jalan, sapaan WhatsApp resmi sebelum kurir tiba, serta bukti e-POD.
                  </p>
                </div>
                {/* Micro-card preview mockup */}
                <div className="p-4 rounded-2xl bg-surface-container-low border border-border-subtle flex flex-col gap-2">
                  <div className="bg-white p-3 rounded-xl border border-border-subtle flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-success-base text-[20px] flex-shrink-0">chat</span>
                    <div>
                      <div className="text-xs font-bold text-on-surface">Notifikasi WhatsApp Resmi:</div>
                      <div className="text-[11px] text-on-surface-variant leading-snug mt-0.5">“Satria Dimas sedang menuju rumah Kakak. Mohon pastikan ada penerima ya!”</div>
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold p-2 rounded-lg flex items-center gap-1.5 border border-emerald-200">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span className="">Bukti e-POD bergeotag GPS &amp; foto digital</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-border-subtle flex items-center gap-2 text-secondary text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span className="">Transparansi serah terima fisik &amp; digital</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* PILIHAN LAYANAN PENGIRIMAN (4 CARDS) */}
      <section className="w-full px-6 lg:px-12 py-20 bg-surface-container-low border-t border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full w-fit">LAYANAN PENGIRIMAN</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-on-surface font-extrabold tracking-tight">Kirim Tepat Waktu Sesuai Kebutuhan Anda</h2>
              <p className="text-sm sm:text-base text-on-surface-variant">Pilihan lengkap dengan tarif transparan, jangkauan luas se-Indonesia, dan kepastian perlindungan paket.</p>
            </div>
            <a className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors" data-path="cek-tarif" href="#">
              <span className="">Bandingkan Semua Tarif Lengkap</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Reguler */}
            <div className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-md border border-border-subtle transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">inventory_2</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">Ekonomis</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Anteraja Reguler</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Solusi ideal untuk kebutuhan belanja online marketplace dan kiriman personal harian.
                  </p>
                </div>
                <ul className="text-xs text-on-surface-variant space-y-2 pt-2 border-t border-border-subtle">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">schedule</span>
                    <span className="">Estimasi 2–3 Hari Kerja</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">map</span>
                    <span className="">Cakupan seluruh Indonesia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">done</span>
                    <span className="">Bebas biaya pick-up</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">Mulai Dari</span>
                  <span className="text-lg font-bold text-primary">Rp 9.000<span className="text-xs font-normal text-on-surface-variant">/kg</span></span>
                </div>
                <a className="w-full py-2.5 rounded-xl bg-surface hover:bg-surface-container text-on-surface text-xs font-bold text-center border border-border-subtle transition-colors" data-path="cek-tarif" href="#">
                  Cek Ongkir Reguler
                </a>
              </div>
            </div>
            {/* Card 2: Next Day */}
            <div className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-md border border-border-subtle transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-fixed/40 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[28px]">alarm_on</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-fixed/50 text-secondary">Garansi Esok</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Next Day</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Paket esensial Anda terjamin tiba esok hari dengan komitmen garansi ongkir kembali.
                  </p>
                </div>
                <ul className="text-xs text-on-surface-variant space-y-2 pt-2 border-t border-border-subtle">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                    <span className="">Pasti Sampai 24 Jam</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">monetization_on</span>
                    <span className="">Garansi ongkir uang kembali</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">priority_high</span>
                    <span className="">Prioritas sortasi gateway</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">Mulai Dari</span>
                  <span className="text-lg font-bold text-secondary">Rp 15.000<span className="text-xs font-normal text-on-surface-variant">/kg</span></span>
                </div>
                <a className="w-full py-2.5 rounded-xl bg-surface hover:bg-surface-container text-on-surface text-xs font-bold text-center border border-border-subtle transition-colors" data-path="cek-tarif" href="#">
                  Cek Ongkir Next Day
                </a>
              </div>
            </div>
            {/* Card 3: Same Day */}
            <div className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-md border border-primary/30 transition-all flex flex-col justify-between relative ring-1 ring-primary/20">
              <div className="absolute -top-3 right-6 bg-[#E4007D] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                Populer
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">electric_moped</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">Kilat &lt; 8 Jam</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Same Day</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Pengiriman super kilat hitungan jam untuk dokumen penting, hampers, atau kuliner segar.
                  </p>
                </div>
                <ul className="text-xs text-on-surface-variant space-y-2 pt-2 border-t border-border-subtle">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">bolt</span>
                    <span className="">Tiba dalam waktu &lt; 8 Jam</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">my_location</span>
                    <span className="">Live tracking GPS kurir</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">call</span>
                    <span className="">Kontak kurir langsung</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">Mulai Dari</span>
                  <span className="text-lg font-bold text-primary">Rp 20.000<span className="text-xs font-normal text-on-surface-variant">/kg</span></span>
                </div>
                <a className="w-full py-2.5 rounded-xl bg-[#E4007D] text-white hover:bg-primary-hover text-xs font-bold text-center transition-colors shadow-xs" data-path="kirim-paket" href="#">
                  Pesan Same Day
                </a>
              </div>
            </div>
            {/* Card 4: Kargo */}
            <div className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-md border border-border-subtle transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[28px]">local_shipping</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-tertiary-fixed/40 text-tertiary">Paket Berat (&gt;10kg)</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Anteraja Kargo</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Biaya paling hemat untuk pengiriman volume besar, peralatan elektronik, koper, dan logistik UMKM.
                  </p>
                </div>
                <ul className="text-xs text-on-surface-variant space-y-2 pt-2 border-t border-border-subtle">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">scale</span>
                    <span className="">Minimum berat hanya 10 kg</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">pallet</span>
                    <span className="">Handling khusus kargo aman</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">local_convenience_store</span>
                    <span className="">Penjemputan armada roda empat</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">Mulai Dari</span>
                  <span className="text-lg font-bold text-tertiary">Rp 3.500<span className="text-xs font-normal text-on-surface-variant">/kg</span></span>
                </div>
                <a className="w-full py-2.5 rounded-xl bg-surface hover:bg-surface-container text-on-surface text-xs font-bold text-center border border-border-subtle transition-colors" data-path="cek-tarif" href="#">
                  Cek Ongkir Kargo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* HUMAN TOUCH & MITRA SATRIA */}
      <section className="w-full px-6 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="w-full bg-white rounded-3xl p-8 lg:p-12 border border-border-subtle shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex-shrink-0 relative">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-sm border-2 border-border-subtle bg-surface">
              <img alt="Satria Anteraja" className="w-full h-full object-cover object-center" src="/profil-satria-testimoni.svg" />
            </div>
            <div className="absolute -bottom-3 -right-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Satria Teladan
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="inline-flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="">4.98 / 5.0 Rating Kepuasan</span>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">Didukung 24.000+ Kurir Satria Berdedikasi</span>
            </div>
            <blockquote className="text-lg sm:text-xl text-on-surface italic font-semibold leading-relaxed">
              “Bagi kami para Satria, setiap paket bukan sekadar nomor resi di aplikasi, melainkan amanah bernilai dan senyuman nyata pelanggan di seberang pintu rumah.”
            </blockquote>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 text-on-surface-variant text-xs">
              <span className="font-bold text-on-surface text-sm">Dimas Suryo Pratama</span>
              <span className="hidden sm:inline">•</span>
              <span className="">Satria Terbaik Jakarta Selatan (4 Tahun Mengabdi di Anteraja)</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col gap-2.5 w-full sm:w-auto">
            <a className="px-7 py-3.5 rounded-2xl bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed font-bold text-sm text-center transition-all shadow-xs" data-path="mitra-satria" href="#">
              Gabung Menjadi Mitra Satria
            </a>
            <span className="text-[11px] text-text-muted text-center">Benefit harian, insentif performa &amp; asuransi lengkap</span>
          </div>
        </div>
      </section>
      {/* FAQ & EMERGENCY SUPPORT 24/7 */}
      <section className="w-full px-6 lg:px-12 py-20 bg-surface-container-low border-t border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full w-fit">PUSAT BANTUAN &amp; FAQ</span>
              <h2 className="text-2xl sm:text-3xl text-on-surface font-extrabold">Pertanyaan yang Sering Diajukan</h2>
              <p className="text-sm text-on-surface-variant">Panduan cepat seputar cara pelacakan resi dan penanganan kendala paket Anda.</p>
            </div>
            <div className="flex flex-col gap-3.5">
              {/* Q1 */}
              <div className="p-5 rounded-2xl bg-white border border-border-subtle shadow-xs flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">help</span>
                  <h3 className="text-sm sm:text-base text-on-surface font-bold">1. Kapan status nomor resi mulai aktif dan bisa dilacak di sistem?</h3>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant pl-9 leading-relaxed">
                  Nomor resi langsung aktif dan dapat dilacak segera setelah kurir Satria melakukan penjemputan (pick-up scan) atau saat paket diserahkan di loket drop point resmi Anteraja (umumnya 15–30 menit setelah proses pemindaian pertama).
                </p>
              </div>
              {/* Q2 */}
              <div className="p-5 rounded-2xl bg-white border border-border-subtle shadow-xs flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">schedule</span>
                  <h3 className="text-sm sm:text-base text-on-surface font-bold">2. Bagaimana jika paket belum tiba melewati estimasi waktu (ETA)?</h3>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant pl-9 leading-relaxed">
                  Jika status resi Anda tidak mengalami pergerakan lebih dari 24 jam atau telah melewati estimasi tanggal tiba, Anda dapat menekan tombol Chat WhatsApp CS atau menu klaim keterlambatan agar tim operasional hub melakukan pengantaran prioritas.
                </p>
              </div>
              {/* Q3 */}
              <div className="p-5 rounded-2xl bg-white border border-border-subtle shadow-xs flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">chat</span>
                  <h3 className="text-sm sm:text-base text-on-surface font-bold">3. Apakah kurir Satria akan menghubungi saya sebelum pengantaran?</h3>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant pl-9 leading-relaxed">
                  Ya, kurir Satria memiliki prosedur standar operasional resmi untuk mengirimkan sapaan ramah via WhatsApp atau SMS sebelum menuju ke lokasi Anda guna memastikan keberadaan penerima di tempat.
                </p>
              </div>
              {/* Q4 */}
              <div className="p-5 rounded-2xl bg-white border border-border-subtle shadow-xs flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">home</span>
                  <h3 className="text-sm sm:text-base text-on-surface font-bold">4. Bagaimana jika saya sedang tidak berada di rumah saat paket diantar?</h3>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant pl-9 leading-relaxed">
                  Anda dapat membalas chat WhatsApp kurir Satria untuk menitipkan paket kepada anggota keluarga, security, tetangga terpercaya, atau meminta jadwal pengantaran ulang pada keesokan harinya tanpa biaya tambahan.
                </p>
              </div>
            </div>
          </div>
          {/* Emergency Support Card samping FAQ */}
          <div className="w-full lg:w-96 p-8 rounded-3xl bg-white border border-border-subtle shadow-sm flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[32px]">support_agent</span>
            </div>
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Layanan CS Siaga 24 Jam</span>
              <h3 className="text-xl font-bold text-on-surface mt-1">Butuh Bantuan Langsung?</h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Tim Anteraja Care siap membantu pengecekan resi, kendala antaran kurir, perubahan alamat, hingga klaim paket kapan saja.
              </p>
            </div>
            <div className="space-y-3 pt-4 border-t border-border-subtle text-xs">
              <div className="flex items-center gap-2 text-on-surface font-medium">
                <span className="material-symbols-outlined text-success-base text-[18px]">verified</span>
                <span className="">Respon cepat di bawah 3 menit</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface font-medium">
                <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                <span className="">Call Center: (021) 5060 3333</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface font-medium">
                <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
                <span className="">cs@anteraja.id</span>
              </div>
            </div>
            <a className="w-full py-3.5 rounded-2xl bg-[#E4007D] hover:bg-primary-hover text-white text-sm font-bold text-center shadow-[0_4px_14px_rgba(228,0,125,0.25)] transition-all flex items-center justify-center gap-2" href="https://wa.me/6281119612345" rel="noopener noreferrer" target="_blank">
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span className="">Chat WhatsApp Customer Care</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
