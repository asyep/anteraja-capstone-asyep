import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getRouteForResi, cleanResiInput } from "@/data/shipmentsData";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import Toast from "@/components/ui/Toast";

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
  const [maxLimitWarning, setMaxLimitWarning] = useState(false);
  const warningTimerRef = useRef(null);
  const { recentSearches, addSearch } = useRecentSearches();

  const triggerLimitWarning = () => {
    setMaxLimitWarning(true);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => {
      setMaxLimitWarning(false);
    }, 2800);
  };

  function lacak(nilai) {
    const bersih = cleanResiInput(nilai);

    if (!bersih) {
      setToast("Silakan masukkan nomor resi pengiriman terlebih dahulu.");
      return;
    }

    addSearch(bersih);
    window.dispatchEvent(
      new CustomEvent("anteraja_refresh_tracking", {
        detail: { waybill: bersih, timestamp: Date.now() },
      })
    );
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
    <div className="mx-auto max-w-4xl pb-16 pt-6 text-center">
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
          <div className={`relative flex w-full flex-1 items-center rounded-xl border ${
            maxLimitWarning ? "border-rose-500 ring-2 ring-rose-500/20" : "border-gray-200/80 focus-within:border-[#ec008c] focus-within:shadow-sm"
          } bg-gray-50/90 px-4 py-3.5 transition-all focus-within:bg-white`}>
            <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-[#ec008c]">
              <span className="material-symbols-outlined text-[18px]">
                qr_code_2
              </span>
            </div>
            <input
              aria-label="Nomor resi 14 digit Anteraja"
              autoComplete="off"
              className="w-full bg-transparent font-mono-code text-mono-code font-medium tracking-wide text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
              id="tracking-resi-input"
              maxLength={14}
              onKeyDown={(e) => {
                if (
                  resi.length >= 14 &&
                  !e.ctrlKey &&
                  !e.metaKey &&
                  !e.altKey &&
                  e.key.length === 1 &&
                  e.target.selectionStart === e.target.selectionEnd
                ) {
                  triggerLimitWarning();
                } else if (e.key === "Backspace" || e.key === "Delete") {
                  setMaxLimitWarning(false);
                }
              }}
              onChange={(event) => {
                const raw = event.target.value.replace(/\D/g, "");
                if (raw.length > 14) {
                  triggerLimitWarning();
                }
                setResi(raw.slice(0, 14));
              }}
              onPaste={(event) => {
                event.preventDefault();
                const pasted = event.clipboardData.getData("text");
                const digits = pasted.replace(/\D/g, "");
                if (digits.length > 14) {
                  triggerLimitWarning();
                }
                setResi(digits.slice(0, 14));
              }}
              placeholder="Masukkan 14 digit nomor resi (contoh: 10001284277889)"
              type="text"
              value={resi}
            />
            <div className="ml-2 flex items-center gap-1.5 shrink-0">
              {maxLimitWarning ? (
                <span
                  className="flex items-center gap-1 text-[11px] font-sans font-bold px-2 py-0.5 rounded-md border bg-rose-50 text-rose-700 border-rose-300 shadow-xs animate-pulse select-none"
                  role="alert"
                  title="Batas maksimal 14 digit nomor resi telah tercapai"
                >
                  <span className="material-symbols-outlined text-[13px]">warning</span>
                  Maksimal 14 Digit!
                </span>
              ) : (
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border transition-all select-none ${
                    resi.length === 14
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs"
                      : resi.length > 0
                      ? "bg-pink-50 text-[#ec008c] border-pink-200"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                  title="Nomor resi resmi Anteraja terdiri dari 14 digit angka"
                >
                  {resi.length > 0 ? `${resi.length}/14 Digit` : "14 Digit"}
                </span>
              )}
              <button
                className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-500 transition-colors hover:bg-pink-50 hover:text-[#ec008c]"
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

        {maxLimitWarning ? (
          <p className="mt-2 text-[11px] text-rose-600 font-medium flex items-center gap-1 pl-1 animate-fade-in">
            <span className="material-symbols-outlined text-[14px] text-rose-600">error</span>
            <span>Nomor resi sudah mencapai batas maksimal <strong>14 digit</strong>. Tidak dapat menambahkan digit angka lagi.</span>
          </p>
        ) : (
          <p className="mt-2 text-[11px] text-gray-500 flex items-center gap-1 pl-1">
            <span className="material-symbols-outlined text-[14px] text-[#ec008c]">info</span>
            <span>Nomor resi resmi Anteraja wajib <strong>14 digit numerik</strong> (maksimal 14 angka).</span>
          </p>
        )}



        {/* Row Pencarian Terakhir */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-gray-400 text-[11px]">
            Pencarian Terakhir:
          </span>
          {recentSearches && recentSearches.length > 0 ? (
            recentSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setResi(item);
                  lacak(item);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 hover:bg-pink-50 hover:text-[#ec008c] text-gray-700 border border-gray-200 hover:border-pink-300 font-mono text-xs transition-all cursor-pointer group shadow-xs"
                title={`Lacak kembali ${item}`}
              >
                <span className="material-symbols-outlined text-[14px] text-gray-400 group-hover:text-[#ec008c]">
                  history
                </span>
                <span className="font-semibold tracking-tight">{item}</span>
              </button>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic">
              Belum ada riwayat pencarian
            </span>
          )}
        </div>
      </form>

      <Toast message={toast} onClose={() => setToast("")} open={Boolean(toast)} />
    </div>
  );
}
