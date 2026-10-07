/** Penanda lokasi tujuan pada peta radar. */
function DestinationPin() {
  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 64 88"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* sisi gelap */}
      <path
        d="M32 88S64 50.5 64 32C64 14.3 49.7 0 32 0v88z"
        fill="#c9006e"
      />
      {/* sisi terang */}
      <path d="M32 88S0 50.5 0 32C0 14.3 14.3 0 32 0v88z" fill="#EC008C" />
      {/* lingkaran dalam */}
      <circle cx="32" cy="32" fill="#ffffff" r="12" />
      <circle cx="32" cy="32" fill="#EC008C" r="5" />
      <ellipse cx="32" cy="84" fill="#1c1b1b" opacity="0.18" rx="14" ry="3" />
    </svg>
  );
}

/**
 * Kartu "Radar Posisi Paket".
 * Peta digambar dengan CSS (grid + jalan) supaya tidak bergantung pada
 * aset peta eksternal, dengan penanda tujuan Jakarta Selatan.
 */
export default function LivePositionCard({ radar }) {
  return (
    <div className="flex w-full flex-col gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-lg">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-label-md text-label-md font-bold text-on-surface">
          <span className="material-symbols-outlined text-[18px] text-primary">
            near_me
          </span>
          Radar Posisi Paket
        </span>
        <span className="rounded-full bg-surface-container-low px-2.5 py-0.5 font-label-sm text-label-sm font-bold text-text-muted">
          {radar.statusLabel}
        </span>
      </div>

      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl shadow-inner">
        {/* Peta (CSS) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#e8eef1]"
          style={{
            backgroundImage: [
              "linear-gradient(0deg, rgba(255,255,255,0.85) 2px, transparent 2px)",
              "linear-gradient(90deg, rgba(255,255,255,0.85) 2px, transparent 2px)",
              "linear-gradient(90deg, #cfd9de 8px, transparent 8px)",
              "linear-gradient(0deg, #cfd9de 10px, transparent 10px)",
            ].join(","),
            backgroundSize: "44px 44px, 44px 44px, 132px 132px, 220px 220px",
          }}
        />

        {/* Lapisan blur di atas peta */}
        <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm" />

        {/* Penanda tujuan */}
        <div className="absolute left-1/2 top-1/2 h-16 w-12 -translate-x-1/2 -translate-y-[70%]">
          <DestinationPin />
        </div>

        {/* Keterangan status GPS */}
        <div className="relative z-10 flex max-w-[240px] flex-col items-center gap-1 rounded-xl border border-border-subtle/50 bg-surface-container-lowest/95 p-3.5 text-center shadow-lg backdrop-blur-md">
          <div className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[18px]">
              location_off
            </span>
          </div>
          <span className="font-label-md text-label-md font-bold text-on-surface">
            {radar.title}
          </span>
          <p className="font-body-sm text-[11px] leading-tight text-text-muted">
            {radar.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="font-body-sm text-body-sm text-text-muted">
          {radar.footerLeft}
        </span>
        <span className="flex items-center gap-0.5 font-label-sm text-label-sm text-text-muted">
          {radar.footerRight}
        </span>
      </div>
    </div>
  );
}
