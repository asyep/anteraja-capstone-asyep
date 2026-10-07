/** Latar banner per varian status. */
const BANNER_VARIANT = {
  // Gradien magenta pekat (mis. "Sedang Diproses Kurir").
  "primary-solid": {
    className:
      "bg-primary border border-primary/30 ring-2 ring-primary-fixed/30",
    style: {
      background:
        "linear-gradient(135deg, #b30069 0%, #d4147f 55%, #e00085 100%)",
      boxShadow: "0 10px 25px -5px rgba(179, 0, 105, 0.35)",
    },
    iconBox:
      "bg-white/20 text-white shadow-inner border border-white/30 backdrop-blur-xl",
  },
  // Gradien magenta cerah dengan judul lebih kecil (mis. "Dalam Perjalanan").
  transit: {
    className: "text-white",
    style: {
      background: "linear-gradient(135deg, #c2006a 0%, #ec008c 100%)",
    },
    iconBox:
      "bg-white/20 backdrop-blur-md border border-white/20 shadow-inner",
    padding: "p-space-md md:p-space-lg",
    titleClass: "text-[18px] md:text-[20px]",
  },
  default: {
    className:
      "bg-gradient-to-r from-pink-500/80 to-rose-400/80 ring-4 ring-pink-300/30 backdrop-blur-md",
    style: undefined,
    iconBox: "bg-white shadow-lg",
  },
};

/** Satu badge di sisi kanan banner. */
function Badge({ badge }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-label-md text-label-md font-bold shadow-sm ${badge.className}`}
    >
      {badge.icon ? (
        <span
          className={`material-symbols-outlined text-[16px] ${
            badge.tone === "ghost" ? "" : "text-success-base"
          }`}
        >
          {badge.icon}
        </span>
      ) : (
        <span
          className={`h-2 w-2 rounded-full ${badge.dot ?? "bg-[#EC008C]"}`}
        />
      )}
      {badge.label}
    </span>
  );
}

/**
 * Banner status utama: status pesanan, judul, dan badge (Gratis Ongkir /
 * status hub / estimasi tiba). Warna & ukuran diatur lewat `status.variant`.
 */
export default function StatusBanner({ status }) {
  const variant = BANNER_VARIANT[status.variant] ?? BANNER_VARIANT.default;
  const transit = status.variant === "transit";

  return (
    <div
      className={`relative flex w-full flex-col items-start justify-between gap-space-md overflow-hidden rounded-2xl text-white shadow-lg md:flex-row md:items-center ${
        variant.padding ?? "p-space-md"
      } ${variant.className}`}
      style={variant.style}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

      <div className="relative z-10 flex items-center gap-space-md">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${variant.iconBox}`}
        >
          <span
            className={`material-symbols-outlined text-[28px] ${
              status.variant === "default" ? "font-bold text-[#EC008C]" : "text-white"
            }`}
          >
            {status.icon}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span
            className={`flex items-center gap-1.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-white/90 ${
              transit ? "gap-2 tracking-wider" : "font-extrabold tracking-widest"
            }`}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            Status Pesanan: {status.code}
          </span>
          <span
            className={`font-bold tracking-tight text-white ${
              variant.titleClass ?? "font-headline-md text-headline-md font-extrabold"
            } leading-tight`}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div
        className={`relative z-10 flex flex-wrap items-center gap-space-xs self-end md:gap-space-sm md:self-center ${
          transit ? "shrink-0" : "gap-space-sm"
        }`}
      >
        {status.badges.map((badge) => (
          <Badge badge={badge} key={badge.id} />
        ))}
      </div>
    </div>
  );
}
