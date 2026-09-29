export default function EmptyState() {
  return (
    <div
      className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-8 text-center"
      role="status"
    >
      <span className="text-2xl" aria-hidden="true">⌕</span>
      <p className="mt-2 font-bold text-ink">Tidak ada paket ditemukan dengan status ini</p>
    </div>
  );
}
