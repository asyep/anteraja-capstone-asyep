/** Penanda lokasi tujuan pada peta standby. */
function DestinationPin() {
  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 64 88"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* sisi gelap */}
      <path d="M32 88S64 50.5 64 32C64 14.3 49.7 0 32 0v88z" fill="#c9006e" />
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
 * Peta standby: dipakai saat paket belum dijemput, jadi belum ada posisi GPS.
 * Grid dan jalan digambar dengan CSS, pin tujuan dengan SVG.
 */
export default function StandbyMap({ title, description }) {
  return (
    <>
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

      <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm" />

      <div className="absolute left-1/2 top-1/2 h-16 w-12 -translate-x-1/2 -translate-y-[70%]">
        <DestinationPin />
      </div>

      <div className="relative z-10 flex max-w-[240px] flex-col items-center gap-1 rounded-xl border border-border-subtle/50 bg-surface-container-lowest/95 p-3.5 text-center shadow-lg backdrop-blur-md">
        <div className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-[18px]">
            location_off
          </span>
        </div>
        <span className="font-label-md text-label-md font-bold text-on-surface">
          {title}
        </span>
        <p className="font-body-sm text-[11px] leading-tight text-text-muted">
          {description}
        </p>
      </div>
    </>
  );
}
