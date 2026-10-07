import React from "react";

/** Section halaman beranda — dipisah dari HomePage agar mudah dirawat. */
export default function FeaturesSection() {
  return (
      <section className="w-full px-6 lg:px-12 py-20 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col gap-14">
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1 rounded-full">
              INOVASI PELACAKAN LOGISTIK
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-on-surface font-extrabold tracking-tight">
              Teknologi Cerdas yang Memberi Rasa Tenang
            </h2>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Kami merevolusi pengalaman lacak resi konvensional dengan machine
              learning, narasi natural, dan akurasi tinggi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="p-8 rounded-3xl bg-white border border-border-subtle shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[30px]">
                      auto_awesome
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                    Satria AI Assistant
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-on-surface">
                    Smart AI Status Narrative
                  </h3>

                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Menerjemahkan kode manifest teknis gudang yang rumit menjadi
                    penjelasan bahasa manusia yang santun, empatik, dan mudah
                    dipahami siapa saja.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low border border-border-subtle flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>

                    <span className="text-xs font-bold text-on-surface">
                      Pesan Satria AI:
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant italic bg-white p-3 rounded-xl border border-border-subtle leading-relaxed">
                    “Halo Kak! Paketmu sudah selesai disortir di Gateway Halim
                    dan saat ini sedang dibawa Satria Dimas menuju alamat
                    tujuanmu.”
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border-subtle flex items-center gap-2 text-primary text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">
                  check_circle
                </span>

                <span>
                  Bebas dari istilah manifest rumit &amp; membingungkan
                </span>
              </div>
            </article>

            <article className="p-8 rounded-3xl bg-white border border-border-subtle shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[30px]">
                      timer
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary font-bold text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                    Live Telemetry
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-on-surface">
                    Live Telemetri &amp; Prediksi ETA Akurat
                  </h3>

                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Machine learning menghitung jendela waktu kedatangan paket
                    presisi 30 menit berdasarkan rute pengantaran Satria dan
                    lalu lintas terkini.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low border border-border-subtle flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted font-medium">
                      Perkiraan Tiba Hari Ini:
                    </span>

                    <span className="font-bold text-tertiary">
                      Akurasi 98.8%
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-border-subtle flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary text-[24px]">
                      electric_moped
                    </span>

                    <div>
                      <div className="text-sm font-extrabold text-on-surface">
                        14:15 - 14:45 WIB
                      </div>

                      <div className="text-[11px] text-on-surface-variant">
                        Sisa 3 paket sebelum giliran antaran Anda
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border-subtle flex items-center gap-2 text-tertiary text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">
                  verified
                </span>

                <span>Jaminan presisi estimasi waktu ketibaan</span>
              </div>
            </article>

            <article className="p-8 rounded-3xl bg-white border border-border-subtle shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-fixed/40 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[30px]">
                      notifications_active
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-secondary-fixed text-secondary font-bold text-xs">
                    Pencegahan Dini
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-on-surface">
                    Peringatan Operasional &amp; Sapaan WA
                  </h3>

                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    Informasi otomatis bila ada kendala cuaca ekstrem atau
                    penutupan jalan, sapaan WhatsApp resmi sebelum kurir tiba,
                    serta bukti e-POD.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low border border-border-subtle flex flex-col gap-2">
                  <div className="bg-white p-3 rounded-xl border border-border-subtle flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-success-base text-[20px] flex-shrink-0">
                      chat
                    </span>

                    <div>
                      <div className="text-xs font-bold text-on-surface">
                        Notifikasi WhatsApp Resmi:
                      </div>

                      <div className="text-[11px] text-on-surface-variant leading-snug mt-0.5">
                        “Satria Dimas sedang menuju rumah Kakak. Mohon pastikan
                        ada penerima ya!”
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold p-2 rounded-lg flex items-center gap-1.5 border border-emerald-200">
                    <span className="material-symbols-outlined text-[16px]">
                      verified
                    </span>

                    <span>Bukti e-POD bergeotag GPS &amp; foto digital</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border-subtle flex items-center gap-2 text-secondary text-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">
                  verified_user
                </span>

                <span>Transparansi serah terima fisik &amp; digital</span>
              </div>
            </article>
          </div>
        </div>
      </section>
  );
}
