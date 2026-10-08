/** Satu baris informasi kecil di kartu rincian paket. */
function MetaRow({ label, children }) {
  return (
    <div className="flex items-center justify-between font-body-sm text-body-sm text-text-muted">
      <span>{label}</span>
      {children}
    </div>
  );
}

/**
 * Kartu "Rincian Paket": pengirim, penerima, spesifikasi layanan,
 * berat, asuransi, dan instruksi khusus.
 */
export default function PackageDetailCard({ data }) {
  const { sender, receiver, package: pkg, service } = data;

  return (
    <div className="flex w-full flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-lg shadow-lg">
      <div className="flex items-center justify-between pb-space-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px] text-primary">
            inventory_2
          </span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Rincian Paket
          </h3>
        </div>
        <span className="rounded-full bg-tertiary-fixed px-2.5 py-1 font-label-sm text-label-sm font-bold text-on-tertiary-fixed">
          {service}
        </span>
      </div>

      <div className="flex flex-col gap-space-md">
        {/* Pengirim */}
        <div className="flex items-start gap-space-sm">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">
              storefront
            </span>
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="font-label-sm text-label-sm font-bold uppercase text-text-muted">
              Pengirim
            </span>
            <span className="truncate font-label-md text-label-md font-bold text-on-surface">
              {sender.name}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {sender.city}
            </span>
          </div>
        </div>

        {/* Penerima */}
        <div className="flex items-start gap-space-sm">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <span className="material-symbols-outlined text-[18px]">
              person_pin_circle
            </span>
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="font-label-sm text-label-sm font-bold uppercase text-text-muted">
              Penerima
            </span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              {receiver.name}
            </span>
            <span className="font-body-sm text-body-sm leading-snug text-on-surface-variant">
              {receiver.address}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
          <div className="flex flex-col rounded-xl bg-surface-card p-space-sm">
            <span className="font-label-sm text-label-sm text-text-muted">
              Layanan
            </span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              {pkg.serviceName}
            </span>
            <span className="font-body-sm text-body-sm font-semibold text-success-base">
              {pkg.serviceEta}
            </span>
          </div>
          <div className="flex flex-col rounded-xl bg-surface-card p-space-sm">
            <span className="font-label-sm text-label-sm text-text-muted">
              Berat Paket
            </span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              {pkg.weight}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {pkg.dimension}
            </span>
          </div>
        </div>

        <MetaRow label="Asuransi Kiriman">
          <span className="flex items-center gap-1 font-label-sm text-label-sm font-bold text-tertiary">
            <span className="material-symbols-outlined text-[14px]">
              verified_user
            </span>
            {pkg.insurance}
          </span>
        </MetaRow>

        <MetaRow label="Instruksi Khusus">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface">
            {pkg.instruction}
          </span>
        </MetaRow>
      </div>
    </div>
  );
}
