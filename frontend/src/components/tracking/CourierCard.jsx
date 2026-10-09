import CourierAvatar from "./CourierAvatar";

/** Tombol aksi yang aktif (Hubungi / Pesan Kilat). */
function ActionButton({ as = "button", href, icon, label, variant }) {
  const kelas = `flex h-11 items-center justify-center gap-1.5 rounded-xl px-space-sm font-label-md text-label-md font-bold shadow-sm transition-all active:scale-[0.98] ${
    variant === "primary"
      ? "bg-primary text-on-primary shadow-md hover:bg-primary-container"
      : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
  }`;
  const isi = (
    <>
      <span
        className={`material-symbols-outlined text-[18px] ${
          variant === "primary" ? "" : "text-primary"
        }`}
      >
        {icon}
      </span>
      {label}
    </>
  );

  if (as === "a") {
    return (
      <a
        className={kelas}
        href={href}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        target={href?.startsWith("http") ? "_blank" : undefined}
      >
        {isi}
      </a>
    );
  }

  return (
    <button className={`${kelas} cursor-not-allowed opacity-60`} disabled type="button">
      {isi}
    </button>
  );
}

/**
 * Kartu "Satria Bertugas". Dua kondisi:
 * - belum ada kurir  -> tombol Hubungi & Pesan Kilat nonaktif
 * - kurir bertugas   -> tampil profil, rating, status rute, dan tombol aktif
 */
export default function CourierCard({ courier }) {
  const aktif = Boolean(courier.active);

  return (
    <div className="flex w-full flex-col gap-space-md rounded-2xl border border-border-subtle/50 bg-surface-container-lowest p-space-lg shadow-lg">
      <div className="flex items-center justify-between border-b border-border-subtle/50 pb-space-xs">
        <div className="flex items-center gap-2">
          <span
            className={`material-symbols-outlined text-[20px] ${
              aktif ? "text-primary" : "text-text-muted"
            }`}
          >
            badge
          </span>
          <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
            Satria Bertugas
          </h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 font-mono-code text-label-sm font-bold ${
            aktif
              ? "bg-tertiary-fixed text-on-tertiary-fixed"
              : "bg-surface-container text-text-muted"
          }`}
        >
          {courier.idLabel}
        </span>
      </div>

      {aktif ? (
        <div className="flex items-center gap-space-md">
          <CourierAvatar name={courier.name} size="h-14 w-14" src={courier.avatar} />
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-1.5">
              <h4 className="truncate font-headline-sm text-headline-sm font-bold text-on-surface">
                {courier.name}
              </h4>
              <span
                className="material-symbols-outlined text-[18px] text-primary"
                title="Terverifikasi"
              >
                verified
              </span>
            </div>
            <div className="flex items-center gap-1 text-[13px] font-semibold text-secondary">
              <span className="material-symbols-outlined text-[16px] text-secondary-container">
                star
              </span>
              <span className="font-bold text-on-surface">{courier.rating}</span>
              <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">
                ({courier.totalKiriman})
              </span>
            </div>
            <span className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
              {courier.armada}{" "}
              <span className="font-mono-code text-[11px] text-text-muted">
                (#{courier.armadaId})
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-space-md">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-container-high text-text-muted shadow-sm">
            <span className="material-symbols-outlined text-[36px] text-text-placeholder">
              two_wheeler
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <h4 className="truncate font-headline-sm text-headline-sm font-bold text-text-muted">
              {courier.title}
            </h4>
            <span className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
              {courier.description}
            </span>
          </div>
        </div>
      )}

      <div
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-label-sm text-label-sm font-semibold ${
          aktif
            ? "bg-success-surface text-tertiary"
            : "bg-surface-container text-text-muted"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            aktif ? "animate-ping bg-success-base" : "bg-text-placeholder"
          }`}
        />
        {aktif ? courier.activeNote : courier.standbyNote}
      </div>

      <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
        <ActionButton
          as={aktif ? "a" : "button"}
          href={aktif ? courier.phone : undefined}
          icon="call"
          label="Hubungi"
          variant="secondary"
        />
        <ActionButton
          as={aktif ? "a" : "button"}
          href={aktif ? courier.whatsapp : undefined}
          icon="chat"
          label="Pesan Kilat"
          variant={aktif ? "primary" : "secondary"}
        />
      </div>
    </div>
  );
}
