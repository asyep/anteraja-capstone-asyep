import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRouteForResi } from "@/features/home/data/shipmentsData";

export default function TrackingWarningPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryWaybill = searchParams.get("waybill_number");
  const initialWaybill = queryWaybill?.startsWith("1000849201994")
    ? "1000849201994"
    : queryWaybill || "1000781293812";
  const [waybill, setWaybill] = useState(initialWaybill);
  const [routeOpen, setRouteOpen] = useState(false);
  function handleSubmit(event) {
    event.preventDefault();
    const value = waybill.trim();
    if (value) navigate(getRouteForResi(value));
  }
  async function copyWaybill() {
    try {
      await navigator.clipboard.writeText(waybill);
    } catch {
      /* Clipboard permission may be unavailable for file previews. */
    }
  }
  async function pasteWaybill() {
    try {
      const value = await navigator.clipboard.readText();
      if (value) setWaybill(value.trim());
    } catch {
      /* Keep the current value if clipboard access is blocked. */
    }
  }
  async function shareTracking() {
    const url = window.location.href;
    try {
      if (navigator.share)
        await navigator.share({ title: "Status kiriman Anteraja", url });
      else await navigator.clipboard.writeText(url);
    } catch {
      /* Sharing can be cancelled by the user. */
    }
  }
  return (
    <main className="w-full bg-surface min-h-[calc(100vh-20rem)]" id="main">
      <div className="flex flex-col w-full">
        <section className="relative w-full max-w-[1200px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
            <div className="flex flex-col gap-space-xs">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-warning-surface text-secondary border border-warning-base/30 w-fit shadow-sm">
                <span className="material-symbols-outlined text-warning-base text-[18px]">
                  warning
                </span>
                <span className="font-label-sm text-label-sm font-bold tracking-wide uppercase">
                  Penyesuaian Jalur Transit
                </span>
              </div>
              <h1 className="font-headline-xl text-[28px] leading-9 text-on-surface tracking-tight font-extrabold sm:text-headline-xl sm:leading-[44px]">
                Lacak Pengiriman Smart AI
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Pantau perjalanan paket dengan estimasi real-time dan analisis
                kondisi jalur terupdate secara cerdas.
              </p>
            </div>
          </div>
          <div className="w-full bg-surface-container-lowest rounded-2xl shadow-xl p-space-lg mb-space-xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
            <form
              className="flex flex-col gap-space-md"
              id="tracking-form"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
                <div className="relative flex-1 flex items-center">
                  <span className="material-symbols-outlined text-text-placeholder absolute left-4 text-[22px] pointer-events-none">
                    tag
                  </span>
                  <input
                    className="w-full h-14 pl-12 pr-12 rounded-xl bg-surface-card text-text-primary font-mono-code text-mono-code focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-inner tracking-wide transition-all"
                    id="resi-input"
                    name="waybill_number"
                    inputMode="text"
                    autoComplete="off"
                    minLength="13"
                    maxLength="32"
                    pattern="(?:[0-9]{13,14}|[A-Za-z0-9]{32})"
                    title="Masukkan resi 13–14 digit atau kode alfanumerik 32 karakter."
                    required
                    placeholder="Masukkan nomor resi (13–14 digit atau 32 karakter)"
                    type="text"
                    value={waybill}
                    onChange={(event) => setWaybill(event.target.value)}
                  />
                  <button
                    className="absolute right-3 w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-surface-container-high transition-colors"
                    title="Salin nomor resi"
                    onClick={copyWaybill}
                    type="button"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      id="copy-icon"
                    >
                      content_copy
                    </span>
                  </button>
                </div>
                <button
                  className="h-14 px-space-xl rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-lg hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 shrink-0"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    search
                  </span>
                  <span>Lacak Paket</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant">
                <div className="flex flex-wrap items-center gap-space-sm">
                  <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider text-text-muted">
                    Uji Coba Resi:
                  </span>
                  <a
                    className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-primary-fixed/40 hover:text-primary text-on-surface font-mono-code text-label-sm shadow-sm transition-all flex items-center gap-1.5"
                    href="/tracking-normal?waybill_number=10008492019948271039485729103948"
                  >
                    <span className="w-2 h-2 rounded-full bg-success-base"></span>
                    #1000849201994 (In-Transit)
                  </a>
                  <a
                    className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-primary-fixed/40 hover:text-primary text-on-surface font-mono-code text-label-sm shadow-sm transition-all flex items-center gap-1.5"
                    href="/tracking-live?waybill_number=1000921477821"
                  >
                    <span className="w-2 h-2 rounded-full bg-success-base"></span>
                    #1000921477821 (Live Map)
                  </a>
                  <a
                    className="px-3 py-1.5 rounded-full bg-primary-fixed/40 text-primary font-mono-code text-label-sm shadow-sm transition-all flex items-center gap-1.5 font-bold"
                    href="/tracking?waybill_number=1000781293812"
                  >
                    <span className="w-2 h-2 rounded-full bg-warning-base"></span>
                    #1000781293812 (Peringatan Jalur)
                  </a>
                </div>
                <button
                  className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-dim text-on-surface font-label-sm text-label-sm transition-all flex items-center gap-1.5"
                  onClick={pasteWaybill}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    content_paste
                  </span>
                  <span>Salin dari Clipboard</span>
                </button>
              </div>
            </form>
          </div>
          <div
            className="w-full flex flex-col gap-space-lg"
            id="desktop-view-container"
          >
            <div
              className="w-full bg-warning-surface border border-warning-base/40 rounded-2xl p-space-lg shadow-md flex flex-col gap-space-sm relative overflow-hidden"
              id="operational-warning"
              aria-labelledby="warning-title"
            >
              <div className="flex items-start gap-space-md">
                <div className="w-12 h-12 rounded-xl bg-warning-base/20 text-warning-base flex items-center justify-center shrink-0 shadow-sm">
                  <span
                    className="material-symbols-outlined text-[28px]"
                    aria-hidden="true"
                  >
                    warning
                  </span>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center justify-between gap-space-sm flex-wrap">
                    <h2
                      className="font-headline-sm text-headline-sm font-bold text-on-surface"
                      id="warning-title"
                    >
                      Perhatian: Kendala Lalu Lintas di Jalur Transit (Traffic
                      Jam Heavy)
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        error
                      </span>{" "}
                      Status Kritis
                    </span>
                  </div>
                  <p className="font-mono-code text-label-sm text-text-muted font-bold">
                    Kode Anomali: #TRF-CKP-289
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-1">
                    Kepadatan arus lalu lintas berat terdeteksi di jalur tol
                    transit utama Cikampek - Jakarta. Estimasi waktu tiba
                    disesuaikan demi keamanan Satria dan keutuhan paket Anda.
                  </p>
                  <div className="pt-space-xs">
                    <button
                      className="inline-flex items-center gap-1.5 text-primary font-label-md text-label-md font-bold hover:underline transition-colors focus:outline-none"
                      id="routeToggleBtn"
                      type="button"
                      onClick={() => setRouteOpen((open) => !open)}
                      aria-expanded={routeOpen}
                      aria-controls="altRouteBox"
                    >
                      <span>Lihat Info Alternatif Rute Satria</span>
                      <span
                        className="material-symbols-outlined transition-transform text-[20px]"
                        id="routeArrow"
                        aria-hidden="true"
                      >
                        expand_more
                      </span>
                    </button>
                    <div
                      className={`mt-space-sm p-space-md rounded-xl bg-surface-container-lowest border border-border-subtle shadow-sm ${routeOpen ? "" : "hidden"}`}
                      id="altRouteBox"
                    >
                      <div className="flex items-center gap-2 text-primary font-label-md text-label-md font-bold mb-1">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          alt_route
                        </span>
                        <span>Rute Pengalihan Terverifikasi</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Armada dialihkan melalui jalur alternatif menuju
                        checkpoint terdekat untuk menghindari kepadatan di
                        koridor Cikampek–Jakarta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full bg-warning-surface/80 border border-warning-base/30 rounded-2xl p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm">
              <div className="flex min-w-0 items-start gap-space-md sm:items-center">
                <div className="w-12 h-12 rounded-xl bg-warning-base text-on-secondary flex items-center justify-center shadow-md shrink-0">
                  <span className="material-symbols-outlined text-[26px]">
                    schedule
                  </span>
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="font-label-sm text-label-sm text-secondary font-extrabold uppercase tracking-widest">
                    Status Pembaruan Waktu
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">
                      Estimasi Tiba: 29 September 2026, 12:00 WIB
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-warning-surface text-secondary border border-warning-base/30 font-label-sm text-label-sm font-bold">
                      Dalam Penyesuaian
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-text-muted line-through mt-0.5">
                    Estimasi awal: 28 September 2026, 18:00 WIB
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm self-stretch sm:self-end md:self-center">
                <span className="px-3 py-1.5 rounded-full bg-success-surface text-tertiary font-label-md text-label-md font-bold flex items-center gap-1.5 shadow-sm border border-success-base/30">
                  <span className="material-symbols-outlined text-[16px] text-success-base">
                    local_shipping
                  </span>
                  Gratis Ongkir
                </span>
                <span className="px-3 py-1.5 rounded-full bg-warning-surface text-secondary font-label-md text-label-md font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-warning-base animate-pulse"></span>
                  Transit Tertunda
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              <div className="lg:col-span-8 flex flex-col gap-space-lg h-full">
                <div className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-lg relative overflow-hidden">
                  <div className="flex items-start gap-space-md">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md bg-secondary-container ring-2 ring-warning-base/50">
                        <img
                          alt="Satria Assistant Avatar"
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida/AEtjO1Vctw_qF3mxbNifTxAQVSYGcMaAS2QsLK2Wh7MB4rOrJEAHAb6xB6uINRAQaVEFS-ewv3IIdVOqiAIzTK6HxVUhLEkcrAQiOF4nkcbgzeTMlXu0GOxudbl2cCd7X5ErCpfJh6TrgVY37lqI5R3vDE_4NxNkI53ZiNhy39RMi5DsIuypNAQ0fxsIVKw5ig48hfwvZwRIwiFEcM_5nkfaZtbseG-4rkjeSS40rrWiOVPsWO-RU_1MGe6dlZy5"
                        />
                      </div>
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-warning-base ring-2 ring-surface-container-lowest flex items-center justify-center"
                        title="Satria Monitor"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-space-xs flex-1">
                      <div className="flex items-center justify-between gap-space-xs flex-wrap">
                        <div className="flex items-center gap-2">
                          <h2
                            className="font-headline-sm text-headline-sm font-bold text-on-surface"
                            id="warning-ai-title"
                          >
                            Satria Assistant
                          </h2>
                          <span className="px-2.5 py-0.5 rounded-full bg-ai-surface text-ai-accent font-label-sm text-label-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">
                              auto_awesome
                            </span>
                            Resmi AI 2.4
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                          Sinkronisasi: 2 menit lalu
                        </span>
                      </div>
                      <p className="font-body-lg text-body-lg text-on-surface bg-surface-container-low/70 p-space-md rounded-xl leading-relaxed mt-1 border-l-4 border-warning-base">
                        “Mohon maaf atas keterlambatan ini ya Kak. Arus lalu
                        lintas di jalur transit saat ini mengalami kepadatan
                        tinggi (Traffic Jam Heavy). Namun jangan khawatir,
                        Satria kami sedang aktif berkoordinasi memandu rute
                        alternatif bebas hambatan agar paket Kakak tiba dengan
                        selamat dan termonitor 24 jam.”
                      </p>
                      <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                        <button
                          type="button"
                          className="h-11 px-space-md rounded-xl bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold hover:bg-secondary-fixed active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
                        >
                          <span
                            className="material-symbols-outlined text-[18px]"
                            aria-hidden="true"
                          >
                            notifications_active
                          </span>
                          <span>Notifikasi Update via WA</span>
                        </button>
                        <a
                          className="h-11 px-space-md rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-high active:scale-[0.98] transition-all flex items-center gap-2"
                          href="/bantuan"
                        >
                          <span
                            className="material-symbols-outlined text-[18px]"
                            aria-hidden="true"
                          >
                            support_agent
                          </span>
                          <span>Tanya CS Satria</span>
                        </a>
                        <div className="ml-auto hidden sm:flex items-center gap-1.5 text-text-muted font-body-sm text-body-sm">
                          <span
                            className="material-symbols-outlined text-tertiary text-[16px]"
                            aria-hidden="true"
                          >
                            verified
                          </span>
                          <span>Diproteksi Garansi Satria Protek</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-lg flex-1 flex flex-col"
                  aria-labelledby="warning-timeline-title"
                >
                  <div className="flex items-center justify-between mb-space-lg">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[24px]">
                        timeline
                      </span>
                      <h2
                        className="font-headline-sm text-headline-sm font-bold text-on-surface"
                        id="warning-timeline-title"
                      >
                        Alur Riwayat Perjalanan
                      </h2>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-mono-code">
                      3 Dari 4 Tahap Selesai
                    </span>
                  </div>
                  <div className="relative flex flex-col md:flex-row items-start justify-between gap-space-lg md:gap-space-sm pt-space-xs pb-space-xs">
                    <div className="hidden md:block absolute top-[22px] left-[5%] right-[5%] h-1 z-0 pointer-events-none">
                      <div className="w-full h-full flex">
                        <div className="w-1/3 h-full bg-success-base"></div>
                        <div className="w-1/3 h-full bg-warning-base"></div>
                        <div className="w-1/3 h-full bg-[linear-gradient(to_right,#D1D5DB_50%,transparent_50%)] bg-[length:12px_100%]"></div>
                      </div>
                    </div>
                    <div className="relative z-10 flex md:flex-col items-center md:items-center text-left md:text-center w-full md:w-1/4 gap-space-sm">
                      <div className="w-11 h-11 rounded-full bg-success-base text-on-primary flex items-center justify-center shadow-md ring-4 ring-surface-container-lowest shrink-0">
                        <span
                          className="material-symbols-outlined text-[20px] font-bold"
                          aria-hidden="true"
                        >
                          check
                        </span>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">
                          Pesanan Dibuat
                        </span>
                        <span className="font-mono-code text-body-sm text-tertiary font-bold">
                          26 Sep 2024, 11:00 WIB
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Hub Semarang Barat
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 flex md:flex-col items-center md:items-center text-left md:text-center w-full md:w-1/4 gap-space-sm">
                      <div className="w-11 h-11 rounded-full bg-success-base text-on-primary flex items-center justify-center shadow-md ring-4 ring-surface-container-lowest shrink-0">
                        <span
                          className="material-symbols-outlined text-[20px] font-bold"
                          aria-hidden="true"
                        >
                          check
                        </span>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">
                          Diproses Satria
                        </span>
                        <span className="font-mono-code text-body-sm text-tertiary font-bold">
                          27 Sep 2024, 08:20 WIB
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Linehaul Hub Cikampek
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 flex md:flex-col items-center md:items-center text-left md:text-center w-full md:w-1/4 gap-space-sm">
                      <div className="relative w-11 h-11 shrink-0">
                        <span className="absolute inset-0 rounded-full bg-warning-base/40 animate-ping opacity-75"></span>
                        <div className="relative w-11 h-11 rounded-full bg-warning-base text-on-secondary flex items-center justify-center shadow-lg ring-4 ring-warning-surface">
                          <span
                            className="material-symbols-outlined text-[20px] font-bold"
                            aria-hidden="true"
                          >
                            priority_high
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span className="font-label-lg text-label-lg font-bold text-secondary">
                          Dalam Perjalanan
                        </span>
                        <span className="font-mono-code text-body-sm text-secondary font-extrabold">
                          28 Sep 2024, 10:15 WIB
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface font-semibold mt-0.5">
                          Tol Cikampek KM 38
                        </span>
                        <span className="mt-1 px-2 py-0.5 rounded-full bg-warning-surface text-secondary font-label-sm text-label-sm font-bold border border-warning-base/30">
                          Transit Tertunda - Traffic Jam
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 flex md:flex-col items-center md:items-center text-left md:text-center w-full md:w-1/4 gap-space-sm opacity-60">
                      <div className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shadow-inner ring-4 ring-surface-container-lowest shrink-0">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          home
                        </span>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span className="font-label-lg text-label-lg font-bold text-on-surface-variant">
                          Tiba di Tujuan
                        </span>
                        <span className="font-mono-code text-body-sm text-text-muted">
                          Estimasi Baru 29 Sep 12:00
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Cilandak, Jakarta Selatan
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-space-lg pt-space-md border-t border-border-subtle/50 flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between text-on-surface">
                      <span className="font-label-md text-label-md font-bold">
                        Catatan Perjalanan Detil
                      </span>
                      <span className="font-body-sm text-body-sm text-text-muted">
                        Langkah Verifikasi Real-time
                      </span>
                    </div>
                    <div className="flex flex-col gap-space-xs text-body-sm flex-1">
                      <div className="p-space-sm rounded-xl bg-warning-surface/50 border border-warning-base/20 flex items-start justify-between gap-space-sm">
                        <div className="flex items-start gap-space-sm">
                          <span className="w-2.5 h-2.5 rounded-full bg-warning-base mt-1.5 shrink-0 animate-pulse"></span>
                          <div>
                            <p className="font-label-sm text-label-sm font-bold text-on-surface">
                              Dalam Perjalanan (Transit Tertunda - Traffic Jam)
                            </p>
                            <p className="text-on-surface-variant font-body-sm text-body-sm">
                              Armada mengalami perlambatan di koridor Tol
                              Jakarta-Cikampek KM 38 akibat genangan air dan
                              hujan lebat. Armada sedang dipandu koordinasi
                              Satelit Anteraja Command Center ke shelter
                              checkpoint terdekat.
                            </p>
                            <div className="mt-1 text-[11px] font-semibold text-secondary flex items-center gap-2">
                              <span>📍 Rest Area KM 42</span>
                              <span>•</span>
                              <span>🌡️ Suhu Kargo: 26°C (Aman & Kering)</span>
                            </div>
                          </div>
                        </div>
                        <span className="font-mono-code text-label-sm text-secondary font-bold shrink-0">
                          28/09 10:15
                        </span>
                      </div>
                      <div className="p-space-sm rounded-xl bg-surface-card flex items-start justify-between gap-space-sm">
                        <div className="flex items-start gap-space-sm">
                          <span className="w-2 h-2 rounded-full bg-border-strong mt-1.5 shrink-0"></span>
                          <div>
                            <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                              Diproses Satria (Linehaul Transit)
                            </p>
                            <p className="text-on-surface-variant font-body-sm text-body-sm">
                              Paket keluar dari sortir gateway utama dan
                              dimasukkan ke dalam container pengiriman jalur
                              darat menuju Hub Cikampek.
                            </p>
                            <small className="text-text-muted">
                              Manifest Kendaraan: B 9924 UXZ (Truck Linehaul)
                            </small>
                          </div>
                        </div>
                        <span className="font-mono-code text-label-sm text-text-muted shrink-0">
                          27/09 08:20
                        </span>
                      </div>
                      <div className="p-space-sm rounded-xl bg-surface-card flex items-start justify-between gap-space-sm">
                        <div className="flex items-start gap-space-sm">
                          <span className="w-2 h-2 rounded-full bg-border-strong mt-1.5 shrink-0"></span>
                          <div>
                            <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                              Pesanan Dibuat (Pickup Selesai)
                            </p>
                            <p className="text-on-surface-variant font-body-sm text-body-sm">
                              Paket diterima di Hub Semarang Barat oleh Satria
                              Agen. Barcode berhasil di-generate dan divalidasi
                              ke sistem sentral.
                            </p>
                            <small className="text-text-muted">
                              Petugas: Satria Dewanto (ID: SMG-819) • Berat:
                              1.45 kg
                            </small>
                          </div>
                        </div>
                        <span className="font-mono-code text-label-sm text-text-muted shrink-0">
                          26/09 11:00
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-lg flex flex-col gap-space-sm border border-border-subtle/50">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-primary text-[18px]"
                        aria-hidden="true"
                      >
                        map
                      </span>
                      Radar Jalur Kiriman
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-warning-surface text-secondary font-label-sm text-label-sm font-bold border border-warning-base/30">
                      Pola Transit Diverted
                    </span>
                  </div>
                  <div
                    className="w-full h-48 bg-cover bg-center rounded-xl relative overflow-hidden shadow-inner flex items-end justify-between p-3"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2Gx4y9FZV8HTAj66vDV-vwCtl83PxiCHn4c5c56wMiUfeVg_0OuMHxNqhCSoC3WVrxiUZyFFPkK8HUtTlYmj24FBdOVYcvEMbO7QipnWFPciptLSl0fj1YKLqavv4dzYIzPmo1AvIYB5h28cA8hAaKiG71lCODxR_4y8pGa3nTyT1m5n-gZZieK1PO4toQl6LFXX8v_QsWoUJc4fAUwVtb3mYEprGdgCK9V-FQ6iAbtvWJPJILl11iQ')",
                    }}
                  >
                    <div className="relative z-10 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-warning-base animate-ping"></div>
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">
                        Armada Satria #42 (Rest Area KM 42)
                      </span>
                    </div>
                    <div className="relative z-10 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-1 rounded-md shadow-md text-label-sm font-mono-code text-on-surface">
                      Diverted
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-body-sm text-body-sm text-text-muted">
                      Titik Koordinat: -6.4025, 107.3014
                    </span>
                    <a
                      className="text-primary font-label-sm text-label-sm font-bold hover:underline flex items-center gap-0.5"
                      href="/tracking-live"
                    >
                      Perbesar{" "}
                      <span
                        className="material-symbols-outlined text-[14px]"
                        aria-hidden="true"
                      >
                        open_in_new
                      </span>
                    </a>
                  </div>
                </div>
                <div className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-lg flex flex-col gap-space-md border border-border-subtle/50">
                  <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle/50">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-primary text-[22px]"
                        aria-hidden="true"
                      >
                        inventory_2
                      </span>
                      <h3
                        className="font-headline-sm text-headline-sm font-bold text-on-surface"
                        id="warning-package-title"
                      >
                        Rincian Paket
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                      Layanan Reguler
                    </span>
                  </div>
                  <div className="flex flex-col gap-space-md">
                    <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
                      <div className="p-space-sm rounded-xl bg-surface-card flex flex-col">
                        <span className="font-label-sm text-label-sm text-text-muted">
                          Nomor Resi (AWB)
                        </span>
                        <span className="font-mono-code text-label-md font-bold text-on-surface">
                          1000781293812
                        </span>
                      </div>
                      <div className="p-space-sm rounded-xl bg-surface-card flex flex-col">
                        <span className="font-label-sm text-label-sm text-text-muted">
                          Jenis Barang
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          Elektronik & Aksesoris
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">
                          storefront
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-sm text-label-sm uppercase font-bold text-text-muted">
                          Pengirim (Asal)
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                          Toko Sentral Komputer Semarang
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Semarang Barat, Kota Semarang, Jawa Tengah
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">
                          person_pin_circle
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-sm text-label-sm uppercase font-bold text-text-muted">
                          Penerima (Tujuan)
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          Bambang Hidayat
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                          Cilandak Barat, Cilandak, Jakarta Selatan 12430
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-space-sm pt-space-xs sm:grid-cols-2">
                      <div className="p-space-sm rounded-xl bg-surface-card flex flex-col">
                        <span className="font-label-sm text-label-sm text-text-muted">
                          Berat / Volume
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          1.45 Kg
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          0.003 m³
                        </span>
                      </div>
                      <div className="p-space-sm rounded-xl bg-surface-card flex flex-col">
                        <span className="font-label-sm text-label-sm text-text-muted">
                          Asuransi Proteksi
                        </span>
                        <span className="font-label-md text-label-md font-bold text-tertiary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            verified
                          </span>{" "}
                          Aktif
                        </span>
                        <span className="font-body-sm text-body-sm text-tertiary">
                          Full Coverage
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-lg flex flex-col gap-space-md border border-border-subtle/50"
                  aria-labelledby="warning-courier-title"
                >
                  <div className="flex items-center justify-between pb-space-xs border-b border-border-subtle/50">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-primary text-[20px]"
                        aria-hidden="true"
                      >
                        badge
                      </span>
                      <h3
                        className="font-label-lg text-label-lg font-bold text-on-surface"
                        id="warning-courier-title"
                      >
                        Satria Bertugas
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-mono-code text-label-sm text-text-muted font-bold">
                      ID: #JKT-88219
                    </span>
                  </div>
                  <div className="flex items-center gap-space-md">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md bg-surface-container">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD69cWIIxsJ98_1KHzF7HXERTT10HAAaKI-NbrmGAH7H9zBLU7OxfW28XoSkbQUTkLHJmhOAWMtOt3pS925THRD7fSvlFqHQLiOCWn9kvfewwunbCyNBQP6qIxBXsFzXuz7kdmW0R0E-Z44rHi3TgY1HiGCTyIRhRfpJK3jNWIQt-saXAHMzTh1N4RHavyZstCt-O4CjNe5vLACuIfy7-mYZyxWgsRlLJQCS1u66EV3jbnQ1vGwsmXu-Q"
                          alt="Foto Agus Prasetyo, kurir Anteraja"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success-base ring-2 ring-surface-container-lowest flex items-center justify-center"
                        title="Sedang bertugas aktif di rute"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
                          Agus Prasetyo
                        </h4>
                        <span
                          className="material-symbols-outlined text-primary text-[16px]"
                          title="Terverifikasi"
                        >
                          verified
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-secondary mt-0.5">
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="font-label-sm text-label-sm font-bold">
                          4.98
                        </span>
                        <span className="text-text-muted font-body-sm text-body-sm">
                          (2,410 Kiriman Sukses)
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
                        Armada Satria Motor Tebet
                      </span>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-card p-space-sm rounded-xl leading-relaxed">
                    Satria Agus telah terlatih dalam standar penanganan paket
                    darurat & bersertifikasi SOP cuaca ekstrem Anteraja.
                  </p>
                  <div className="grid grid-cols-1 gap-space-sm pt-space-xs sm:grid-cols-2">
                    <a
                      className="h-11 px-space-sm rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high active:scale-[0.98] font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm border border-border-subtle/50"
                      href="tel:+6281119603333"
                    >
                      <span
                        className="material-symbols-outlined text-[18px] text-on-surface-variant"
                        aria-hidden="true"
                      >
                        call
                      </span>
                      <span>Hubungi</span>
                    </a>
                    <a
                      className="h-11 px-space-sm rounded-xl bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
                      href="/bantuan"
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        sms
                      </span>
                      <span>Pesan Kilat</span>
                    </a>
                  </div>
                </div>
                <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-md flex flex-col gap-2 border border-border-subtle/50">
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Jika keterlambatan melebihi batas 24 jam dari estimasi baru
                    akibat kendala cuaca, Anda berhak klaim voucher bebas ongkir
                    100%.
                  </p>
                  <a
                    className="text-primary font-label-sm text-label-sm font-bold hover:underline inline-flex items-center gap-1"
                    href="/bantuan"
                  >
                    Pelajari Kebijakan Operasional Cuaca →
                  </a>
                </div>
              </div>
            </div>
            <section
              className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-lg"
              aria-label="Layanan tambahan"
            >
              <article className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md flex items-start gap-space-md border border-border-subtle/50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-[24px]"
                    aria-hidden="true"
                  >
                    support_agent
                  </span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                    Butuh Bantuan Segera?
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Hubungi Satria Care 24/7 jika status tidak diperbarui lebih
                    dari 24 jam.
                  </p>
                </div>
              </article>
              <article className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md flex items-start gap-space-md border border-border-subtle/50">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-[24px]"
                    aria-hidden="true"
                  >
                    notifications_active
                  </span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                    Notifikasi WhatsApp
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Kirim ringkasan berkala ke kontak penerima otomatis.
                  </p>
                </div>
              </article>
              <article className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md flex items-start gap-space-md border border-border-subtle/50">
                <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-[24px]"
                    aria-hidden="true"
                  >
                    verified_user
                  </span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                    Garansi Tepat Waktu
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Klaim asuransi perlindungan barang bebas biaya tambahan.
                  </p>
                </div>
              </article>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
