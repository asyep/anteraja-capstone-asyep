export default function OperationalWarningBanner({ shipment }) {
  if (!shipment.has_delay) return null;
  return (
    <aside role="status" aria-live="polite" className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-sm sm:p-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-xl text-amber-700" aria-hidden="true">⚠</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2"><h2 className="font-extrabold">Perhatian: ada penyesuaian perjalanan</h2><span className="rounded-full bg-amber-200 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-900">{shipment.traffic_status}</span></div>
        <p className="mt-1 text-sm leading-relaxed">Kendala <strong>{shipment.logistics_delay_reason}</strong> terdeteksi di jalur transit dari {shipment.seller_city}. Estimasi diperbarui agar kurir dapat mengutamakan keamanan paket.</p>
      </div>
    </aside>
  );
}
