export default function ShipmentSummary({ shipment }) {
  const action = shipment.order_status === 'delivered'
    ? 'Paket telah tiba. Silakan cek kembali kiriman di alamat penerima.'
    : shipment.order_status === 'canceled'
      ? 'Hubungi penjual bila pembatalan ini tidak sesuai dengan permintaan Anda.'
      : shipment.has_delay
        ? 'Pantau estimasi terbaru; kurir sedang menyesuaikan rute dengan aman.'
        : 'Paket bergerak sesuai rencana. Periksa kembali setelah pembaruan berikutnya.';
  return (
    <section aria-labelledby="shipment-summary-title" className="rounded-3xl border border-stone-100 bg-white p-5 shadow-[0_14px_40px_-34px_rgba(54,28,80,.3)]">
      <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-brand">Ringkasan kiriman</p><h2 id="shipment-summary-title" className="mt-1 font-extrabold text-ink">Rincian paket</h2></div><span className="rounded-xl bg-pink-50 px-2.5 py-2 text-lg text-brand" aria-hidden="true">▣</span></div>
      <dl className="mt-4 space-y-3 text-xs">
        <div className="flex justify-between gap-4"><dt className="text-muted">Nomor resi</dt><dd className="max-w-[65%] truncate font-mono font-bold text-ink">{shipment.waybill_number}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted">Layanan</dt><dd className="font-semibold text-ink">{shipment.service_name}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted">Berat paket</dt><dd className="font-semibold text-ink">{shipment.weight_kg.toLocaleString('id-ID')} kg</dd></div>
        <div className="border-t border-stone-100 pt-3"><dt className="text-muted">Pengirim</dt><dd className="mt-1 font-bold text-ink">{shipment.seller_name} <span className="font-normal text-muted">· {shipment.seller_city}</span></dd></div>
        <div><dt className="text-muted">Penerima</dt><dd className="mt-1 font-bold text-ink">{shipment.customer_name} <span className="font-normal text-muted">· {shipment.customer_city}</span></dd></div>
      </dl>
      <div className="mt-4 rounded-2xl bg-emerald-50 p-3"><p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">Langkah berikutnya</p><p className="mt-1 text-xs leading-relaxed text-emerald-900">{action}</p></div>
    </section>
  );
}
