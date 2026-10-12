/**
 * =============================================================================
 * NotFoundPage.jsx - Halaman Resi Tidak Ditemukan & Penanganan Kendala (404)
 * =============================================================================
 * Menampilkan pesan edukatif dan terstruktur saat nomor resi tidak terdaftar:
 * 1. TrackingSearchBar terpadu (konsisten dengan seluruh halaman status lainnya).
 * 2. Alert Banner Status Error (404 / Belum Tercatat) dengan gradien presisi.
 * 3. Satria Assistant Narrative Card (menggunakan komponen standar AssistantNarrative
 *    dengan avatar resmi, AI badge, live feedback, dan aksi cepat).
 * 4. Analisis Diagnostik Otomatis & Panduan Penanganan Praktis.
 * 5. Ciri-ciri Resi Resmi & Pusat Bantuan Terverifikasi 24 Jam.
 * =============================================================================
 */

import React from "react";
import { useSearchParams } from "react-router-dom";
import { cleanResiInput } from "../data/shipmentsData";
import TrackingSearchBar from "../components/tracking/TrackingSearchBar";
import AssistantNarrative from "../components/tracking/AssistantNarrative";

export default function NotFoundPage() {
  const [searchParams] = useSearchParams();
  const waybillParam = cleanResiInput(searchParams.get("waybill_number")) || "22222222222222";

  const handleKoreksiResi = () => {
    const input = document.getElementById("resi-input");
    if (input) {
      input.focus();
      input.select();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const notFoundAssistant = {
    name: "Satria Assistant",
    courierName: "Duta Layanan Pelanggan",
    courierId: "SAT-8821-IDN",
    avatar: "/profil-assistant.svg",
    message:
      "Halo Kak! Mohon maaf, nomor resi ini belum terbaca di sistem pelacakan Anteraja. Jangan khawatir, hal ini umumnya terjadi jika pihak merchant/pengirim baru saja mencetak label pengiriman dan paket fisik belum diserahterimakan ke gerai fisik Satria kami, atau terdapat kekeliruan pengetikan karakter resi.",
    whatsapp: `https://wa.me/6281119603333?text=Halo%20Satria%2C%20saya%20ingin%20cek%20resi%20${waybillParam}`,
    protocol: "Protokol Satria Sigap & Aman",
    aiBadge: true,
  };

  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface relative">
      <div className="flex w-full flex-col">
        <section className="relative mx-auto w-full max-w-[1200px] px-margin py-space-lg md:px-margin-tablet lg:px-margin-desktop">
          {/* Judul halaman & Diagnostic Badge */}
          <div className="mb-space-xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
            <div className="flex flex-col gap-space-xs">
              <div className="inline-flex w-fit items-center gap-space-xs rounded-full bg-ai-surface px-3 py-1 shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-ai-accent">
                  auto_awesome
                </span>
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-wide text-ai-accent">
                  AI-Powered Tracking Diagnostics
                </span>
              </div>
              <h1 className="font-headline-xl text-[28px] font-extrabold leading-9 tracking-tight text-on-surface sm:text-headline-xl sm:leading-[44px]">
                Lacak Pengiriman Smart AI
              </h1>
              <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
                Pantau status paket real-time dengan asisten pintar Satria AI, akurasi rute dinamis, dan jaminan estimasi waktu terpercaya.
              </p>
            </div>
          </div>

          {/* Kolom pencarian resi terpadu (sama dengan semua state) */}
          <TrackingSearchBar initialWaybill={waybillParam} />

          <div className="flex w-full flex-col gap-space-lg">
            {/* Status Alert Banner (Error / Belum Tercatat) dengan style setara StatusBanner */}
            <div className="relative flex w-full flex-col items-start justify-between gap-space-md overflow-hidden rounded-2xl border border-red-800/40 bg-gradient-to-r from-red-950 via-rose-950 to-red-950 p-space-md md:p-space-lg text-white shadow-xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

              <div className="relative z-10 flex w-full flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-inner backdrop-blur-md">
                      <span className="material-symbols-outlined text-[26px] font-bold text-red-200">
                        error
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 font-label-sm text-label-sm font-extrabold uppercase tracking-wider text-red-200">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                        Status Resi: Tidak Terdaftar / Belum Ditemukan
                      </span>
                      <span className="font-headline-sm text-lg md:text-xl font-bold tracking-tight text-white">
                        Nomor Resi {waybillParam} Belum Tercatat
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 font-label-md text-xs font-semibold text-white/90 backdrop-blur-sm shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                      Sinkronisasi Server: 2 menit lalu
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 font-mono-code text-xs font-extrabold text-white shadow-sm">
                      Error 404
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-3 py-1 font-label-md text-xs font-medium text-white/90">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      Cek Berkala 1x24 Jam
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1 border-t border-white/10">
                  <p className="max-w-3xl font-body-sm text-sm text-white/80 leading-relaxed">
                    Sistem database AI kami telah memeriksa jaringan Hub & Staging Store nasional, namun riwayat pemindaian barcode fisik belum ditemukan.
                  </p>
                  <button
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-space-md py-2.5 font-label-lg text-sm font-bold text-red-950 shadow-md transition-all hover:bg-white/90 active:scale-[0.98]"
                    onClick={handleKoreksiResi}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    <span>Koreksi Resi</span>
                  </button>
                </div>
              </div>
            </div>

            {/* MAIN TWO-COLUMN CONTENT GRID */}
            <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12 items-start">
              {/* Kolom Kiri (8) */}
              <div className="flex flex-col gap-space-lg lg:col-span-8">
                {/* CARD 1: Satria Assistant (100% Menggunakan Komponen AssistantNarrative Standar) */}
                <AssistantNarrative
                  assistant={notFoundAssistant}
                  statusLabel="Resi Belum Tercatat"
                  waybill={waybillParam}
                  secondaryAction={{
                    label: "Cek Ulang Digit Resi",
                    icon: "replay",
                    onClick: handleKoreksiResi,
                  }}
                  tertiaryAction={{
                    label: "Laporkan Kendala",
                    icon: "flag",
                    onClick: () =>
                      alert(
                        "Laporan kendala resi telah diteruskan ke Customer Care Satria Anteraja. Tim kami akan mengecek dalam 15 menit."
                      ),
                  }}
                />

                {/* CARD 2: Kemungkinan Mengapa Resi Belum Ditemukan */}
                <article className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-warning-base" />
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        Kemungkinan Mengapa Resi Belum Ditemukan
                      </h3>
                    </div>
                    <span className="font-label-sm text-label-sm text-text-muted">
                      Analisis Diagnostik Otomatis
                    </span>
                  </div>
                  <p className="-mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    Berdasarkan pola logistik Anteraja, 98% kasus resi tidak tercatat disebabkan oleh 3 faktor di bawah ini:
                  </p>
                  <div className="grid grid-cols-1 gap-space-md pt-space-xs md:grid-cols-3">
                    {/* Cause 1 */}
                    <div className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-low p-space-md transition-shadow hover:shadow-md">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                        <span className="material-symbols-outlined text-[22px]">label_important</span>
                      </div>
                      <h4 className="font-headline-sm text-[16px] font-bold leading-snug text-on-surface">
                        Label Baru Dibuat
                      </h4>
                      <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                        Seller di marketplace atau pengirim baru memproses booking dan nomor resi terbit, namun barang belum diserahkan ke kurir.
                      </p>
                      <div className="mt-auto pt-space-xs">
                        <span className="flex items-center gap-1 font-label-sm text-label-sm font-bold text-primary">
                          <span className="material-symbols-outlined text-[14px]">schedule</span> Estimasi scan: 3-6 jam
                        </span>
                      </div>
                    </div>
                    {/* Cause 2 */}
                    <div className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-low p-space-md transition-shadow hover:shadow-md">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-fixed text-secondary">
                        <span className="material-symbols-outlined text-[22px]">two_wheeler</span>
                      </div>
                      <h4 className="font-headline-sm text-[16px] font-bold leading-snug text-on-surface">
                        Proses Penjemputan
                      </h4>
                      <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                        Satria kurir sedang dalam rute perjalanan penjemputan fisik barang di lokasi penjual (first-mile route) sebelum barcode di-scan di Hub.
                      </p>
                      <div className="mt-auto pt-space-xs">
                        <span className="flex items-center gap-1 font-label-sm text-label-sm font-bold text-secondary">
                          <span className="material-symbols-outlined text-[14px]">local_shipping</span> First-Mile Hub Transit
                        </span>
                      </div>
                    </div>
                    {/* Cause 3 */}
                    <div className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-low p-space-md transition-shadow hover:shadow-md">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error-container text-error">
                        <span className="material-symbols-outlined text-[22px]">spellcheck</span>
                      </div>
                      <h4 className="font-headline-sm text-[16px] font-bold leading-snug text-on-surface">
                        Kesalahan Input / Typo
                      </h4>
                      <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                        Terdapat spasi ekstra, kelebihan digit angka, atau tidak sengaja menyalin nomor pesanan e-commerce sebagai nomor resi.
                      </p>
                      <div className="mt-auto pt-space-xs">
                        <span className="flex items-center gap-1 font-label-sm text-label-sm font-bold text-error">
                          <span className="material-symbols-outlined text-[14px]">warning</span> Cek digit kembali
                        </span>
                      </div>
                    </div>
                  </div>
                </article>

                {/* CARD 3: Panduan Langkah Penanganan Praktis */}
                <article className="flex w-full flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[24px] text-primary">task_alt</span>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Panduan Langkah Penanganan Praktis
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
                    {/* Step 1 */}
                    <div className="flex items-start gap-space-md rounded-2xl bg-surface-container-low p-space-md">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container font-mono-code font-extrabold text-on-primary-container">
                        1
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
                          Periksa kembali nomor resi
                        </h4>
                        <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                          Pastikan nomor resi terdiri dari awalan <span className="font-mono-code font-bold text-on-surface">1000</span> atau <span className="font-mono-code font-bold text-on-surface">1001</span> dengan panjang 12 hingga 24 digit angka murni.
                        </p>
                      </div>
                    </div>
                    {/* Step 2 */}
                    <div className="flex items-start gap-space-md rounded-2xl bg-surface-container-low p-space-md">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container font-mono-code font-extrabold text-on-primary-container">
                        2
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
                          Tunggu dan cek berkala
                        </h4>
                        <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                          Jika pesanan baru dibuat hari ini, beri jeda beberapa jam hingga kurir Satria kami menyelesaikan scan fisik awal di staging store terdekat.
                        </p>
                      </div>
                    </div>
                    {/* Step 3 */}
                    <div className="flex items-start gap-space-md rounded-2xl bg-surface-container-low p-space-md">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container font-mono-code font-extrabold text-on-primary-container">
                        3
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
                          Konfirmasi ke pihak penjual
                        </h4>
                        <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                          Tanyakan apakah paket sudah benar-benar diserahkan ke gerai Anteraja atau baru diproses secara administratif di aplikasi marketplace.
                        </p>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Bottom Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-space-md rounded-2xl bg-surface-container-low p-space-md shadow-sm">
                  <div className="flex items-center gap-space-sm">
                    <button
                      className="flex items-center gap-2 rounded-xl bg-surface-container-lowest px-space-md py-2 font-label-lg text-label-lg text-on-surface shadow-sm transition-all hover:bg-surface-container"
                      onClick={() => window.location.reload()}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">sync</span>
                      <span>Muat Ulang Halaman</span>
                    </button>
                    <button
                      className="flex items-center gap-2 rounded-xl bg-surface-container-highest px-space-md py-2 font-label-lg text-label-lg text-on-surface transition-all hover:bg-primary-fixed hover:text-primary"
                      onClick={handleKoreksiResi}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">search</span>
                      <span>Lacak Resi Lain</span>
                    </button>
                  </div>
                  <span className="font-mono-code text-label-sm text-text-muted">
                    Kode Status: <strong className="text-error">ERR_MANIFEST_NOT_INITIALIZED</strong>
                  </span>
                </div>
              </div>

              {/* Kolom Kanan (4) */}
              <div className="flex flex-col gap-space-lg lg:col-span-4">
                {/* CARD 1: Ciri-Ciri Resi Resmi Anteraja */}
                <article className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[22px] text-primary">policy</span>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Ciri Resi Resmi Anteraja
                    </h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Gunakan panduan berikut untuk memastikan format resi yang Anda terima adalah sah:
                  </p>
                  <div className="flex flex-col gap-space-sm">
                    {/* Item 1 */}
                    <div className="flex items-start gap-3 rounded-xl bg-surface-container-low p-3">
                      <span className="material-symbols-outlined text-[20px] text-success-base shrink-0">check_circle</span>
                      <div className="flex flex-col">
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">Awalan Angka Standar</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Selalu diawali kode angka <strong>1000</strong> atau <strong>1001</strong>.</span>
                      </div>
                    </div>
                    {/* Item 2 */}
                    <div className="flex items-start gap-3 rounded-xl bg-surface-container-low p-3">
                      <span className="material-symbols-outlined text-[20px] text-success-base shrink-0">check_circle</span>
                      <div className="flex flex-col">
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">Panjang Digit Konsisten</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Memiliki 12 hingga 24 karakter numerik tanpa huruf abjad.</span>
                      </div>
                    </div>
                    {/* Item 3 */}
                    <div className="flex items-start gap-3 rounded-xl bg-error-surface p-3">
                      <span className="material-symbols-outlined text-[20px] text-error shrink-0">cancel</span>
                      <div className="flex flex-col">
                        <span className="font-label-lg text-label-lg font-bold text-error">Bukan Nomor Invoice</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Bukan format nomor pesanan marketplace seperti <em>INV/2024/...</em>.</span>
                      </div>
                    </div>
                  </div>
                </article>

                {/* CARD 2: Pusat Bantuan Satria 24 Jam */}
                <article className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[22px] text-primary">support_agent</span>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        Pusat Bantuan Satria
                      </h3>
                    </div>
                    <span className="rounded-full bg-success-surface px-2 py-0.5 font-label-sm text-label-sm font-bold text-success-base">
                      Siap 24 Jam
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Jika resi Anda belum tercatat setelah lebih dari 24 jam sejak pengiriman, segera hubungi kanal resmi kami:
                  </p>
                  <div className="flex flex-col gap-2">
                    {/* Contact Row 1 */}
                    <a className="flex items-center justify-between rounded-xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container" href="tel:02150663333">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px] text-primary">call</span>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-text-muted">Call Center Resmi</span>
                          <span className="font-mono-code text-mono-code font-bold text-on-surface">021 - 5066 - 3333</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_forward</span>
                    </a>
                    {/* Contact Row 2 */}
                    <a className="flex items-center justify-between rounded-xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container" href="https://wa.me/6281119603333" rel="noopener noreferrer" target="_blank">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px] text-secondary">chat</span>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-text-muted">WhatsApp Satria Care</span>
                          <span className="font-mono-code text-mono-code font-bold text-on-surface">0811 - 1960 - 3333</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_forward</span>
                    </a>
                    {/* Contact Row 3 */}
                    <a className="flex items-center justify-between rounded-xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container" href="mailto:cs@anteraja.id">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px] text-primary">mail</span>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-text-muted">Customer Service Email</span>
                          <span className="font-body-md text-body-md font-bold text-on-surface">cs@anteraja.id</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_forward</span>
                    </a>
                  </div>
                  {/* Bottom Action CTAs */}
                  <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                    <a className="flex items-center justify-center gap-1.5 rounded-xl bg-primary-container px-space-md py-2.5 text-center font-label-lg text-label-lg text-on-primary-container shadow transition-colors hover:bg-primary" href="tel:02150663333">
                      <span className="material-symbols-outlined text-[18px]">call</span>
                      <span>Hubungi CS</span>
                    </a>
                    <a className="flex items-center justify-center gap-1.5 rounded-xl bg-secondary-container px-space-md py-2.5 text-center font-label-lg text-label-lg text-on-secondary-container shadow transition-colors hover:bg-secondary-fixed" href="https://wa.me/6281119603333" rel="noopener noreferrer" target="_blank">
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      <span>Bantuan WA</span>
                    </a>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
