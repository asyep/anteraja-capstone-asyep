import React from "react";

/** Section halaman beranda — dipisah dari HomePage agar mudah dirawat. */
export default function FaqSection() {
  return (
      <section className="w-full px-6 lg:px-12 py-20 bg-surface-container-low border-t border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full w-fit">
                PUSAT BANTUAN &amp; FAQ
              </span>

              <h2 className="text-2xl sm:text-3xl text-on-surface font-extrabold">
                Pertanyaan yang Sering Diajukan
              </h2>

              <p className="text-sm text-on-surface-variant">
                Panduan cepat seputar cara pelacakan resi dan penanganan kendala
                paket Anda.
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              <article className="p-5 rounded-2xl bg-white border border-border-subtle shadow-xs flex flex-col gap-2">
                <header className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    help
                  </span>

                  <h3 className="text-sm sm:text-base text-on-surface font-bold">
                    1. Kapan status nomor resi mulai aktif dan bisa dilacak di
                    sistem?
                  </h3>
                </header>

                <p className="text-xs sm:text-sm text-on-surface-variant pl-9 leading-relaxed">
                  Nomor resi langsung aktif dan dapat dilacak segera setelah
                  kurir Satria melakukan penjemputan (pick-up scan) atau saat
                  paket diserahkan di loket drop point resmi Anteraja (umumnya
                  15–30 menit setelah proses pemindaian pertama).
                </p>
              </article>

              <article className="p-5 rounded-2xl bg-white border border-border-subtle shadow-xs flex flex-col gap-2">
                <header className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    schedule
                  </span>

                  <h3 className="text-sm sm:text-base text-on-surface font-bold">
                    2. Bagaimana jika paket belum tiba melewati estimasi waktu
                    (ETA)?
                  </h3>
                </header>

                <p className="text-xs sm:text-sm text-on-surface-variant pl-9 leading-relaxed">
                  Jika status resi Anda tidak mengalami pergerakan lebih dari 24
                  jam atau telah melewati estimasi tanggal tiba, Anda dapat
                  menekan tombol Chat WhatsApp CS atau menu klaim keterlambatan
                  agar tim operasional hub melakukan pengantaran prioritas.
                </p>
              </article>

              <article className="p-5 rounded-2xl bg-white border border-border-subtle shadow-xs flex flex-col gap-2">
                <header className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    chat
                  </span>

                  <h3 className="text-sm sm:text-base text-on-surface font-bold">
                    3. Apakah kurir Satria akan menghubungi saya sebelum
                    pengantaran?
                  </h3>
                </header>

                <p className="text-xs sm:text-sm text-on-surface-variant pl-9 leading-relaxed">
                  Ya, kurir Satria memiliki prosedur standar operasional resmi
                  untuk mengirimkan sapaan ramah via WhatsApp atau SMS sebelum
                  menuju ke lokasi Anda guna memastikan keberadaan penerima di
                  tempat.
                </p>
              </article>

              <article className="p-5 rounded-2xl bg-white border border-border-subtle shadow-xs flex flex-col gap-2">
                <header className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    home
                  </span>

                  <h3 className="text-sm sm:text-base text-on-surface font-bold">
                    4. Bagaimana jika saya sedang tidak berada di rumah saat
                    paket diantar?
                  </h3>
                </header>

                <p className="text-xs sm:text-sm text-on-surface-variant pl-9 leading-relaxed">
                  Anda dapat membalas chat WhatsApp kurir Satria untuk
                  menitipkan paket kepada anggota keluarga, security, tetangga
                  terpercaya, atau meminta jadwal pengantaran ulang pada
                  keesokan harinya tanpa biaya tambahan.
                </p>
              </article>
            </div>
          </div>

          <aside className="w-full lg:w-96 p-8 rounded-3xl bg-white border border-border-subtle shadow-sm flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[32px]">
                support_agent
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Layanan CS Siaga 24 Jam
              </span>

              <h3 className="text-xl font-bold text-on-surface mt-1">
                Butuh Bantuan Langsung?
              </h3>

              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Tim Anteraja Care siap membantu pengecekan resi, kendala antaran
                kurir, perubahan alamat, hingga klaim paket kapan saja.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-border-subtle text-xs">
              <div className="flex items-center gap-2 text-on-surface font-medium">
                <span className="material-symbols-outlined text-success-base text-[18px]">
                  verified
                </span>

                <span>Respon cepat di bawah 3 menit</span>
              </div>

              <div className="flex items-center gap-2 text-on-surface font-medium">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  call
                </span>

                <span>Call Center: (021) 5060 3333</span>
              </div>

              <div className="flex items-center gap-2 text-on-surface font-medium">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  mail
                </span>

                <span>cs@anteraja.id</span>
              </div>
            </div>

            <a
              className="w-full py-3.5 rounded-2xl bg-[#E4007D] hover:bg-primary-hover text-white text-sm font-bold text-center shadow-[0_4px_14px_rgba(228,0,125,0.25)] transition-all flex items-center justify-center gap-2"
              href="https://wa.me/6281119612345"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">
                chat
              </span>

              <span>Chat WhatsApp Customer Care</span>
            </a>
          </aside>
        </div>
      </section>
  );
}
