import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRouteForResi } from "../../data/shipmentsData";

const MAKS_RESI_MASSAL = 10;

/** Chip riwayat pencarian. Masih memakai data contoh prototype. */
const PENCARIAN_TERAKHIR = [
  {
    id: "awb-aktif",
    kode: "1000849201994",
    label: "#1000849201994",
    status: "Aktif",
    dotClassName: "bg-success-base animate-pulse",
    badgeClassName: "bg-success-surface text-tertiary",
  },
  {
    id: "awb-transit",
    kode: "1000781293812",
    label: "#1000781293812",
    status: "Transit",
    dotClassName: "bg-warning-base",
    badgeClassName: "bg-warning-surface text-secondary",
  },
];

function hitungResi(text) {
  return text
    .split(/[\n,]+/)
    .map((baris) => baris.trim())
    .filter(Boolean).length;
}

/**
 * Kontrol pencarian utama halaman Lacak Kiriman.
 * Mode satuan (satu resi) dan mode massal (multi-AWB) berbagi satu pintu masuk
 * supaya arah navigasi hasil pelacakan tetap konsisten lewat getRouteForResi.
 */
export default function SearchPod() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("single");
  const [resi, setResi] = useState("");
  const [resiMassal, setResiMassal] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  const jumlahResi = hitungResi(resiMassal);

  function lacak(waybill) {
    const bersih = String(waybill ?? "").trim();
    if (!bersih) return;
    navigate(getRouteForResi(bersih));
  }

  function handleSingleSubmit(event) {
    event.preventDefault();
    lacak(resi);
  }

  function handleMassalSubmit() {
    const pertama = resiMassal
      .split(/[\n,]+/)
      .map((baris) => baris.trim())
      .find(Boolean);
    if (pertama) lacak(pertama);
  }

  async function tempelDariClipboard() {
    try {
      const teks = await navigator.clipboard.readText();
      if (teks) setResi(teks.trim());
    } catch {
      setResi("1000849201994");
    }
  }

  function salinResi() {
    if (!resi) return;
    navigator.clipboard?.writeText(resi);
  }

  function gunakanContohHasilScan() {
    setScannerOpen(false);
    lacak("10009823471029");
  }

  return (
    <div className="mx-auto max-w-4xl pb-12 pt-6 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ec008c]">
        <span className="material-symbols-outlined text-[16px]">
          auto_awesome
        </span>
        AI-Powered Tracking Diagnostics
      </div>

      <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
        Lacak Pengiriman Smart AI
      </h1>
      <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
        Pantau status paket real-time dengan asisten pintar Satria AI, akurasi
        rute dinamis, dan jaminan estimasi waktu terpercaya.
      </p>

      <div className="mx-auto mb-5 max-w-3xl rounded-2xl border border-pink-100/80 bg-white p-3 text-left shadow-[0_18px_40px_-24px_rgba(236,0,140,0.35)] ring-1 ring-black/[0.03] transition-all hover:shadow-[0_22px_48px_-24px_rgba(236,0,140,0.45)] md:p-4">
        {/* Pemilih mode pelacakan */}
        <div className="mb-3 flex items-center justify-center gap-1 rounded-xl bg-surface-container-low p-1">
          <button
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-label-md text-label-md transition-all ${
              mode === "single"
                ? "bg-white font-bold text-on-surface shadow-sm"
                : "font-semibold text-on-surface-variant hover:text-on-surface"
            }`}
            onClick={() => setMode("single")}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              pin_drop
            </span>
            Lacak Satuan
          </button>
          <button
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-label-md text-label-md transition-all ${
              mode === "massal"
                ? "bg-white font-bold text-on-surface shadow-sm"
                : "font-semibold text-on-surface-variant hover:text-on-surface"
            }`}
            onClick={() => setMode("massal")}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">stacks</span>
            Lacak Massal
          </button>
        </div>

        {mode === "single" ? (
          <form onSubmit={handleSingleSubmit}>
            <div className="flex flex-col items-center gap-3 md:flex-row">
              <div className="flex w-full flex-1 items-center rounded-xl border border-gray-200/80 bg-gray-50/90 px-4 py-3.5 transition-all focus-within:border-[#ec008c] focus-within:bg-white focus-within:shadow-sm">
                <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-[#ec008c]">
                  <span className="material-symbols-outlined text-[18px]">
                    qr_code_2
                  </span>
                </div>
                <input
                  aria-label="Nomor resi atau AWB"
                  autoComplete="off"
                  className="w-full bg-transparent font-mono-code text-mono-code font-medium tracking-wide text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  id="tracking-resi-input"
                  onChange={(event) => setResi(event.target.value)}
                  placeholder="Masukkan Nomor Resi / AWB..."
                  type="text"
                  value={resi}
                />
                <button
                  className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-500 transition-colors hover:bg-pink-50 hover:text-[#ec008c]"
                  onClick={salinResi}
                  title="Salin resi"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    content_copy
                  </span>
                  <span className="hidden sm:inline">Salin</span>
                </button>
              </div>

              <button
                className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ec008c] to-[#c00067] px-8 py-3.5 font-label-lg text-label-lg font-bold text-white shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-[0.98] md:w-auto"
                type="submit"
              >
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
                Lacak Paket
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-surface-container px-3.5 font-label-sm text-label-sm text-on-surface-variant shadow-sm transition-all hover:bg-surface-container-high"
                onClick={tempelDariClipboard}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  content_paste
                </span>
                Tempel dari Clipboard
              </button>
              <button
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-surface-container px-3.5 font-label-sm text-label-sm text-on-surface-variant shadow-sm transition-all hover:bg-surface-container-high"
                onClick={() => setScannerOpen(true)}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  qr_code_scanner
                </span>
                Scan Barcode
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-3 rounded-xl bg-surface-subtle p-4 transition-all focus-within:bg-white focus-within:shadow-md">
            <div className="flex items-center justify-between gap-2 px-1 font-label-sm text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  info
                </span>
                Pisahkan dengan koma atau baris baru
              </span>
              <span
                className={`font-bold ${jumlahResi > MAKS_RESI_MASSAL ? "text-error-base" : "text-primary"}`}
              >
                {Math.min(jumlahResi, MAKS_RESI_MASSAL)}/{MAKS_RESI_MASSAL} Resi
              </span>
            </div>
            <textarea
              aria-label="Daftar nomor resi"
              className="w-full resize-none bg-transparent p-3 font-mono-code text-mono-code text-on-surface placeholder:text-text-placeholder focus:outline-none"
              onChange={(event) => setResiMassal(event.target.value)}
              placeholder={"1000849201994\n1000921477821\n1000781293812"}
              rows="4"
              value={resiMassal}
            />
            <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
              <div className="flex items-center gap-2 self-start">
                <button
                  className="inline-flex min-h-9 items-center gap-1 rounded-full bg-surface-container-low px-3.5 font-label-sm text-label-sm text-on-surface transition-colors hover:bg-surface-container-high"
                  onClick={() =>
                    setResiMassal(
                      "1000849201994\n1000921477821\n1000781293812",
                    )
                  }
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    bolt
                  </span>
                  Isi Contoh Batch
                </button>
                <button
                  className="min-h-9 rounded-full px-3.5 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container-low"
                  onClick={() => setResiMassal("")}
                  type="button"
                >
                  Bersihkan
                </button>
              </div>
              <button
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 font-label-lg text-label-lg font-bold text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-lg active:scale-[0.98] sm:w-auto"
                onClick={handleMassalSubmit}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  manage_search
                </span>
                Lacak Sekaligus
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
        <span className="mr-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          <span className="material-symbols-outlined text-[14px]">history</span>
          Pencarian Terakhir:
        </span>
        {PENCARIAN_TERAKHIR.map((item) => (
          <button
            className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200/90 bg-white px-3 py-1.5 text-gray-700 shadow-sm transition-all hover:border-[#ec008c] hover:text-[#ec008c]"
            key={item.id}
            onClick={() => {
              setMode("single");
              setResi(item.kode);
            }}
            type="button"
          >
            <span className={`h-2 w-2 rounded-full ${item.dotClassName}`} />
            <span className="font-mono-code text-label-sm font-medium">
              {item.label}
            </span>
            <span
              className={`rounded px-1 text-[10px] font-semibold ${item.badgeClassName}`}
            >
              {item.status}
            </span>
          </button>
        ))}
      </div>

      {/* Modal simulasi pemindai barcode */}
      <div
        className={`fixed inset-0 z-50 items-center justify-center bg-black/60 p-4 backdrop-blur-sm ${
          scannerOpen ? "flex" : "hidden"
        }`}
      >
        <div className="relative w-full max-w-md rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-2xl">
          <button
            aria-label="Tutup pemindai"
            className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface"
            onClick={() => setScannerOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <span className="material-symbols-outlined text-[32px]">
                qr_code_scanner
              </span>
            </div>
            <h2 className="mb-1 font-headline-sm text-headline-sm font-bold text-on-surface">
              Pindai Resi Paket
            </h2>
            <p className="mb-6 font-body-sm text-body-sm text-on-surface-variant">
              Arahkan kamera ke kode QR atau barcode pada label resi pengiriman
              Anteraja.
            </p>
            <div className="mb-6 flex h-48 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-surface-subtle">
              <div className="flex h-28 w-40 items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/5">
                <span className="material-symbols-outlined animate-pulse text-[28px] text-primary">
                  camera_alt
                </span>
              </div>
              <span className="mt-2 font-label-sm text-label-sm text-on-surface-variant">
                Mendeteksi barcode...
              </span>
            </div>
            <button
              className="min-h-[44px] w-full rounded-full bg-primary font-label-md text-label-md font-bold text-on-primary shadow-md transition-all hover:bg-primary-container"
              onClick={gunakanContohHasilScan}
              type="button"
            >
              Gunakan Resi Contoh Hasil Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
