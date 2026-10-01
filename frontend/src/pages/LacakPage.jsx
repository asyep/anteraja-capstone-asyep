import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRouteForResi } from "../data/shipmentsData";

export default function LacakPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("single");
  const [singleAwb, setSingleAwb] = useState("");
  const [multiAwbText, setMultiAwbText] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  function switchTrackingMode(mode) {
    setActiveTab(mode);
  }
  function handleSingleSubmit(event) {
    event.preventDefault();
    if (singleAwb.trim()) navigate(getRouteForResi(singleAwb.trim()));
  }
  function handleMultiSubmit() {
    const firstAwb = multiAwbText
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .find(Boolean);
    if (firstAwb) navigate(getRouteForResi(firstAwb));
  }
  function clearInput() {
    setSingleAwb("");
  }
  async function pasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setSingleAwb(text.trim());
    } catch {
      setSingleAwb("1000849201994");
    }
  }
  function insertSampleBatch() {
    setMultiAwbText("1000849201994\n1000921477821\n1000781293812");
  }
  function simulateScanSuccess() {
    setScannerOpen(false);
    navigate("/tracking-normal?waybill_number=1000849201994");
  }
  return (
    <main className="w-full bg-surface min-h-[calc(100vh-20rem)]">
      <div className="flex flex-col w-full">
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-gradient-to-r from-primary/10 via-secondary-container/15 to-ai-accent/10 blur-3xl pointer-events-none rounded-full"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="max-w-[1200px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop pt-8 pb-16 relative z-10">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md mb-6">
              <a
                className="hover:text-primary transition-colors flex items-center gap-1"
                href="/"
              >
                <span className="material-symbols-outlined text-[16px]">
                  home
                </span>
                Beranda
              </a>
              <span className="text-text-placeholder">/</span>
              <span className="text-primary font-bold">
                Lacak Kiriman Real-Time
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 ml-3 px-2 py-0.5 rounded-full bg-ai-surface text-ai-accent font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-[14px]">
                  auto_awesome
                </span>
                Satria AI Telemetry 4.2
              </span>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-6 md:p-10 mb-12 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning-surface text-secondary font-label-sm text-label-sm font-bold mb-3">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      speed
                    </span>
                    Pelacakan Instan Satria Multi-Armada
                  </span>
                  <h1 className="font-headline-xl text-[28px] leading-9 text-on-surface mb-3 tracking-tight font-extrabold sm:text-headline-xl sm:leading-[44px]">
                    Lacak Kiriman Satria AI Lebih Cepat & Akurat
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Pantau posisi paket, estimasi kedatangan dinamis bertenaga
                    telemetri AI, dan terhubung langsung dengan Satria pengantar
                    di seluruh Indonesia.
                  </p>
                </div>
                <div className="flex items-center bg-surface-container-low p-1 rounded-full self-start lg:self-auto shadow-sm">
                  <button
                    id="tab-single"
                    className={`px-5 py-2 rounded-full font-label-md text-label-md transition-all flex items-center gap-1.5 ${activeTab === "single" ? "font-bold bg-surface-container-lowest text-on-surface shadow-sm" : "font-semibold text-on-surface-variant hover:text-on-surface"}`}
                    type="button"
                    onClick={() => switchTrackingMode("single")}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      pin_drop
                    </span>
                    Lacak Satuan
                  </button>
                  <button
                    id="tab-multi"
                    className={`px-5 py-2 rounded-full font-label-md text-label-md transition-all flex items-center gap-1.5 ${activeTab === "multi" ? "font-bold bg-surface-container-lowest text-on-surface shadow-sm" : "font-semibold text-on-surface-variant hover:text-on-surface"}`}
                    type="button"
                    onClick={() => switchTrackingMode("multi")}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      stacks
                    </span>
                    Lacak Massal (Multi-AWB)
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div
                  id="panel-single"
                  className={activeTab === "single" ? "block" : "hidden"}
                >
                  <form
                    id="tracking-form"
                    className="flex flex-col gap-3"
                    onSubmit={handleSingleSubmit}
                  >
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-1 flex items-center h-14 pl-4 pr-2 rounded-xl bg-surface-card shadow-inner focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary transition-all">
                        <span className="material-symbols-outlined text-text-placeholder text-[22px] pointer-events-none">
                          tag
                        </span>
                        <input
                          id="single-awb-input"
                          name="waybill_number"
                          type="text"
                          inputMode="text"
                          minLength="13"
                          maxLength="32"
                          pattern="(?:[0-9]{13,14}|[A-Za-z0-9]{32})"
                          title="Masukkan resi 13–14 digit atau kode alfanumerik 32 karakter."
                          autoComplete="off"
                          className="w-full h-full px-3 bg-transparent font-mono-code text-mono-code text-on-surface placeholder:text-text-placeholder focus:outline-none tracking-wide"
                          placeholder="Masukkan nomor resi Anteraja (contoh: 1000849201994)"
                          required
                          value={singleAwb}
                          onChange={(event) => setSingleAwb(event.target.value)}
                        />
                        <button
                          type="button"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-primary transition-colors"
                          title="Bersihkan"
                          onClick={clearInput}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            close
                          </span>
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="h-14 px-8 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-lg hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 shrink-0"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          search
                        </span>
                        <span>Lacak Paket</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 px-1 pt-1">
                      <button
                        type="button"
                        className="min-h-9 px-3.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm transition-all flex items-center gap-1.5 shadow-sm"
                        onClick={pasteClipboard}
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          content_paste
                        </span>
                        <span>Tempel dari Clipboard</span>
                      </button>
                      <button
                        type="button"
                        className="min-h-9 px-3.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm transition-all flex items-center gap-1.5 shadow-sm"
                        onClick={() => setScannerOpen(true)}
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          qr_code_scanner
                        </span>
                        <span>Scan Barcode</span>
                      </button>
                    </div>
                  </form>
                </div>
                <div
                  id="panel-multi"
                  className={activeTab === "multi" ? "block" : "hidden"}
                >
                  <div className="flex flex-col gap-3 p-4 bg-surface-subtle rounded-xl focus-within:bg-surface-container-lowest focus-within:shadow-md transition-all">
                    <div className="flex items-center justify-between px-1 font-label-sm text-label-sm text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          info
                        </span>
                        Masukkan hingga 10 nomor resi (pisahkan dengan koma atau
                        baris baru)
                      </span>
                      <span id="awb-counter" className="font-bold text-primary">
                        {Math.min(
                          multiAwbText
                            .split(/[\n,]+/)
                            .filter((value) => value.trim()).length,
                          10,
                        )}
                        /10 Resi
                      </span>
                    </div>
                    <textarea
                      id="multi-awb-input"
                      rows="4"
                      className="w-full bg-transparent p-3 font-mono-code text-mono-code text-on-surface placeholder:text-text-placeholder focus:outline-none resize-none"
                      placeholder="1000849201994
1000921477821
1000781293812"
                      value={multiAwbText}
                      onChange={(event) => setMultiAwbText(event.target.value)}
                    ></textarea>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2 self-start">
                        <button
                          type="button"
                          className="h-9 px-3.5 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1"
                          onClick={insertSampleBatch}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            bolt
                          </span>
                          <span>Isi Contoh Batch Demo</span>
                        </button>
                        <button
                          type="button"
                          className="h-9 px-3.5 rounded-full hover:bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm transition-colors"
                          onClick={() => setMultiAwbText("")}
                        >
                          <span>Bersihkan</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        onClick={handleMultiSubmit}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          manage_search
                        </span>
                        <span>Lacak Sekaligus</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 bg-surface-container-low/50 -mx-6 -mb-6 md:-mx-10 md:-mb-10 p-6 md:p-8 rounded-b-2xl flex flex-col gap-3">
                <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface font-bold">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    history
                  </span>
                  <span>Pilih Resi Demo Prototype Terintegrasi:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="/tracking-normal?waybill_number=1000849201994"
                    className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-lowest hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-mono-code text-label-sm shadow-sm transition-all border border-border-subtle"
                  >
                    <span className="w-2 h-2 rounded-full bg-success-base"></span>
                    <span className="font-bold">#1000849201994</span>
                    <span className="px-2 py-0.5 rounded-full bg-success-surface text-tertiary font-label-sm text-[10px] font-bold">
                      Dalam Pengantaran
                    </span>
                  </a>
                  <a
                    href="/tracking-live?waybill_number=1000921477821"
                    className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-lowest hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-mono-code text-label-sm shadow-sm transition-all border border-border-subtle"
                  >
                    <span className="w-2 h-2 rounded-full bg-success-base animate-pulse"></span>
                    <span className="font-bold">#1000921477821</span>
                    <span className="px-2 py-0.5 rounded-full bg-ai-surface text-ai-accent font-label-sm text-[10px] font-bold">
                      Live GPS Telemetry
                    </span>
                  </a>
                  <a
                    href="/tracking?waybill_number=1000781293812"
                    className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-lowest hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-mono-code text-label-sm shadow-sm transition-all border border-border-subtle"
                  >
                    <span className="w-2 h-2 rounded-full bg-warning-base"></span>
                    <span className="font-bold">#1000781293812</span>
                    <span className="px-2 py-0.5 rounded-full bg-warning-surface text-secondary font-label-sm text-[10px] font-bold">
                      Peringatan Jalur
                    </span>
                  </a>
                  <a
                    href="/delivered?waybill_number=11111111111111"
                    className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-lowest hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-mono-code text-label-sm shadow-sm transition-all border border-border-subtle"
                  >
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    <span className="font-bold">#11111111111111</span>
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-bold">
                      Telah Diterima
                    </span>
                  </a>
                  <a
                    href="/canceled?waybill_number=22222222222222"
                    className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-lowest hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-mono-code text-label-sm shadow-sm transition-all border border-border-subtle"
                  >
                    <span className="w-2 h-2 rounded-full bg-error-base"></span>
                    <span className="font-bold">#22222222222222</span>
                    <span className="px-2 py-0.5 rounded-full bg-error-surface text-error font-label-sm text-[10px] font-bold">
                      Dibatalkan
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16 items-center bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container-low p-6 md:p-8 rounded-2xl shadow-sm border border-border-subtle">
              <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-[36px]">
                    radar
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Jaringan Satria AI Telemetry Aktif
                    </span>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-base opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success-base"></span>
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Lebih dari 45.000 armada Satria terhubung real-time dengan
                    pemantauan algoritma rute dinamis, menjamin kepastian status
                    pengiriman tanpa tebak-tebakan.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-6 bg-surface-container-lowest/80 p-4 rounded-xl shadow-sm border border-border-subtle">
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md text-primary font-extrabold">
                    99.2%
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Ketepatan Waktu
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-surface-container-high"></div>
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md text-secondary font-extrabold">
                    {"<"} 15 dtk
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Sinkronisasi GPS
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-16">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                  Kecerdasan Logistik
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-extrabold">
                  Fitur Pelacakan Pintar Generasi Baru
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Dirancang khusus untuk menghapus kekhawatiran paket Anda
                  melalui integrasi teknologi GPS armada dan kecerdasan buatan.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-border-subtle">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-warning-surface flex items-center justify-center text-secondary mb-4 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">
                        explore
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                      Radar Telemetri Satria Live GPS
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Pantau koordinat riil kurir Satria saat pengantaran menuju
                      alamat tujuan dengan estimasi sisa jarak presisi per 100
                      meter.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 flex items-center text-primary font-label-md text-label-md font-bold gap-1">
                    <span>Presisi GPS Armada</span>
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-border-subtle">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-ai-surface flex items-center justify-center text-ai-accent mb-4 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">
                        smart_toy
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                      Satria AI Assistant & Updates
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Status manifest teknis seperti 'Sortation Hub Transit'
                      diterjemahkan ke bahasa yang ramah, santun, dan mudah
                      dicerna secara manusiawi.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 flex items-center text-ai-accent font-label-md text-label-md font-bold gap-1">
                    <span>Natural Language Status</span>
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-border-subtle">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">
                        schedule
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                      Estimasi Kedatangan Dinamis (ETA)
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Didukung prediksi kecerdasan buatan dengan akurasi 98.4%
                      yang terus beradaptasi terhadap kepadatan lalu lintas dan
                      cuaca terkini.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 flex items-center text-primary font-label-md text-label-md font-bold gap-1">
                    <span>Algoritma Cuaca & Rute</span>
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-border-subtle">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-success-surface flex items-center justify-center text-tertiary mb-4 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">
                        chat
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                      Notifikasi Otomatis WhatsApp
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Dapatkan pembaruan langsung di ponsel Anda begitu paket
                      tiba di titik transit terdekat atau saat kurir bergerak
                      menuju pintu rumah.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 flex items-center text-tertiary font-label-md text-label-md font-bold gap-1">
                    <span>Siaga 24 Jam Bebas Pulsa</span>
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-16 bg-surface-container-low rounded-2xl p-8 md:p-12 relative overflow-hidden border border-border-subtle">
              <div className="max-w-xl mb-10">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Panduan Kilat
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-extrabold">
                  Cara Mudah Melacak Paket
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Hanya butuh tiga langkah simpel untuk mengetahui keberadaan
                  barang Anda sampai ke tangan penerima.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-headline-xl text-headline-xl font-extrabold text-primary/20">
                      01
                    </span>
                    <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">
                        pin
                      </span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                    Masukkan Nomor Resi
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Salin nomor resi (AWB) dari aplikasi e-commerce Anda, resi
                    fisik, atau SMS notifikasi pengiriman pesanan.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-headline-xl text-headline-xl font-extrabold text-secondary/20">
                      02
                    </span>
                    <div className="w-10 h-10 rounded-full bg-warning-surface text-secondary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">
                        cognition
                      </span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                    Analisis Telemetri Satria AI
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Sistem secara instan menganalisis manifest gudang,
                    memvalidasi rute aktif, dan mengunci posisi mutakhir paket.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-headline-xl text-headline-xl font-extrabold text-tertiary/20">
                      03
                    </span>
                    <div className="w-10 h-10 rounded-full bg-success-surface text-tertiary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">
                        person_pin_circle
                      </span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                    Pantau Rute & Hubungi Kurir
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Lihat jam tiba dinamis dan lakukan panggilan langsung atau
                    WhatsApp dengan Satria saat paket berstatus 'Out for
                    Delivery'.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              <div className="lg:col-span-5 bg-gradient-to-br from-primary to-primary-container text-on-primary p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <span className="px-3 py-1 rounded-full bg-on-primary/10 text-on-primary font-label-sm text-label-sm uppercase font-bold inline-block mb-4">
                    Bantuan Langsung
                  </span>
                  <h3 className="font-headline-lg text-headline-lg text-on-primary mb-3 font-extrabold">
                    Butuh Bantuan Pelacakan Khusus?
                  </h3>
                  <p className="font-body-md text-body-md text-on-primary/90 mb-6">
                    Tim Satria Care beroperasi 24 jam sehari untuk membantu
                    kendala nomor resi tidak ditemukan, salah alamat, atau
                    perubahan instruksi pengantaran.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      className="min-h-[44px] px-5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-secondary-fixed-dim transition-all shadow-md"
                      href="https://wa.me/6281119603333"
                      target="_blank"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        chat
                      </span>
                      WhatsApp Satria Care
                    </a>
                    <a
                      className="min-h-[44px] px-5 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-surface-subtle transition-all"
                      href="/bantuan"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        help
                      </span>
                      Pusat Bantuan
                    </a>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
                  Pertanyaan Populer Seputar Resi
                </h3>
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm p-4 cursor-pointer border border-border-subtle">
                  <summary className="flex items-center justify-between font-label-lg text-label-lg font-bold text-on-surface list-none">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        help
                      </span>
                      Resi belum terupdate atau masih 'Manifest Created' dalam
                      24 jam?
                    </span>
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-on-surface-variant">
                      expand_more
                    </span>
                  </summary>
                  <div className="mt-3 text-on-surface-variant font-body-sm text-body-sm leading-relaxed pl-7">
                    Hal ini umum terjadi jika paket baru diserahkan oleh
                    penjual/merchant dan sedang dalam antrean pemindaian di Hub
                    Pertama Anteraja. Status akan otomatis aktif begitu paket
                    melewati pemindai conveyor kami.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm p-4 cursor-pointer border border-border-subtle">
                  <summary className="flex items-center justify-between font-label-lg text-label-lg font-bold text-on-surface list-none">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        help
                      </span>
                      Bagaimana jika kurir belum tiba melewati jam estimasi
                      kedatangan?
                    </span>
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-on-surface-variant">
                      expand_more
                    </span>
                  </summary>
                  <div className="mt-3 text-on-surface-variant font-body-sm text-body-sm leading-relaxed pl-7">
                    Satria kami mungkin menghadapi kendala cuaca ekstrem atau
                    lonjakan rute. Anda dapat mengklik tombol "Hubungi Satria"
                    yang muncul pada rincian resi untuk menanyakan perkiraan
                    tiba langsung ke nomor kurir aktif.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm p-4 cursor-pointer border border-border-subtle">
                  <summary className="flex items-center justify-between font-label-lg text-label-lg font-bold text-on-surface list-none">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        help
                      </span>
                      Apakah bisa mengubah alamat pengantaran saat paket sudah
                      jalan?
                    </span>
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-on-surface-variant">
                      expand_more
                    </span>
                  </summary>
                  <div className="mt-3 text-on-surface-variant font-body-sm text-body-sm leading-relaxed pl-7">
                    Perubahan alamat dapat diajukan selama paket belum berstatus
                    'Satria Mengantar'. Silakan hubungi CS Satria WhatsApp kami
                    dengan melampirkan foto KTP dan bukti transaksi resmi.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="scanner-modal"
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm ${scannerOpen ? "flex" : "hidden"} items-center justify-center p-4`}
      >
        <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-border-subtle">
          <button
            className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
            onClick={() => setScannerOpen(false)}
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]">
                qr_code_scanner
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
              Pindai Resi Paket
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
              Arahkan kamera ke kode QR atau barcode pada label resi pengiriman
              Anteraja.
            </p>
            <div className="w-full h-48 bg-surface-subtle rounded-xl flex flex-col items-center justify-center relative overflow-hidden mb-6 border border-border-subtle">
              <div className="w-40 h-28 border-2 border-primary border-dashed rounded-lg flex items-center justify-center bg-primary/5 relative">
                <span className="material-symbols-outlined text-primary text-[28px] animate-pulse">
                  camera_alt
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-2">
                Mendeteksi barcode...
              </span>
            </div>
            <button
              className="w-full min-h-[44px] rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:bg-primary-container transition-all"
              onClick={simulateScanSuccess}
            >
              Gunakan Resi Contoh (#1000849201994)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
