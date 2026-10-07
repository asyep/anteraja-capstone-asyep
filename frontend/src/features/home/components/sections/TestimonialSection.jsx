import React from "react";

/** Section halaman beranda — dipisah dari HomePage agar mudah dirawat. */
export default function TestimonialSection() {
  return (
      <section className="w-full px-6 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="w-full bg-white rounded-3xl p-8 lg:p-12 border border-border-subtle shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex-shrink-0 relative">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-sm border-2 border-border-subtle bg-surface">
              <img
                alt="Satria Anteraja"
                className="w-full h-full object-cover object-center"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Vctw_qF3mxbNifTxAQVSYGcMaAS2QsLK2Wh7MB4rOrJEAHAb6xB6uINRAQaVEFS-ewv3IIdVOqiAIzTK6HxVUhLEkcrAQiOF4nkcbgzeTMlXu0GOxudbl2cCd7X5ErCpfJh6TrgVY37lqI5R3vDE_4NxNkI53ZiNhy39RMi5DsIuypNAQ0fxsIVKw5ig48hfwvZwRIwiFEcM_5nkfaZtbseG-4rkjeSS40rrWiOVPsWO-RU_1MGe6dlZy5"
              />
            </div>

            <div className="absolute -bottom-3 -right-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                verified
              </span>
              Satria Teladan
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="inline-flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <span className="material-symbols-outlined text-[18px]">
                  star
                </span>

                <span>4.98 / 5.0 Rating Kepuasan</span>
              </div>

              <span className="text-xs text-on-surface-variant font-medium">
                Didukung 24.000+ Kurir Satria Berdedikasi
              </span>
            </div>

            <blockquote className="text-lg sm:text-xl text-on-surface italic font-semibold leading-relaxed">
              “Bagi kami para Satria, setiap paket bukan sekadar nomor resi di
              aplikasi, melainkan amanah bernilai dan senyuman nyata pelanggan
              di seberang pintu rumah.”
            </blockquote>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 text-on-surface-variant text-xs">
              <span className="font-bold text-on-surface text-sm">
                Dimas Suryo Pratama
              </span>

              <span className="hidden sm:inline">•</span>

              <span>
                Satria Terbaik Jakarta Selatan (4 Tahun Mengabdi di Anteraja)
              </span>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col gap-2.5 w-full sm:w-auto">
            <a
              className="px-7 py-3.5 rounded-2xl bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed font-bold text-sm text-center transition-all shadow-xs"
              href="#"
            >
              Gabung Menjadi Mitra Satria
            </a>

            <span className="text-[11px] text-text-muted text-center">
              Benefit harian, insentif performa &amp; asuransi lengkap
            </span>
          </div>
        </div>
      </section>
  );
}
