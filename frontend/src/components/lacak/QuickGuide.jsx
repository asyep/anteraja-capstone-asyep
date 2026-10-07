import React from "react";
import { TRACKING_STEPS } from "../../data/lacakContent";
import SectionHeading from "./SectionHeading";

export default function QuickGuide() {
  return (
    <section className="relative mb-16 overflow-hidden rounded-xl bg-surface-container-low p-8 md:p-12">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />

      <SectionHeading
        align="left"
        className="mb-10"
        description="Hanya butuh tiga langkah simpel untuk mengetahui keberadaan barang Anda sampai ke tangan penerima."
        eyebrow="Panduan Kilat"
        eyebrowClassName="text-secondary"
        title="Cara Mudah Melacak Paket"
      />

      <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        {TRACKING_STEPS.map((step) => (
          <article
            className="flex flex-col rounded-xl bg-surface-container-lowest p-6 shadow-sm"
            key={step.id}
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className={`font-headline-xl text-headline-xl font-extrabold ${step.numberClassName}`}
              >
                {step.number}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${step.iconClassName}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {step.icon}
                </span>
              </div>
            </div>
            <h3 className="mb-2 font-headline-sm text-headline-sm font-bold text-on-surface">
              {step.title}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
