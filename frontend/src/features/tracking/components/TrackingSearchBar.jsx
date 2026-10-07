import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRouteForResi } from "@/features/home/data/shipmentsData";
import {
  ORDER_CREATED_DEMO_RESI,
  RECENT_SEARCHES,
} from "@/features/tracking/data/trackingStatus";

/**
 * Kolom pencarian resi di halaman status pelacakan.
 * Menyimpan resi di state lokal, lalu mengarahkan ke halaman status yang
 * sesuai lewat getRouteForResi().
 */
export default function TrackingSearchBar({ initialWaybill = "" }) {
  const navigate = useNavigate();
  const [waybill, setWaybill] = useState(initialWaybill);
  const [copied, setCopied] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const bersih = waybill.trim();
    if (!bersih) return;
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
              aria-label="Nomor resi atau Order ID"
              autoComplete="off"
              className="h-14 w-full rounded-xl bg-surface-card pl-12 pr-12 font-mono-code text-mono-code tracking-wide text-text-primary shadow-inner transition-all placeholder:text-text-placeholder focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
              id="resi-input"
              maxLength="32"
              onChange={(event) => setWaybill(event.target.value)}
              placeholder="Masukkan 32 Karakter Nomor Resi / Order ID"
              type="text"
              value={waybill}
            />
            <button
              aria-label="Salin nomor resi"
              className="absolute right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-primary-fixed/40 hover:text-primary"
              onClick={salinResi}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copied ? "check" : "content_copy"}
              </span>
            </button>
          </div>

          <button
            className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-space-xl font-label-lg text-label-lg font-bold text-on-primary shadow-lg transition-all hover:bg-primary-container active:scale-[0.99]"
            type="submit"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
            Lacak Paket
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm text-on-surface-variant">
          <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-text-muted">
            Pencarian Terakhir:
          </span>
          {RECENT_SEARCHES.map((item) => (
            <button
              className="flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1.5 font-mono-code text-label-sm text-on-surface shadow-sm transition-all hover:bg-primary-fixed/40 hover:text-primary"
              key={item.resi}
              onClick={() => setWaybill(item.resi)}
              type="button"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${item.dotClass}`} />
              {item.label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

export { ORDER_CREATED_DEMO_RESI };
