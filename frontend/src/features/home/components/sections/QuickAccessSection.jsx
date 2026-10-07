import React from "react";

/** Section halaman beranda — dipisah dari HomePage agar mudah dirawat. */
export default function QuickAccessSection() {
  return (
      <section className="w-full px-6 lg:px-12 py-10 bg-white border-y border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              className="p-5 rounded-2xl bg-surface hover:bg-surface-container-low border border-border-subtle hover:border-primary/40 transition-all flex items-center justify-between group"
              href="#"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-[#E4007D] group-hover:text-white transition-all flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">
                    travel_explore
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    Lacak Resi Instan
                  </h2>

                  <p className="text-xs text-on-surface-variant">
                    Status live &amp; posisi kurir
                  </p>
                </div>
              </div>

              <span className="material-symbols-outlined text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all text-[20px]">
                chevron_right
              </span>
            </a>

            <a
              className="p-5 rounded-2xl bg-surface hover:bg-surface-container-low border border-border-subtle hover:border-secondary/40 transition-all flex items-center justify-between group"
              href="#"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">
                    calculate
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                    Kalkulator Ongkir
                  </h2>

                  <p className="text-xs text-on-surface-variant">
                    Estimasi biaya pengiriman
                  </p>
                </div>
              </div>

              <span className="material-symbols-outlined text-text-muted group-hover:text-secondary group-hover:translate-x-1 transition-all text-[20px]">
                chevron_right
              </span>
            </a>

            <a
              className="p-5 rounded-2xl bg-surface hover:bg-surface-container-low border border-border-subtle hover:border-tertiary/40 transition-all flex items-center justify-between group"
              href="#"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/40 flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-white transition-all flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">
                    pin_drop
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-on-surface group-hover:text-tertiary transition-colors">
                    Titik Drop Point
                  </h2>

                  <p className="text-xs text-on-surface-variant">
                    Lokasi agen Satria terdekat
                  </p>
                </div>
              </div>

              <span className="material-symbols-outlined text-text-muted group-hover:text-tertiary group-hover:translate-x-1 transition-all text-[20px]">
                chevron_right
              </span>
            </a>

            <a
              className="p-5 rounded-2xl bg-surface hover:bg-surface-container-low border border-border-subtle hover:border-ai-accent/40 transition-all flex items-center justify-between group"
              href="https://wa.me/6281119612345"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-ai-surface flex items-center justify-center text-ai-accent group-hover:bg-ai-accent group-hover:text-white transition-all flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">
                    support_agent
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-on-surface group-hover:text-ai-accent transition-colors">
                    Bantuan &amp; Klaim
                  </h2>

                  <p className="text-xs text-on-surface-variant">
                    Customer Care WA 24 Jam
                  </p>
                </div>
              </div>

              <span className="material-symbols-outlined text-text-muted group-hover:text-ai-accent group-hover:translate-x-1 transition-all text-[20px]">
                chevron_right
              </span>
            </a>
          </div>
        </div>
      </section>
  );
}
