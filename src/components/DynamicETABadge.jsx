const formatDate = (value) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
const formatDelivered = (value) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', timeZoneName: 'short' }).format(new Date(value)).replace('GMT+7', 'WIB');

export default function DynamicETABadge({ shipment }) {
  const delivered = shipment.order_status === 'delivered' && shipment.delivered_at;
  const canceled = shipment.order_status === 'canceled';
  return (
    <section aria-live="polite" aria-label="Estimasi pengiriman" className={`flex flex-col gap-4 rounded-3xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${delivered ? 'border-emerald-200 bg-emerald-50' : canceled ? 'border-stone-200 bg-stone-100' : 'border-pink-100 bg-[#fff0f5]'}`}>
      <div className="flex min-w-0 items-center gap-4">
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-2xl text-white shadow-sm ${delivered ? 'bg-success' : canceled ? 'bg-stone-500' : 'bg-brand'}`} aria-hidden="true">{delivered ? '✓' : canceled ? '×' : '◷'}</span>
        <div className="min-w-0">
          <p className={`text-[10px] font-extrabold uppercase tracking-[.16em] ${delivered ? 'text-emerald-700' : 'text-brand'}`}>{delivered ? 'Pengiriman selesai' : canceled ? 'Status pengiriman' : shipment.has_delay ? 'Estimasi diperbarui' : 'Status pengantaran aktif'}</p>
          <p className="mt-1 text-base font-extrabold leading-snug text-ink sm:text-lg">{delivered ? `Paket telah tiba · ${formatDelivered(shipment.delivered_at)}` : canceled ? 'Pengiriman dibatalkan' : `Estimasi tiba: ${formatDate(shipment.estimated_delivery_date)}, ${shipment.estimated_delivery_time} WIB`}</p>
        </div>
      </div>
      {!delivered && !canceled && <div className="flex flex-wrap gap-2 sm:justify-end"><span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">✓ {shipment.is_free_shipping ? 'Gratis Ongkir' : 'Asuransi Aktif'}</span><span className={`rounded-full px-3 py-2 text-xs font-bold ${shipment.has_delay ? 'bg-amber-100 text-amber-800' : 'bg-white/75 text-stone-700'}`}><span aria-hidden="true" className="mr-1">●</span>{shipment.has_delay ? 'Dalam Penyesuaian' : 'Dalam Pengantaran Kurir'}</span></div>}
    </section>
  );
}
