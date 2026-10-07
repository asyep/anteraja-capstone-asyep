/**
 * Banner status utama: gradien magenta + ring lembut, berisi status pesanan,
 * aksi cepat, dan dua badge (Gratis Ongkir / Menunggu Pickup).
 */
export default function StatusBanner({ status }) {
  return (
    <div className="relative flex w-full flex-col items-start justify-between gap-space-md overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500/80 to-rose-400/80 p-space-md text-white shadow-lg ring-4 ring-pink-300/30 backdrop-blur-md md:flex-row md:items-center">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

      <div className="relative z-10 flex items-center gap-space-md">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-lg">
          <span className="material-symbols-outlined text-[28px] font-bold text-[#EC008C]">
            {status.icon}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="flex items-center gap-1.5 font-label-sm text-label-sm font-extrabold uppercase tracking-widest text-white/90">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            Status Pesanan: {status.code}
          </span>
          <div className="mt-0.5 flex flex-wrap items-center gap-2.5">
            <span className="font-headline-md text-headline-md font-extrabold tracking-tight text-white">
              {status.label}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-space-sm self-end md:self-center">
        {status.badges.map((badge) => (
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-label-md text-label-md font-bold shadow-md ${badge.className}`}
            key={badge.id}
          >
            {badge.icon ? (
              <span className="material-symbols-outlined text-[16px] text-success-base">
                {badge.icon}
              </span>
            ) : (
              <span className="h-2 w-2 rounded-full bg-[#EC008C]" />
            )}
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
}
