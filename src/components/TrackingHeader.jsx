export default function TrackingHeader({ audience, onAudienceChange, activeUser = 'Asep' }) {
  const greeting = audience === 'B2B' ? `Halo Mitra ${activeUser}` : `Halo Kak ${activeUser}`;
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-5 px-5 sm:px-8">
        <a href="#beranda" className="flex shrink-0 items-center gap-2 text-brand" aria-label="Anteraja, beranda">
          <span className="grid size-9 place-items-center rounded-xl bg-brand text-xl font-black italic text-white">a</span>
          <span className="text-xl font-extrabold tracking-tight">anteraja</span>
        </a>
        <nav className="hidden items-center gap-2 sm:flex" aria-label="Navigasi utama">
          <a href="#beranda" className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-brand">Beranda</a>
          <a href="#pelacakan" className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100">Lacak Kiriman</a>
          <a href="#bantuan" className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100">Bantuan</a>
        </nav>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="audience">Jenis pengguna</label>
          <select id="audience" value={audience} onChange={(event) => onAudienceChange(event.target.value)} className="max-w-[100px] rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-600">
            <option value="B2C">Pelanggan</option>
            <option value="B2B">Merchant</option>
          </select>
          <span className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white md:inline">{greeting}</span>
        </div>
      </div>
      <div className="border-t border-pink-100 bg-pink-50/70 px-5 py-2 text-center text-xs font-medium text-brand sm:hidden">
        Satria Assistant siap membantu, {greeting}.
      </div>
    </header>
  );
}
