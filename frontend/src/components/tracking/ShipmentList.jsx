import { useMemo } from "react";
import EmptyState from "../common/EmptyState.jsx";
import ShipmentCard from "./ShipmentCard.jsx";

const FILTERS = [
  ["Semua", "all"],
  ["In Transit", "in_transit"],
  ["Delivered", "delivered"],
  ["Delayed", "delayed"],
];

export default function ShipmentList({
  shipments,
  activeWaybill,
  statusFilter,
  onStatusFilterChange,
  onSelect,
}) {
  const filteredShipments = useMemo(
    () =>
      shipments.filter((shipment) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "delayed") return shipment.has_delay;
        if (statusFilter === "in_transit") {
          return shipment.order_status === "in_transit" && !shipment.has_delay;
        }
        return shipment.order_status === statusFilter;
      }),
    [statusFilter, shipments],
  );

  return (
    <section
      aria-labelledby="shipment-list-title"
      className="rounded-3xl border border-stone-100 bg-white p-5 shadow-[0_14px_40px_-34px_rgba(54,28,80,.3)] sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.17em] text-brand">
            Data demo
          </p>
          <h2
            id="shipment-list-title"
            className="mt-1 text-lg font-extrabold text-ink"
          >
            Riwayat pengiriman
          </h2>
        </div>
        <span className="text-xs text-muted" aria-live="polite">
          {filteredShipments.length} kiriman
        </span>
      </div>

      <div
        className="mt-4 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter status kiriman"
      >
        {FILTERS.map(([label, value]) => (
          <button
            type="button"
            key={value}
            aria-pressed={statusFilter === value}
            onClick={() => onStatusFilterChange(value)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${statusFilter === value ? "bg-brand text-white shadow-sm" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {filteredShipments.length === 0 ? (
        <EmptyState />
      ) : (
        <ul
          className="mt-4 grid gap-3 md:grid-cols-2"
          aria-label="Daftar paket"
        >
          {filteredShipments.map((shipment) => (
            <ShipmentCard
              key={shipment.waybill_number}
              shipment={shipment}
              active={shipment.waybill_number === activeWaybill}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
