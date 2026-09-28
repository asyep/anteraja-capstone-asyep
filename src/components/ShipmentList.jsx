import ShipmentCard from './ShipmentCard.jsx';

const FILTERS = [
  ['Semua', 'all'],
  ['In Transit', 'in_transit'],
  ['Delivered', 'delivered'],
  ['Delayed', 'delayed'],
  ['Dibatalkan', 'canceled'],
];

export default function ShipmentList({ shipments, activeWaybill, onSelect, filter, onFilterChange }) {
  const filtered = shipments.filter((shipment) => {
    if (filter === 'all') return true;
    if (filter === 'delayed') return shipment.has_delay;
    return shipment.order_status === filter;
  });
  return (
    <section aria-labelledby="shipment-list-title" className="rounded-3xl border border-stone-100 bg-white p-5 shadow-[0_14px_40px_-34px_rgba(54,28,80,.3)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-brand">Data demo</p><h2 id="shipment-list-title" className="mt-1 text-lg font-extrabold text-ink">Riwayat pengiriman</h2></div><span className="text-xs text-muted">{filtered.length} kiriman</span></div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter status kiriman">
        {FILTERS.map(([label, value]) => <button type="button" key={value} aria-pressed={filter === value} onClick={() => onFilterChange(value)} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${filter === value ? 'bg-brand text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>{label}</button>)}
      </div>
      {filtered.length ? <ul className="mt-4 grid gap-3 md:grid-cols-2">{filtered.map((shipment) => <li key={shipment.waybill_number}><ShipmentCard shipment={shipment} active={shipment.waybill_number === activeWaybill} onSelect={onSelect} /></li>)}</ul> : <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-8 text-center"><span className="text-2xl" aria-hidden="true">⌕</span><h3 className="mt-2 font-bold text-ink">Belum ada kiriman di filter ini</h3><p className="mt-1 text-sm text-muted">Pilih status lain untuk melihat data demo.</p></div>}
    </section>
  );
}
