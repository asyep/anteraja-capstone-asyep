import React from "react";
import { Link } from "react-router-dom";

export default function TelemetryStrip() {
  return (
    <section
      aria-label="Status jaringan telemetri Satria"
      className="mb-10 flex flex-col items-start justify-between gap-6 rounded-xl border border-border-subtle bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container-low p-6 shadow-sm md:flex-row md:items-center md:p-8"
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-primary shadow-inner">
          <span className="material-symbols-outlined text-[32px]">radar</span>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Jaringan Satria AI Telemetry Aktif
            </h2>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-success-base opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success-base" />
            </span>
          </div>
          <p className="max-w-2xl font-body-md text-body-md text-on-surface-variant">
            Lebih dari 45.000 armada Satria terhubung real-time dengan
            pemantauan algoritma rute dinamis, menjamin kepastian status
            pengiriman tanpa tebak-tebakan.
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-start gap-6 rounded-xl border border-border-subtle bg-surface-container-lowest/80 p-4 shadow-sm md:w-auto md:justify-end">
        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md font-extrabold text-primary">
            99.2%
          </span>
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
            Ketepatan Waktu
          </span>
        </div>
        <div className="h-8 w-px bg-surface-container-high" />
        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md font-extrabold text-secondary">
            {"<"} 15 dtk
          </span>
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
            Sinkronisasi GPS
          </span>
        </div>
      </div>
    </section>
  );
}

export function LacakBreadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-1 font-label-md text-label-md text-on-surface-variant"
    >
      <Link
        className="flex items-center gap-1 transition-colors hover:text-primary"
        to="/"
      >
        <span className="material-symbols-outlined text-[16px]">home</span>
        Beranda
      </Link>
      <span className="text-text-placeholder">/</span>
      <span className="font-bold text-primary">Lacak Kiriman</span>
      <span className="ml-2 hidden items-center gap-1 rounded-full bg-ai-surface px-2 py-0.5 font-label-sm text-label-sm font-bold text-ai-accent sm:inline-flex">
        <span className="material-symbols-outlined text-[14px]">
          auto_awesome
        </span>
        Satria AI Telemetry
      </span>
    </nav>
  );
}
