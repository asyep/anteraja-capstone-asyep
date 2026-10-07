import React from "react";
import { useSearchParams } from "react-router-dom";

export default function NotFoundPage() {
  const [searchParams] = useSearchParams();
  const waybillParam =
    searchParams.get("waybill_number") || "ffffffffffffffffffffffffffffffff";
  return (
    <main className="w-full bg-surface min-h-[calc(100vh-20rem)]">
      <div className="flex flex-col w-full">
        <section className="relative w-full max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-lg border border-border-subtle flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-error-surface text-error flex items-center justify-center mb-6 shadow-inner">
              <span className="material-symbols-outlined text-[42px]">
                search_off
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-error-surface text-error text-xs font-extrabold uppercase mb-2">
              404 · Resi Tidak Ditemukan
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-3">
              Nomor Resi Belum Terdaftar Dalam Sistem
            </h1>
            <p className="text-sm text-on-surface-variant max-w-md mb-6">
              Nomor resi{" "}
              <strong
                id="searched-waybill"
                className="font-mono text-on-surface font-bold"
              >
                #{waybillParam}
              </strong>{" "}
              tidak dapat ditemukan pada manifest Anteraja. Mohon periksa
              kembali karakter resi Anda.
            </p>
            <div className="w-full bg-surface-container-low rounded-xl p-4 text-left mb-6">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Saran Pemecahan Masalah:
              </h3>
              <ul className="text-xs text-on-surface-variant space-y-1.5 list-disc pl-4">
                <li>
                  Pastikan resi terdiri dari 13–14 digit atau 32 karakter huruf
                  dan angka.
                </li>
                <li>
                  Periksa kembali apakah nomor yang dimasukkan adalah nomor
                  resi, bukan nomor transaksi order toko.
                </li>
                <li>
                  Jika paket baru diserahkan ke kurir, beri waktu 1-2 jam untuk
                  pemindaian di Hub Pertama.
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <a
                href="/lacak"
                className="flex-1 h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  search
                </span>
                <span>Coba Nomor Resi Lain</span>
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
