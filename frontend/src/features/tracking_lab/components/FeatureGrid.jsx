import React from "react";
import { TRACKING_FEATURES } from "@/features/tracking_lab/data/lacakContent";
import SectionHeading from "@/features/tracking_lab/components/SectionHeading";

export default function FeatureGrid() {
  return (
    <section className="mb-16" aria-labelledby="fitur-pelacakan-pintar">
      <SectionHeading
        className="mb-10"
        description="Dirancang khusus untuk menghapus kekhawatiran paket Anda melalui integrasi teknologi GPS armada dan kecerdasan buatan."
        eyebrow="Kecerdasan Logistik"
        title="Fitur Pelacakan Pintar Generasi Baru"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {TRACKING_FEATURES.map((feature) => (
          <article
            className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-6 shadow-sm transition-all group hover:shadow-md"
            key={feature.id}
          >
            <div>
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${feature.iconClassName}`}
              >
                <span className="material-symbols-outlined text-[28px]">
                  {feature.icon}
                </span>
              </div>
              <h3 className="mb-2 font-headline-sm text-headline-sm font-bold text-on-surface">
                {feature.title}
              </h3>
              <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                {feature.description}
              </p>
            </div>
            <div
              className={`mt-6 flex items-center gap-1 font-label-md text-label-md font-bold ${feature.ctaClassName}`}
            >
              <span>{feature.cta}</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
