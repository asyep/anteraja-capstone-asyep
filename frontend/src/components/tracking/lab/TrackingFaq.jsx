import React from "react";
import { TRACKING_FAQ } from "@/data/lacakContent";

export default function TrackingFaq() {
  return (
    <div className="space-y-4">
      <h2 className="mb-2 font-headline-sm text-headline-sm font-bold text-on-surface">
        Pertanyaan Populer Seputar Resi
      </h2>

      {TRACKING_FAQ.map((item) => (
        <details
          className="group cursor-pointer rounded-xl border border-border-subtle bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md"
          key={item.id}
        >
          <summary className="flex list-none items-center justify-between gap-3 font-label-lg text-label-lg font-bold text-on-surface">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">
                help
              </span>
              {item.question}
            </span>
            <span className="material-symbols-outlined shrink-0 text-on-surface-variant transition-transform group-open:rotate-180">
              expand_more
            </span>
          </summary>
          <div className="mt-3 pl-7 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
