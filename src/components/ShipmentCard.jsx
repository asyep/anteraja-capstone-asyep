export default function ShipmentCard({ shipment, active, onSelect }) {
  const {
    waybill_number,
    order_status,
    seller_city,
    customer_city,
    has_delay,
  } = shipment;
  let statusInfo;
  if (order_status === "canceled") {
    statusInfo = { label: "Dibatalkan", color: "bg-stone-100 text-stone-600" };
  } else if (order_status === "delivered") {
    statusInfo = {
      label: "Telah Tiba",
      color: "bg-emerald-50 text-emerald-800",
    };
  } else if (has_delay) {
    statusInfo = { label: "Terkendala", color: "bg-amber-100 text-amber-800" };
  } else {
    statusInfo = { label: "Dalam Perjalanan", color: "bg-pink-50 text-brand" };
  }

  return (
    <li>
      <button
        type="button"
        aria-pressed={active}
        onClick={() => onSelect(waybill_number)}
        className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5 ${active ? "border-brand bg-pink-50/60 ring-1 ring-brand shadow-sm" : "border-stone-200 bg-white hover:border-brand/40 hover:shadow-sm"}`}
      >
        <span className="mb-3 flex items-start justify-between gap-3">
          <span className="mr-3 break-all font-mono text-sm font-bold leading-none text-ink">
            {waybill_number}
          </span>
          <span
            className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        </span>
        <span className="flex items-center gap-2 text-xs font-medium text-muted">
          <span className="max-w-[120px] truncate">{seller_city}</span>
          <svg
            className="size-3.5 shrink-0 text-stone-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
          <span className="max-w-[120px] truncate">{customer_city}</span>
        </span>
      </button>
    </li>
  );
}
