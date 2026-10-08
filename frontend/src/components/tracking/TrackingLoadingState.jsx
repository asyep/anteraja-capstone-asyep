import React from "react";

/** Tampilan memuat data pelacakan dari API (dipakai resolver & halaman tracking). */
export default function TrackingLoadingState({ waybill }) {
  return (
    <div
      aria-live="polite"
      className="flex flex-col w-full min-h-[calc(100vh-20rem)] bg-surface"
      role="status"
    >
      <section className="w-full max-w-[800px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-lg border border-border-subtle flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-inner animate-spin">
            <span className="material-symbols-outlined text-[36px]">sync</span>
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface mb-2">
            Memuat Data Pelacakan
          </h1>
          <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
            Mengambil status terbaru
            {waybill ? (
              <>
                {" "}untuk resi <strong className="font-mono text-on-surface">#{waybill}</strong>
              </>
            ) : null}
            ...
          </p>
          <div className="mt-6 w-full max-w-md flex flex-col gap-2">
            <div className="h-3 rounded-full bg-surface-container-high animate-pulse" />
            <div className="h-3 w-3/4 mx-auto rounded-full bg-surface-container-high animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  );
}
