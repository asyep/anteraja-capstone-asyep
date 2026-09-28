const buildFriendlyNarrative = (shipment) => {
  if (shipment.ai_narrative?.text) return shipment.ai_narrative.text;
  if (shipment.order_status === 'delivered') return `Paket Kakak sudah diterima di ${shipment.customer_city}. Perjalanan dari ${shipment.seller_city} telah selesai dengan aman. Terima kasih telah mempercayakan kiriman kepada Anteraja.`;
  if (shipment.order_status === 'canceled') return 'Pengiriman ini dibatalkan sebelum perjalanan dimulai. Jika pembatalan tidak sesuai dengan permintaan Kakak, hubungi penjual untuk memastikan tindak lanjut pesanan.';
  if (shipment.has_delay) return `Paket Kakak sedang menuju ${shipment.customer_city} dari ${shipment.seller_city}. Kendala ${shipment.logistics_delay_reason} membuat estimasi perlu disesuaikan. Kurir terus memantau rute dan mengupayakan paket tiba dengan aman.`;
  return `Paket Kakak sedang bergerak dari ${shipment.seller_city} menuju ${shipment.customer_city}. Perjalanan saat ini berjalan lancar dan kurir memperbarui setiap titik transit agar paket tiba sesuai perkiraan.`;
};

export default function AINarrativeBox({ shipment }) {
  const fallback = shipment.ai_narrative?.is_fallback ?? true;
  const narrative = buildFriendlyNarrative(shipment);
  return (
    <section aria-labelledby="ai-narrative-title" className="rounded-3xl border border-violet-100 bg-gradient-to-br from-white via-white to-violet-50/70 p-5 shadow-[0_14px_40px_-34px_rgba(54,28,80,.35)] sm:p-6">
      <div className="flex items-start gap-3">
        <div className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-400 text-2xl shadow-sm" aria-hidden="true">◉<span className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-white bg-success" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h2 id="ai-narrative-title" className="font-extrabold text-ink">Satria Assistant</h2><span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-700">✦ Penjelasan status</span>{fallback && <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-600">Mode cadangan</span>}</div>
          <p className="mt-1 text-xs text-muted">Informasi perjalanan dalam bahasa yang mudah dipahami.</p>
          <blockquote className="mt-4 rounded-2xl border border-violet-100 bg-white/90 p-4 text-sm leading-6 text-stone-700">“{narrative}”</blockquote>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500"><span>{fallback ? 'Ringkasan aturan cadangan berdasarkan status paket.' : 'Ringkasan demo Satria Assistant.'}</span><span className="inline-flex items-center gap-1 font-semibold text-emerald-700">✓ Status mengikuti perjalanan</span></div>
        </div>
      </div>
    </section>
  );
}
