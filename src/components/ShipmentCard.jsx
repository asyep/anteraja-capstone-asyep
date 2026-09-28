const statusLabels = { in_transit: 'Dalam perjalanan', processing: 'Diproses', approved: 'Pesanan dibuat', delivered: 'Telah tiba', canceled: 'Dibatalkan' };

export default function ShipmentCard({ shipment, active, onSelect }) {
  const tone = shipment.order_status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : shipment.order_status === 'canceled' ? 'bg-red-50 text-red-700' : shipment.has_delay ? 'bg-amber-50 text-amber-800' : 'bg-pink-50 text-brand';
  return (
    <button type="button" onClick={() => onSelect(shipment.waybill_number)} aria-pressed={active} className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${active ? 'border-brand bg-pink-50/40 ring-2 ring-pink-100' : 'border-stone-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-3"><span className="max-w-[70%] truncate font-mono text-xs font-bold text-ink">{shipment.waybill_number}</span><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${tone}`}>{shipment.has_delay ? 'Ada kendala' : statusLabels[shipment.order_status]}</span></div>
      <p className="mt-3 text-sm font-bold text-stone-700">{shipment.seller_city} <span className="px-1 text-brand" aria-hidden="true">→</span> {shipment.customer_city}</p>
      <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-muted"><span className="truncate">{shipment.item_description}</span><span className="shrink-0">{shipment.weight_kg.toLocaleString('id-ID')} kg</span></div>
    </button>
  );
}
