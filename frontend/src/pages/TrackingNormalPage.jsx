import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRouteForResi } from "../data/shipmentsData";

export default function TrackingNormalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryWaybill = searchParams.get("waybill_number");
  const initialWaybill = queryWaybill?.startsWith("1000849201994")
    ? "1000849201994"
    : queryWaybill || "1000849201994";
  const [waybill, setWaybill] = useState(initialWaybill);
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
    <main className="w-full bg-surface min-h-[calc(100vh-20rem)]">
      <div className="flex flex-col w-full">
        <section className="relative w-full max-w-[1200px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
            <div className="flex flex-col gap-space-xs">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-ai-surface w-fit shadow-sm">
                <span className="material-symbols-outlined text-ai-accent text-[18px]">
                  auto_awesome
                </span>
                <span className="font-label-sm text-label-sm text-ai-accent font-bold tracking-wide uppercase">
                  AI-Powered Tracking Diagnostics
                </span>
              </div>
              <h1 className="font-headline-xl text-[28px] leading-9 text-on-surface tracking-tight font-extrabold sm:text-headline-xl sm:leading-[44px]">
                Lacak Pengiriman Smart AI
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Pantau status paket real-time dengan asisten pintar Satria AI,
                akurasi rute dinamis, dan jaminan estimasi waktu terpercaya.
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
                    className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-primary-fixed/40 hover:text-primary text-on-surface font-mono-code text-label-sm shadow-sm transition-all flex items-center gap-1.5"
                    href="/tracking?waybill_number=1000781293812"
                  >
                    <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim"></span>
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
            <div className="w-full bg-primary-fixed/30 rounded-2xl p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm">
              <div className="flex min-w-0 items-start gap-space-md sm:items-center">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[26px]">
                    schedule
                  </span>
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="font-label-sm text-label-sm text-primary font-extrabold uppercase tracking-widest">
                    Status Pengantaran Aktif
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline-md text-headline-md font-bold text-on-primary-fixed">
                      Estimasi Tiba: 28 September 2026, 18:30 WIB
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-ai-surface text-ai-accent font-label-sm text-label-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        psychology
                      </span>
                      Akurasi AI 96.8%
                    </span>
                  </div>
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
                  Dalam Pengantaran Kurir
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              <div className="lg:col-span-8 flex flex-col gap-space-lg h-full">
                <div className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-lg relative overflow-hidden">
                  <div className="flex items-start gap-space-md">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md bg-secondary-container ring-2 ring-primary-fixed">
                        <img
                          alt="Satria Assistant Avatar"
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida/AEtjO1Vctw_qF3mxbNifTxAQVSYGcMaAS2QsLK2Wh7MB4rOrJEAHAb6xB6uINRAQaVEFS-ewv3IIdVOqiAIzTK6HxVUhLEkcrAQiOF4nkcbgzeTMlXu0GOxudbl2cCd7X5ErCpfJh6TrgVY37lqI5R3vDE_4NxNkI53ZiNhy39RMi5DsIuypNAQ0fxsIVKw5ig48hfwvZwRIwiFEcM_5nkfaZtbseG-4rkjeSS40rrWiOVPsWO-RU_1MGe6dlZy5"
                        />
                      </div>
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success-base ring-2 ring-surface-container-lowest flex items-center justify-center"
                        title="Satria Online"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-space-xs flex-1">
                      <div className="flex items-center justify-between gap-space-xs flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                            Satria Assistant
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-ai-surface text-ai-accent font-label-sm text-label-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">
                              auto_awesome
                            </span>
                            Satria AI
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                            Terverifikasi
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                          Satria Agus Prasetyo (ID: STR-88219)
                        </span>
                      </div>
                      <p className="font-body-lg text-body-lg text-on-surface bg-surface-container-low/70 p-space-md rounded-xl leading-relaxed mt-1">
                        "Halo Kak Budi! Paketmu sudah selesai disortir di Hub
                        Jakarta Selatan dan saat ini sedang dibawa oleh Satria
                        Agus Prasetyo menuju alamat rumahmu di Tebet Barat.
                        Satria memperkirakan paket tiba sore ini sebelum pukul
                        18:30 WIB. Paketmu terlindungi aman dalam perjalanan!"
                      </p>
                      <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                        <a
                          className="h-11 px-space-md rounded-xl bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold hover:bg-secondary-fixed active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
                          href="https://wa.me/6281119603333?text=Halo%20Satria%20Agus,%20saya%20Budi%20penerima%20paket%2010008492019948271039485729103948"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            chat
                          </span>
                          <span>Hubungi Satria via WhatsApp</span>
                        </a>
                        <button
                          className="h-11 px-space-md rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-high active:scale-[0.98] transition-all flex items-center gap-2"
                          onClick={shareTracking}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            share
                          </span>
                          <span id="share-label">Bagikan Status</span>
                        </button>
                        <div className="ml-auto hidden sm:flex items-center gap-1.5 text-text-muted font-body-sm text-body-sm">
                          <span className="material-symbols-outlined text-success-base text-[16px]">
                            verified
                          </span>
                          <span>Protokol Satria Sigap & Aman</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-lg flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-space-lg">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[24px]">
                        timeline
                      </span>
                      <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        Progres Pengiriman Riil
                      </h2>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-mono-code">
                      Updated 2 menit lalu
                    </span>
                  </div>
                  <div className="relative flex flex-col md:flex-row items-start justify-between gap-space-lg md:gap-space-sm pt-space-xs pb-space-xs">
                    <div className="hidden md:block absolute top-[22px] left-[5%] right-[5%] h-1 z-0 pointer-events-none">
                      <div className="w-full h-full flex">
                        <div className="w-1/3 h-full bg-success-base"></div>
                        <div className="w-1/3 h-full bg-success-base"></div>
                        <div className="w-1/3 h-full bg-[linear-gradient(to_right,#D1D5DB_50%,transparent_50%)] bg-[length:12px_100%]"></div>
                      </div>
                    </div>
                    <div className="relative z-10 flex md:flex-col items-center md:items-center text-left md:text-center w-full md:w-1/4 gap-space-sm">
                      <div className="w-11 h-11 rounded-full bg-success-base text-on-primary flex items-center justify-center shadow-md ring-4 ring-surface-container-lowest shrink-0">
                        <span className="material-symbols-outlined text-[20px] font-bold">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">
                          Pesanan Dibuat
                        </span>
                        <span className="font-mono-code text-body-sm text-tertiary font-bold">
                          26 Sep 2024, 14:15 WIB
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Hub Bandung Timur
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 flex md:flex-col items-center md:items-center text-left md:text-center w-full md:w-1/4 gap-space-sm">
                      <div className="w-11 h-11 rounded-full bg-success-base text-on-primary flex items-center justify-center shadow-md ring-4 ring-surface-container-lowest shrink-0">
                        <span className="material-symbols-outlined text-[20px] font-bold">
                          check
                        </span>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">
                          Diproses Kurir
                        </span>
                        <span className="font-mono-code text-body-sm text-tertiary font-bold">
                          27 Sep 2024, 09:30 WIB
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Gateway Halim Transit
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 flex md:flex-col items-center md:items-center text-left md:text-center w-full md:w-1/4 gap-space-sm">
                      <div className="relative w-11 h-11 shrink-0">
                        <span className="absolute inset-0 rounded-full bg-success-base/30 animate-ping opacity-75"></span>
                        <div className="relative w-11 h-11 rounded-full bg-success-base text-on-primary flex items-center justify-center shadow-lg ring-4 ring-success-surface">
                          <span className="material-symbols-outlined text-[20px] font-bold">
                            check
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span className="font-label-lg text-label-lg font-bold text-tertiary">
                          Dalam Perjalanan
                        </span>
                        <span className="font-mono-code text-body-sm text-tertiary font-extrabold">
                          28 Sep 2024, 13:45 WIB
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface font-semibold mt-0.5">
                          Menuju Alamat Penerima
                        </span>
                        <span className="mt-1 px-2 py-0.5 rounded-full bg-warning-surface text-secondary font-label-sm text-label-sm font-bold">
                          Kurir Bergerak
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 flex md:flex-col items-center md:items-center text-left md:text-center w-full md:w-1/4 gap-space-sm opacity-60">
                      <div className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shadow-inner ring-4 ring-surface-container-lowest shrink-0">
                        <span className="material-symbols-outlined text-[20px]">
                          home
                        </span>
                      </div>
                      <div className="flex flex-col md:items-center">
                        <span className="font-label-lg text-label-lg font-bold text-on-surface-variant">
                          Tiba di Tujuan
                        </span>
                        <span className="font-mono-code text-body-sm text-text-muted">
                          Estimasi 18:30 WIB
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Tebet, Jakarta Selatan
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
                        6 dari 6 Pos Selesai
                      </span>
                    </div>
                    <div className="flex flex-col gap-space-xs text-body-sm flex-1">
                      <div className="p-space-sm rounded-xl bg-surface-card flex items-start justify-between gap-space-sm">
                        <div className="flex items-start gap-space-sm">
                          <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></span>
                          <div>
                            <p className="font-label-sm text-label-sm font-bold text-on-surface">
                              Out for Delivery (Menuju Lokasi Tujuan)
                            </p>
                            <p className="text-on-surface-variant font-body-sm text-body-sm">
                              Paket dibawa oleh Satria Agus Prasetyo - Staging
                              Store Tebet Utara
                            </p>
                          </div>
                        </div>
                        <span className="font-mono-code text-label-sm text-primary font-bold shrink-0">
                          28/09 13:45
                        </span>
                      </div>
                      <div className="p-space-sm rounded-xl bg-surface-card flex items-start justify-between gap-space-sm">
                        <div className="flex items-start gap-space-sm">
                          <span className="w-2 h-2 rounded-full bg-border-strong mt-1.5 shrink-0"></span>
                          <div>
                            <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                              Tiba di Delivery Hub Tebet
                            </p>
                            <p className="text-on-surface-variant font-body-sm text-body-sm">
                              Paket telah disortir di Staging Store Jakarta
                              Selatan - Tebet
                            </p>
                          </div>
                        </div>
                        <span className="font-mono-code text-label-sm text-text-muted shrink-0">
                          28/09 06:12
                        </span>
                      </div>
                      <div className="p-space-sm rounded-xl bg-surface-card flex items-start justify-between gap-space-sm">
                        <div className="flex items-start gap-space-sm">
                          <span className="w-2 h-2 rounded-full bg-border-strong mt-1.5 shrink-0"></span>
                          <div>
                            <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                              Transit Antar Gateway (Halim ke Tebet)
                            </p>
                            <p className="text-on-surface-variant font-body-sm text-body-sm">
                              Paket diberangkatkan dari Hub Transit Halim menuju
                              Hub Tebet
                            </p>
                          </div>
                        </div>
                        <span className="font-mono-code text-label-sm text-text-muted shrink-0">
                          27/09 23:40
                        </span>
                      </div>
                      <div className="p-space-sm rounded-xl bg-surface-card flex items-start justify-between gap-space-sm">
                        <div className="flex items-start gap-space-sm">
                          <span className="w-2 h-2 rounded-full bg-border-strong mt-1.5 shrink-0"></span>
                          <div>
                            <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                              Tiba di Gateway Transit Halim
                            </p>
                            <p className="text-on-surface-variant font-body-sm text-body-sm">
                              Paket tiba di fasilitas sortir Gateway Halim
                              Jakarta
                            </p>
                          </div>
                        </div>
                        <span className="font-mono-code text-label-sm text-text-muted shrink-0">
                          27/09 09:30
                        </span>
                      </div>
                      <div className="p-space-sm rounded-xl bg-surface-card flex items-start justify-between gap-space-sm">
                        <div className="flex items-start gap-space-sm">
                          <span className="w-2 h-2 rounded-full bg-border-strong mt-1.5 shrink-0"></span>
                          <div>
                            <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                              Manifest Outbound Hub Bandung Timur
                            </p>
                            <p className="text-on-surface-variant font-body-sm text-body-sm">
                              Paket diproses sortir dan dimasukkan dalam armada
                              line-haul Jakarta
                            </p>
                          </div>
                        </div>
                        <span className="font-mono-code text-label-sm text-text-muted shrink-0">
                          26/09 18:00
                        </span>
                      </div>
                      <div className="p-space-sm rounded-xl bg-surface-card flex items-start justify-between gap-space-sm">
                        <div className="flex items-start gap-space-sm">
                          <span className="w-2 h-2 rounded-full bg-border-strong mt-1.5 shrink-0"></span>
                          <div>
                            <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                              Paket Di-pickup Satria dari Toko Pengirim
                            </p>
                            <p className="text-on-surface-variant font-body-sm text-body-sm">
                              Paket diserahkan oleh Toko Sentral Komputer
                              Semarang ke Satria Anteraja
                            </p>
                          </div>
                        </div>
                        <span className="font-mono-code text-label-sm text-text-muted shrink-0">
                          26/09 14:15
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                <div className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-lg flex flex-col gap-space-md">
                  <div className="flex items-center justify-between pb-space-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">
                        inventory_2
                      </span>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        Rincian Paket
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                      Reguler
                    </span>
                  </div>
                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-start gap-space-sm">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">
                          storefront
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-sm text-label-sm uppercase font-bold text-text-muted">
                          Pengirim
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                          Toko Sentral Komputer Semarang
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Kota Semarang, Jawa Tengah
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
                          Penerima
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          Budi Santoso
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                          Jl. Tebet Barat Dalam No. 42, RT 05 / RW 03, Jakarta
                          Selatan, DKI Jakarta 12810
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-space-sm pt-space-xs sm:grid-cols-2">
                      <div className="p-space-sm rounded-xl bg-surface-card flex flex-col">
                        <span className="font-label-sm text-label-sm text-text-muted">
                          Layanan
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          Anteraja Regular
                        </span>
                        <span className="font-body-sm text-body-sm text-success-base font-semibold">
                          1-2 Hari Kerja
                        </span>
                      </div>
                      <div className="p-space-sm rounded-xl bg-surface-card flex flex-col">
                        <span className="font-label-sm text-label-sm text-text-muted">
                          Berat Paket
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          1.25 Kg
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Dimensi 20x15x10 cm
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-space-xs text-body-sm text-body-sm text-text-muted">
                      <span className="">Asuransi Kiriman</span>
                      <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          verified_user
                        </span>{" "}
                        Terlindungi
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm text-body-sm text-text-muted">
                      <span className="">Instruksi Khusus</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                        Taruh di Rak Teras jika Kosong
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-lg flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        near_me
                      </span>
                      Radar Posisi Satria
                    </span>
                    <span className="text-label-sm font-label-sm text-primary font-bold">
                      ~1.4 km ke Tujuan
                    </span>
                  </div>
                  <div
                    className="w-full h-48 bg-cover bg-center rounded-xl relative overflow-hidden shadow-inner flex items-end justify-between p-3"
                    data-location="Jl. Tebet Barat Dalam, Jakarta Selatan, Indonesia"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2Gx4y9FZV8HTAj66vDV-vwCtl83PxiCHn4c5c56wMiUfeVg_0OuMHxNqhCSoC3WVrxiUZyFFPkK8HUtTlYmj24FBdOVYcvEMbO7QipnWFPciptLSl0fj1YKLqavv4dzYIzPmo1AvIYB5h28cA8hAaKiG71lCODxR_4y8pGa3nTyT1m5n-gZZieK1PO4toQl6LFXX8v_QsWoUJc4fAUwVtb3mYEprGdgCK9V-FQ6iAbtvWJPJILl11iQ')",
                    }}
                  >
                    <div className="relative z-10 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></div>
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">
                        Satria Agus: Tebet Raya
                      </span>
                    </div>
                    <div className="relative z-10 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-1 rounded-md shadow-md text-label-sm font-mono-code text-on-surface">
                      GPS Live
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-body-sm text-body-sm text-text-muted">
                      Kondisi Lalu Lintas: Ramai Lancar
                    </span>
                    <a
                      className="text-primary font-label-sm text-label-sm font-bold hover:underline flex items-center gap-0.5"
                      href="/tracking-live"
                    >
                      Buka Peta Besar{" "}
                      <span className="material-symbols-outlined text-[14px]">
                        open_in_new
                      </span>
                    </a>
                  </div>
                </div>
                <div className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-lg flex flex-col gap-space-md border border-border-subtle/50">
                  <div className="flex items-center justify-between pb-space-xs border-b border-border-subtle/50">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        badge
                      </span>
                      <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                        Satria Bertugas
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-mono-code text-label-sm text-text-muted font-bold">
                      ID: #STR-88219
                    </span>
                  </div>
                  <div className="flex items-center gap-space-md">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md bg-surface-container">
                        <img
                          alt="Satria Agus Prasetyo"
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida/AEtjO1Vctw_qF3mxbNifTxAQVSYGcMaAS2QsLK2Wh7MB4rOrJEAHAb6xB6uINRAQaVEFS-ewv3IIdVOqiAIzTK6HxVUhLEkcrAQiOF4nkcbgzeTMlXu0GOxudbl2cCd7X5ErCpfJh6TrgVY37lqI5R3vDE_4NxNkI53ZiNhy39RMi5DsIuypNAQ0fxsIVKw5ig48hfwvZwRIwiFEcM_5nkfaZtbseG-4rkjeSS40rrWiOVPsWO-RU_1MGe6dlZy5"
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
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success-surface text-tertiary font-label-sm text-label-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-success-base animate-pulse"></span>
                    <span className="">
                      Sedang bertugas aktif di rute pengantaran
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-space-sm pt-space-xs sm:grid-cols-2">
                    <a
                      className="h-11 px-space-sm rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high active:scale-[0.98] font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm border border-border-subtle/50"
                      href="tel:+6281119603333"
                    >
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                        call
                      </span>
                      <span className="">Hubungi</span>
                    </a>
                    <a
                      className="h-11 px-space-sm rounded-xl bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
                      href="https://wa.me/6281119603333?text=Halo%20Satria%20Agus"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        chat
                      </span>
                      <span className="">Pesan Kilat</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
