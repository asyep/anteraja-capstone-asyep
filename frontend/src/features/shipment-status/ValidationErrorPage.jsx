import React from "react";

export default function ValidationErrorPage() {
  return (
    <main className="w-full bg-surface min-h-[calc(100vh-20rem)]">
      <div className="flex flex-col w-full">
        <section className="relative w-full max-w-[800px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-lg border border-border-subtle flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-warning-surface text-warning-base flex items-center justify-center mb-6 shadow-inner">
              <span className="material-symbols-outlined text-[36px]">
                warning
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-warning-surface text-secondary text-xs font-extrabold uppercase mb-2">
              400 · Format Resi Tidak Sesuai
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-3">
              Format Resi Perlu Diperiksa
            </h1>
            <p className="text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
              Nomor resi yang dimasukkan memiliki format yang tidak sesuai.
              Masukkan 13–14 digit angka atau 32 karakter huruf dan angka.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <a
                href="/lacak"
                className="flex-1 h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  search
                </span>
                <span>Ketik Ulang Resi</span>
              </a>
              <a
                href="/bantuan"
                className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-bold text-sm hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  help
                </span>
                <span>Pusat Bantuan</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
