/**
 * =============================================================================
 * TrackingSearchBar.jsx - Input Pencarian Resi Cepat & Quick Actions
 * =============================================================================
 * Komponen input pencarian nomor resi di dalam halaman pelacakan:
 * 1. Validasi Input: Membersihkan format karakter resi (alfanumerik).
 * 2. Salin Resi (Clipboard): Tombol one-click copy nomor resi aktif.
 * 3. Prefetching Cerdas: Memuat data di background saat mouse hover.
 * 4. Integrasi Riwayat: Menyimpan nomor resi ke recent search history.
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getRouteForResi, cleanResiInput } from "@/data/shipmentsData";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { prefetchTracking } from "@/lib/api";

export const ORDER_CREATED_DEMO_RESI = "10001240251661";

export default function TrackingSearchBar({ initialWaybill = "" }) {

  const navigate = useNavigate();
  const [waybill, setWaybill] = useState(() =>
    initialWaybill ? String(initialWaybill).replace(/\D/g, "").slice(0, 14) : ""
  );
  const [copied, setCopied] = useState(false);
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

  useEffect(() => {
    if (initialWaybill) {
      const sanitized = String(initialWaybill).replace(/\D/g, "").slice(0, 14);
      setWaybill(sanitized);
      if (sanitized) {
        addSearch(sanitized);
      }
    }
  }, [initialWaybill, addSearch]);

  function handleSubmit(event) {
    event.preventDefault();
    const bersih = cleanResiInput(waybill);
    if (!bersih) return;
    addSearch(bersih);

    // Memicu regenerasi narasi Satria AI Gemini jika nomor resi yang sama dicari ulang
    window.dispatchEvent(
      new CustomEvent("anteraja_refresh_tracking", {
        detail: { waybill: bersih, timestamp: Date.now() },
      })
    );

    navigate(getRouteForResi(bersih));
  }

  async function salinResi() {
    try {
      await navigator.clipboard.writeText(waybill);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard butuh konteks aman; abaikan */
    }
  }

  return (
    <div className="relative mb-space-xl w-full overflow-hidden rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />

      <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
        <div className="flex flex-col items-stretch gap-space-sm sm:flex-row sm:items-center">
          <div className="relative flex flex-1 items-center">
            <span className="material-symbols-outlined pointer-events-none absolute left-4 text-[22px] text-text-placeholder">
              tag
            </span>
            <input
              aria-label="Nomor resi 14 digit Anteraja"
              autoComplete="off"
              className={`h-14 w-full rounded-xl bg-surface-card pl-12 pr-44 sm:pr-48 font-mono-code text-mono-code tracking-wide text-text-primary shadow-inner transition-all placeholder:text-text-placeholder focus:bg-surface-container-lowest focus:outline-none focus:ring-2 ${
                maxLimitWarning ? "ring-2 ring-rose-500 border-rose-500" : "focus:ring-primary"
              } text-sm sm:text-base`}
              id="resi-input"
              maxLength={14}
              onKeyDown={(e) => {
                if (
                  waybill.length >= 14 &&
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
                const rawDigits = event.target.value.replace(/\D/g, "");
                if (rawDigits.length > 14) {
                  triggerLimitWarning();
                }
                setWaybill(rawDigits.slice(0, 14));
              }}
              onPaste={(event) => {
                event.preventDefault();
                const pasted = event.clipboardData.getData("text");
                const digits = pasted.replace(/\D/g, "");
                if (digits.length > 14) {
                  triggerLimitWarning();
                }
                setWaybill(digits.slice(0, 14));
              }}
              placeholder="Masukkan 14 digit nomor resi (contoh: 10001284277889)"
              type="text"
              value={waybill}
            />
            <div className="absolute right-3 flex items-center gap-1.5 sm:gap-2">
              {maxLimitWarning ? (
                <span
                  className="flex items-center gap-1 text-[11px] font-sans font-bold px-2.5 py-1 rounded-lg border bg-rose-50 text-rose-700 border-rose-300 shadow-sm animate-pulse"
                  role="alert"
                  title="Batas maksimal 14 digit nomor resi telah tercapai"
                >
                  <span className="material-symbols-outlined text-[13px]">warning</span>
                  Maksimal 14 Digit!
                </span>
              ) : (
                <span
                  className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all select-none ${
                    waybill.length === 14
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs"
                      : waybill.length > 0
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-surface-container-high/60 text-text-muted border-border-subtle"
                  }`}
                  title="Nomor resi resmi Anteraja terdiri dari tepat 14 digit angka"
                >
                  {waybill.length > 0 ? `${waybill.length}/14 Digit` : "14 Digit"}
                </span>
              )}
              <button
                aria-label="Salin nomor resi"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-primary-fixed/40 hover:text-primary"
                onClick={salinResi}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copied ? "check" : "content_copy"}
                </span>
              </button>
            </div>
          </div>

          <button
            className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-space-xl font-label-lg text-label-lg font-bold text-on-primary shadow-lg transition-all hover:bg-primary-container active:scale-[0.99] shrink-0"
            type="submit"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
            Lacak Paket
          </button>
        </div>

        {maxLimitWarning && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-fade-in">
            <span className="material-symbols-outlined text-[16px] text-rose-600">error</span>
            <span>Nomor resi sudah mencapai batas maksimal <strong>14 digit</strong>. Tidak dapat menambahkan digit angka lagi.</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 text-on-surface-variant">
          <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-text-muted">
            Pencarian Terakhir:
          </span>
          {recentSearches && recentSearches.length > 0 ? (
            recentSearches.map((resi) => (
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-low hover:bg-primary/10 hover:text-primary text-text-primary border border-border-subtle hover:border-primary/40 font-mono text-xs transition-all cursor-pointer group shadow-xs"
                key={resi}
                onMouseEnter={() => prefetchTracking(resi)}
                onClick={() => {
                  setWaybill(resi);
                  navigate(getRouteForResi(resi));
                }}
                title={`Lacak kembali nomor resi ${resi}`}
                type="button"
              >
                <span className="material-symbols-outlined text-[14px] text-text-muted group-hover:text-primary">
                  history
                </span>
                <span className="font-semibold tracking-tight">{resi}</span>
              </button>
            ))
          ) : (
            <span className="text-xs text-text-muted italic">
              Belum ada riwayat pencarian
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

