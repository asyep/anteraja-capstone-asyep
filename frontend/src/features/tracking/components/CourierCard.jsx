/**
 * Kartu "Satria Bertugas" — kurir pengantaran akhir belum dialokasikan,
 * jadi tombol Hubungi & Pesan Kilat masih nonaktif.
 */
export default function CourierCard({ courier }) {
  return (
    <div className="flex w-full flex-col gap-space-md rounded-2xl border border-border-subtle/50 bg-surface-container-lowest p-space-lg shadow-lg">
      <div className="flex items-center justify-between border-b border-border-subtle/50 pb-space-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-text-muted">
            badge
          </span>
          <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
            Satria Bertugas
          </h3>
        </div>
        <span className="rounded-full bg-surface-container px-2.5 py-0.5 font-mono-code text-label-sm font-bold text-text-muted">
          {courier.idLabel}
        </span>
      </div>

      <div className="flex items-center gap-space-md">
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-surface-container-high text-text-muted shadow-sm">
            <span className="material-symbols-outlined text-[36px] text-text-placeholder">
              two_wheeler
            </span>
          </div>
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

      <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-2.5 py-1 font-label-sm text-label-sm font-semibold text-text-muted">
        <span className="h-2 w-2 rounded-full bg-text-placeholder" />
        {courier.standbyNote}
      </div>

      <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
        <button
          className="flex h-11 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl bg-surface-container-high px-space-sm font-label-md text-label-md font-bold text-text-placeholder opacity-60"
          disabled
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] text-text-placeholder">
            call
          </span>
          Hubungi
        </button>
        <button
          className="flex h-11 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl bg-surface-container-high px-space-sm font-label-md text-label-md font-bold text-text-placeholder opacity-60"
          disabled
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          Pesan Kilat
        </button>
      </div>
    </div>
  );
}
