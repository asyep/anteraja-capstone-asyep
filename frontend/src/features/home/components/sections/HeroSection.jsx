import React from "react";

/** Section halaman beranda — dipisah dari HomePage agar mudah dirawat. */
export default function HeroSection({ waybill, onWaybillChange, onSubmit }) {
  return (
      <section className="relative w-full pt-16 pb-20 px-6 lg:px-12 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-surface-container-low/40 to-surface">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-[#E4007D]/8 rounded-full blur-[130px] pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#E4007D] animate-ping"></span>
            Ekspedisi Pintar Masa Depan
          </div>

          <div className="flex flex-col items-center gap-4">
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] lg:leading-[54px] text-on-surface font-extrabold tracking-tight">
              Pelacakan Cerdas. Pengiriman Andal ke Seluruh Nusantara.
            </h1>

            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Pantau kiriman paket Anda secara real-time dengan asisten AI
              pintar, estimasi kedatangan presisi, dan layanan kurir Satria yang
              ramah.
            </p>
          </div>

          <div className="w-full max-w-3xl mt-2 bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-border-subtle p-4 sm:p-6 transition-all text-left">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3 mb-4">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  barcode_scanner
                </span>
                Lacak Kiriman
              </button>

              <a
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-sm font-semibold transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[18px]">
                  calculate
                </span>
                Cek Tarif Ongkir
              </a>

              <a
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-sm font-semibold transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[18px]">
                  location_on
                </span>
                Cari Drop Point
              </a>
            </div>

            <form
              className="flex flex-col sm:flex-row items-center gap-2.5"
              id="tracking-search-form"
              onSubmit={onSubmit}
            >
              <div className="relative flex-1 w-full flex items-center bg-surface-container-low border border-border-subtle rounded-2xl px-4 py-3.5 focus-within:bg-white focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(228,0,125,0.12)] transition-all">
                <span className="material-symbols-outlined text-text-muted mr-3 text-[22px]">
                  search
                </span>

                <input
                  className="w-full bg-transparent border-0 outline-none text-on-surface font-mono text-[14px] sm:text-[15px] placeholder:text-text-placeholder placeholder:font-sans"
                  id="resi-input"
                  name="waybill_number"
                  inputMode="text"
                  autoComplete="off"
                  minLength="13"
                  maxLength="32"
                  pattern="(?:[0-9]{13,14}|[A-Za-z0-9]{32})"
                  title="Masukkan resi 13–14 digit atau kode alfanumerik 32 karakter."
                  required={true}
                  aria-describedby="resi-help"
                  placeholder="Masukkan nomor resi (contoh: 1000849201994)..."
                  type="text"
                  value={waybill}
                  onChange={(event) => onWaybillChange(event.target.value)}
                />
              </div>

              <button
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#E4007D] text-white hover:bg-primary-hover font-bold text-sm shadow-[0_4px_16px_rgba(228,0,125,0.25)] flex items-center justify-center gap-2 transition-all whitespace-nowrap"
                type="submit"
              >
                <span>Lacak Paket</span>

                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </button>
            </form>

            <p id="resi-help" className="mt-2 text-xs text-text-muted">
              Masukkan resi 13–14 digit atau kode alfanumerik 32 karakter, lalu
              tekan Lacak Paket untuk membuka status yang sesuai.
            </p>

            <div className="mt-4 pt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-text-muted font-medium">
                Uji Coba Resi:
              </span>

              <a
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-primary/10 hover:text-primary font-mono text-on-surface transition-colors"
                href="/tracking-normal?waybill_number=10008492019948271039485729103948"
              >
                #1000849201994
                <span className="text-[10px] text-text-muted font-sans">
                  (In-Transit)
                </span>
              </a>

              <a
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-primary/10 hover:text-primary font-mono text-on-surface transition-colors"
                href="/tracking-live?waybill_number=1000921477821"
              >
                #1000921477821
                <span className="text-[10px] text-text-muted font-sans">
                  (Live Map)
                </span>
              </a>

              <a
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-primary/10 hover:text-primary font-mono text-on-surface transition-colors"
                href="/tracking?waybill_number=1000781293812"
              >
                #1000781293812
                <span className="text-[10px] text-text-muted font-sans">
                  (Peringatan Jalur)
                </span>
              </a>
            </div>

            <div className="mt-4 pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant font-medium">
              <div className="flex items-center gap-1.5 text-tertiary">
                <span className="material-symbols-outlined text-[16px]">
                  check_circle
                </span>

                <span>Real-time Telemetry Active</span>
              </div>

              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  verified_user
                </span>

                <span>Bebas Akses Tanpa Login</span>
              </div>

              <div className="flex items-center gap-1.5 text-text-muted">
                <span className="material-symbols-outlined text-[16px]">
                  storefront
                </span>

                <span>
                  Didukung Shopee, Tokopedia, TikTok Shop &amp; Reguler
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
