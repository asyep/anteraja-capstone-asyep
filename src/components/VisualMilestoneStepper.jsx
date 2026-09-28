const STAGES = [
  ['ORDER_CREATED', 'Pesanan dibuat', 'Pesanan diterima'],
  ['PICKUP_READY', 'Diproses kurir', 'Paket disiapkan'],
  ['IN_TRANSIT', 'Dalam transit', 'Menuju kota tujuan'],
  ['DELIVERED', 'Tiba di tujuan', 'Paket diterima'],
];

const formatTimestamp = (value) => value ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date(value)).replace('pukul ', '') + ' WIB' : 'Menunggu pembaruan';

export default function VisualMilestoneStepper({ shipment }) {
  if (shipment.order_status === 'canceled') return <section aria-label="Status perjalanan" className="rounded-3xl border border-red-200 bg-red-50 p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-red-100 text-xl font-bold text-red-700" aria-hidden="true">×</span><div><p className="text-xs font-bold uppercase tracking-wider text-red-700">Perjalanan dihentikan</p><h2 className="font-extrabold text-red-900">Pengiriman dibatalkan</h2></div></div></section>;
  return (
    <section aria-labelledby="stepper-title" className="rounded-3xl border border-stone-100 bg-white p-5 shadow-[0_14px_40px_-34px_rgba(54,28,80,.3)] sm:p-6">
      <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-brand">Perjalanan paket</p><h2 id="stepper-title" className="mt-1 text-lg font-extrabold text-ink">Tahapan pengiriman</h2></div><span className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-bold text-brand">{shipment.milestone_stages.filter((stage) => stage.completed || stage.current).length} / 4 tahap</span></div>
      <ol className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-2">
        {STAGES.map(([code, label, description], index) => {
          const stage = shipment.milestone_stages.find((item) => item.code === code);
          const done = stage?.completed || (shipment.order_status === 'delivered' && index === 3);
          const active = stage?.current;
          return <li key={code} className="relative min-w-0 text-center">
            {index < STAGES.length - 1 && <span aria-hidden="true" className={`absolute left-[calc(50%+20px)] top-4 hidden h-0.5 w-[calc(100%-40px)] sm:block ${done ? 'bg-success' : 'bg-stone-200'}`} />}
            <span className={`relative z-10 mx-auto grid size-9 place-items-center rounded-full border-2 text-sm font-extrabold ${done ? 'border-success bg-success text-white' : active ? 'border-brand bg-brand text-white ring-4 ring-pink-100' : 'border-stone-200 bg-white text-stone-400'}`} aria-label={done ? 'Selesai' : active ? 'Tahap aktif' : 'Belum selesai'}>{done ? '✓' : index + 1}</span>
            <h3 className={`mt-2 text-xs font-extrabold ${done || active ? 'text-ink' : 'text-stone-400'}`}>{label}</h3>
            <p className="mt-0.5 text-[10px] text-muted">{description}</p>
            <p className="mt-1 text-[10px] font-medium text-stone-500">{formatTimestamp(stage?.timestamp)}</p>
          </li>;
        })}
      </ol>
    </section>
  );
}
