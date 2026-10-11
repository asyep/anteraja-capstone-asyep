/** Latar banner per varian status: bertransisi mulus dari warna muda ke pekat (tahap 1 s/d 4). */
const BANNER_VARIANT = {
  // Tahap 1: "Pesanan Dibuat" — warna paling muda (pink/magenta muda cerah).
  default: {
    className: "text-white border border-pink-300/40 ring-2 ring-pink-300/30",
    style: {
      background: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
      boxShadow: "0 10px 25px -5px rgba(244, 114, 182, 0.35)",
    },
    iconBox: "bg-white/20 backdrop-blur-md border border-white/20 shadow-inner text-white",
    iconColor: "text-white",
    padding: "p-space-md md:p-space-lg",
    titleClass: "text-[18px] md:text-[20px]",
  },
  // Tahap 2: "Sedang Diproses Kurir" — warna sedang (magenta khas Anteraja).
  "primary-solid": {
    className: "text-white border border-pink-400/40 ring-2 ring-primary-fixed/30",
    style: {
      background: "linear-gradient(135deg, #ec008c 0%, #c70072 100%)",
      boxShadow: "0 10px 25px -5px rgba(236, 0, 140, 0.35)",
    },
    iconBox: "bg-white/20 backdrop-blur-md border border-white/20 shadow-inner text-white",
    iconColor: "text-white",
    padding: "p-space-md md:p-space-lg",
    titleClass: "text-[18px] md:text-[20px]",
  },
  // Tahap 3: "Dalam Perjalanan" — warna pekat (deep magenta linehaul).
  transit: {
    className: "text-white border border-pink-600/40",
    style: {
      background: "linear-gradient(135deg, #b50064 0%, #8f004c 100%)",
      boxShadow: "0 10px 25px -5px rgba(181, 0, 100, 0.35)",
    },
    iconBox: "bg-white/20 backdrop-blur-md border border-white/20 shadow-inner text-white",
    iconColor: "text-white",
    padding: "p-space-md md:p-space-lg",
    titleClass: "text-[18px] md:text-[20px]",
  },
  // Tahap 4: "Dalam Pengantaran" — warna paling pekat (rich dark magenta/maroon).
  delivery: {
    className: "text-white border border-pink-800/40",
    style: {
      background: "linear-gradient(135deg, #78003a 0%, #4e0024 100%)",
      boxShadow: "0 10px 25px -5px rgba(120, 0, 58, 0.35)",
    },
    iconBox: "bg-white/20 backdrop-blur-md border border-white/20 shadow-inner text-white",
    iconColor: "text-white",
    padding: "p-space-md md:p-space-lg",
    titleClass: "text-[18px] md:text-[20px]",
  },
  // Tahap 5: "Tiba di Tujuan" — warna hijau tetap (fix hijau tanpa gradasi ungu).
  delivered: {
    className: "text-white border border-emerald-600/30",
    style: {
      background: "linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)",
      boxShadow: "0 10px 25px -5px rgba(22, 101, 52, 0.35)",
    },
    iconBox: "bg-white/20 backdrop-blur-md border border-white/20 shadow-inner text-white",
    iconColor: "text-white",
    padding: "p-space-md md:p-space-lg",
    titleClass: "text-[18px] md:text-[20px]",
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
  // Varian dengan judul lebih kecil & badge lebih ringkas.
  const ringkas =
    status.variant === "transit" ||
    status.variant === "delivery" ||
    status.variant === "delivered";
  // Status akhir: titik penanda statis hijau, bukan berdenyut.
  const selesai = status.variant === "delivered";

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
            className={`material-symbols-outlined text-[28px] font-bold ${
              variant.iconColor ?? (!status.variant || status.variant === "default" ? "text-[#EC008C]" : "text-white")
            }`}
          >
            {status.icon || "inventory_2"}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span
            className={`flex items-center gap-1.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-white/90 ${
              ringkas ? "gap-2 tracking-wider" : "font-extrabold tracking-widest"
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
          ringkas ? "shrink-0" : "gap-space-sm"
        }`}
      >
        {status.badges.map((badge) => (
          <Badge badge={badge} key={badge.id} />
        ))}
      </div>
    </div>
  );
}
