import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getRouteForResi, sampleResiList } from "../data/shipmentsData";

/** Shared tracking form for each shipment-status page. */
export default function TrackingSearchPanel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [waybill, setWaybill] = useState(
    searchParams.get("waybill_number") ?? "",
  );

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedWaybill = waybill.trim();
    if (!normalizedWaybill) return;
    navigate(getRouteForResi(normalizedWaybill));
  }

  return (
    <section
      aria-label="Cari nomor resi"
      className="mb-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xl"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
      >
        <label className="sr-only" htmlFor="tracking-waybill-search">
          Nomor resi
        </label>
        <div className="relative flex h-14 min-w-0 flex-1 items-center rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] pl-4 pr-2">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-[22px] text-[#9CA3AF]"
          >
            tag
          </span>
          <input
            id="tracking-waybill-search"
            type="text"
            value={waybill}
            onChange={(event) => setWaybill(event.target.value)}
            placeholder="Masukkan nomor resi Anteraja..."
            className="h-full min-w-0 w-full flex-1 bg-transparent px-3 text-sm font-mono font-bold text-[#1c1b1b] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#b30069] px-8 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#e00085]"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-[20px]"
          >
            search
          </span>
          <span>Lacak Paket</span>
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#f0eded] pt-2">
        <span className="text-xs font-bold text-[#5a3f49]">
          Uji Coba Resi Demo:
        </span>
        {sampleResiList.map((item) => (
          <Link
            key={item.resi}
            to={`${item.path}?waybill_number=${encodeURIComponent(item.resi)}`}
            className="rounded-full bg-[#f6f3f2] px-3 py-1.5 font-mono text-[11px] font-bold text-[#1c1b1b] shadow-sm transition-colors hover:bg-[#ffd9e4]"
          >
            #{item.resi} ({item.label})
          </Link>
        ))}
      </div>
    </section>
  );
}
