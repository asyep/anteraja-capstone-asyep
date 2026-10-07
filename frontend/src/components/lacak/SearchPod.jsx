import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRouteForResi } from "../../data/shipmentsData";
import Toast from "../common/Toast";

/**
 * Salin teks ke clipboard dengan fallback untuk konteks non-HTTPS.
 */
async function salinKeClipboard(teks) {
  if (!teks) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(teks);
      return true;
    }
  } catch {
    /* lanjut ke fallback */
  }

  try {
    const area = document.createElement("textarea");
    area.value = teks;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const berhasil = document.execCommand("copy");
    document.body.removeChild(area);
    return berhasil;
  } catch {
    return false;
  }
}

/**
 * Hero + kontrol pencarian halaman Lacak Kiriman.
 * Tampilan mengikuti desain referensi: satu input resi dengan ikon QR,
 * tombol Salin di dalam input, dan tombol "Lacak Paket" gradien magenta.
 */
export default function SearchPod() {
  const navigate = useNavigate();
  const [resi, setResi] = useState("");
  const [toast, setToast] = useState("");

  function lacak(nilai) {
    const bersih = String(nilai ?? "").trim();

    if (!bersih) {
      setToast("Silakan masukkan nomor resi pengiriman terlebih dahulu.");
      return;
    }

    navigate(getRouteForResi(bersih));
  }

  function handleSubmit(event) {
    event.preventDefault();
    lacak(resi);
  }

  async function handleSalin() {
    const berhasil = await salinKeClipboard(resi);
    setToast(
      berhasil
        ? "Nomor resi berhasil disalin!"
        : "Nomor resi belum bisa disalin otomatis.",
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-8 pt-6 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-1.5 text-[12px] font-bold uppercase leading-4 tracking-wider text-[#ec008c]">
        <span className="material-symbols-outlined text-[16px]">
          auto_awesome
        </span>
        AI-Powered Tracking Diagnostics
      </div>

      <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
        Lacak Pengiriman Smart AI
      </h1>
      <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg md:leading-7">
        Pantau status paket real-time dengan asisten pintar Satria AI, akurasi
        rute dinamis, dan jaminan estimasi waktu terpercaya.
      </p>

      <form
        className="mx-auto mb-5 max-w-3xl rounded-2xl border border-pink-100/80 bg-white p-3 text-left shadow-lg transition-all hover:shadow-xl md:p-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center gap-3 md:flex-row">
          <div className="relative flex w-full flex-1 items-center rounded-xl border border-gray-200/80 bg-gray-50/90 px-4 py-3.5 transition-all focus-within:border-[#ec008c] focus-within:bg-white focus-within:shadow-sm">
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
              onClick={handleSalin}
              title="Salin Resi"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                content_copy
              </span>
              <span className="hidden sm:inline">Salin</span>
            </button>
          </div>
          <button
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ec008c] to-[#c00067] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-[0.98] md:w-auto md:text-base"
            type="submit"
          >
            <span className="material-symbols-outlined text-[20px]">
              search
            </span>
            Lacak Paket
          </button>
        </div>
      </form>

      <Toast message={toast} onClose={() => setToast("")} open={Boolean(toast)} />
    </div>
  );
}
