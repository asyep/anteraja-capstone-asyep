import React from "react";

/** Section halaman beranda — dipisah dari HomePage agar mudah dirawat. */
export default function PricingSection() {
  return (
      <section className="w-full px-6 lg:px-12 py-20 bg-surface-container-low border-t border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full w-fit">
                LAYANAN PENGIRIMAN
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-on-surface font-extrabold tracking-tight">
                Kirim Tepat Waktu Sesuai Kebutuhan Anda
              </h2>

              <p className="text-sm sm:text-base text-on-surface-variant">
                Pilihan lengkap dengan tarif transparan, jangkauan luas
                se-Indonesia, dan kepastian perlindungan paket.
              </p>
            </div>

            <a
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
              href="#"
            >
              <span>Bandingkan Semua Tarif Lengkap</span>

              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <article className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-md border border-border-subtle transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">
                      inventory_2
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    Ekonomis
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-on-surface">
                    Anteraja Reguler
                  </h3>

                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Solusi ideal untuk kebutuhan belanja online marketplace dan
                    kiriman personal harian.
                  </p>
                </div>

                <ul className="text-xs text-on-surface-variant space-y-2 pt-2 border-t border-border-subtle">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      schedule
                    </span>

                    <span>Estimasi 2–3 Hari Kerja</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      map
                    </span>

                    <span>Cakupan seluruh Indonesia</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      done
                    </span>

                    <span>Bebas biaya pick-up</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">
                    Mulai Dari
                  </span>

                  <span className="text-lg font-bold text-primary">
                    Rp 9.000
                    <span className="text-xs font-normal text-on-surface-variant">
                      /kg
                    </span>
                  </span>
                </div>

                <a
                  className="w-full py-2.5 rounded-xl bg-surface hover:bg-surface-container text-on-surface text-xs font-bold text-center border border-border-subtle transition-colors"
                  href="#"
                >
                  Cek Ongkir Reguler
                </a>
              </div>
            </article>

            <article className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-md border border-border-subtle transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-fixed/40 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[28px]">
                      alarm_on
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-fixed/50 text-secondary">
                    Garansi Esok
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-on-surface">
                    Next Day
                  </h3>

                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Paket esensial Anda terjamin tiba esok hari dengan komitmen
                    garansi ongkir kembali.
                  </p>
                </div>

                <ul className="text-xs text-on-surface-variant space-y-2 pt-2 border-t border-border-subtle">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">
                      verified
                    </span>

                    <span>Pasti Sampai 24 Jam</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">
                      monetization_on
                    </span>

                    <span>Garansi ongkir uang kembali</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">
                      priority_high
                    </span>

                    <span>Prioritas sortasi gateway</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">
                    Mulai Dari
                  </span>

                  <span className="text-lg font-bold text-secondary">
                    Rp 15.000
                    <span className="text-xs font-normal text-on-surface-variant">
                      /kg
                    </span>
                  </span>
                </div>

                <a
                  className="w-full py-2.5 rounded-xl bg-surface hover:bg-surface-container text-on-surface text-xs font-bold text-center border border-border-subtle transition-colors"
                  href="#"
                >
                  Cek Ongkir Next Day
                </a>
              </div>
            </article>

            <article className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-md border border-primary/30 transition-all flex flex-col justify-between relative ring-1 ring-primary/20">
              <div className="absolute -top-3 right-6 bg-[#E4007D] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                Populer
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">
                      electric_moped
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    Kilat &lt; 8 Jam
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-on-surface">
                    Same Day
                  </h3>

                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Pengiriman super kilat hitungan jam untuk dokumen penting,
                    hampers, atau kuliner segar.
                  </p>
                </div>

                <ul className="text-xs text-on-surface-variant space-y-2 pt-2 border-t border-border-subtle">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      bolt
                    </span>

                    <span>Tiba dalam waktu &lt; 8 Jam</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      my_location
                    </span>

                    <span>Live tracking GPS kurir</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      call
                    </span>

                    <span>Kontak kurir langsung</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">
                    Mulai Dari
                  </span>

                  <span className="text-lg font-bold text-primary">
                    Rp 20.000
                    <span className="text-xs font-normal text-on-surface-variant">
                      /kg
                    </span>
                  </span>
                </div>

                <a
                  className="w-full py-2.5 rounded-xl bg-[#E4007D] text-white hover:bg-primary-hover text-xs font-bold text-center transition-colors shadow-xs"
                  href="#"
                >
                  Pesan Same Day
                </a>
              </div>
            </article>

            <article className="p-6 rounded-3xl bg-white shadow-sm hover:shadow-md border border-border-subtle transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[28px]">
                      local_shipping
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-tertiary-fixed/40 text-tertiary">
                    Paket Berat (&gt;10kg)
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-on-surface">
                    Anteraja Kargo
                  </h3>

                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Biaya paling hemat untuk pengiriman volume besar, peralatan
                    elektronik, koper, dan logistik UMKM.
                  </p>
                </div>

                <ul className="text-xs text-on-surface-variant space-y-2 pt-2 border-t border-border-subtle">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">
                      scale
                    </span>

                    <span>Minimum berat hanya 10 kg</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">
                      pallet
                    </span>

                    <span>Handling khusus kargo aman</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">
                      local_convenience_store
                    </span>

                    <span>Penjemputan armada roda empat</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">
                    Mulai Dari
                  </span>

                  <span className="text-lg font-bold text-tertiary">
                    Rp 3.500
                    <span className="text-xs font-normal text-on-surface-variant">
                      /kg
                    </span>
                  </span>
                </div>

                <a
                  className="w-full py-2.5 rounded-xl bg-surface hover:bg-surface-container text-on-surface text-xs font-bold text-center border border-border-subtle transition-colors"
                  href="#"
                >
                  Cek Ongkir Kargo
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
  );
}
