/** Latar banner per varian status. */
const BANNER_VARIANT = {
  "primary-solid": {
    className: "bg-primary border border-primary/30 ring-2 ring-primary-fixed/30",
    style: {
      background:
        "linear-gradient(135deg, #b30069 0%, #d4147f 55%, #e00085 100%)",
      boxShadow: "0 10px 25px -5px rgba(179, 0, 105, 0.35)",
    },
    iconBox: "bg-white/20 text-white shadow-inner border border-white/30 backdrop-blur-xl",
  },
  default: {
    className: "bg-gradient-to-r from-pink-500/80 to-rose-400/80 ring-4 ring-pink-300/30 backdrop-blur-md",
    style: undefined,
    iconBox: "bg-white shadow-lg",
  },
};

/**
 * Banner status utama: berisi status pesanan, judul, dan badge
 * (Gratis Ongkir / status hub). Varian warna diatur lewat `status.variant`.
 */
export default function StatusBanner({ status }) {
  const variant = BANNER_VARIANT[status.variant] ?? BANNER_VARIANT.default;

  return (
    <div
      className={`relative flex w-full flex-col items-start justify-between gap-space-md overflow-hidden rounded-2xl p-space-md text-white shadow-lg md:flex-row md:items-center ${variant.className}`}
      style={variant.style}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

      <div className="relative z-10 flex items-center gap-space-md">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${variant.iconBox}`}
        >
          <span
            className={`material-symbols-outlined text-[28px] font-bold ${
              status.variant === "primary-solid" ? "text-white" : "text-[#EC008C]"
            }`}
          >
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
              <span className={`h-2 w-2 rounded-full ${badge.dot ?? "bg-[#EC008C]"}`} />
            )}
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
}
