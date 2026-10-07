import React from "react";
import { useSearchParams } from "react-router-dom";

export default function CanceledPage() {
  const [searchParams] = useSearchParams();
  const waybillParam =
    searchParams.get("waybill_number") || "22222222222222222222222222222222";
  return (
    <main className="w-full bg-surface min-h-[calc(100vh-20rem)]">
      <div className="flex flex-col w-full">
        <section className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-surface text-error w-fit shadow-sm border border-error-base/30">
                <span className="material-symbols-outlined text-[18px]">
                  cancel
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  Pengiriman Dibatalkan
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
                Status Resi: Dibatalkan Pemesan / Merchant
              </h1>
              <p className="text-sm text-on-surface-variant">
                Nomor Resi:{" "}
                <strong className="font-mono text-on-surface">
                  #{waybillParam}
                </strong>
              </p>
            </div>
          </div>
          <div className="w-full bg-error-surface rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-error-base/30 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-error text-white flex items-center justify-center shadow-md shrink-0">
                <span className="material-symbols-outlined text-[26px]">
                  block
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-error uppercase tracking-wider">
                  Progres Pengiriman Dihentikan
                </span>
                <span className="text-lg font-bold text-on-surface">
                  Pesanan ini telah dibatalkan oleh pengirim/merchant pada 22
                  September 2026, 17:00 WIB.
                </span>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-error text-white text-xs font-bold shrink-0">
              Dibatalkan
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-border-subtle">
                <h2 className="text-base font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[22px]">
                    info
                  </span>
                  Penjelasan Status Dibatalkan
                </h2>
                <p className="text-sm text-on-surface bg-surface-container-low/70 p-4 rounded-xl leading-relaxed">
                  "Pengiriman untuk nomor resi {waybillParam} ini telah
                  dibatalkan atas permintaan pihak pengirim sebelum paket
                  diserahkan ke kurir Satria. Silakan hubungi penjual atau
                  merchant toko untuk informasi pengembalian dana atau pembuatan
                  pesanan baru."
                </p>
              </div>
              <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-border-subtle">
                <h2 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    history
                  </span>
                  Riwayat Transaksi
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3 items-start border-l-2 border-error pl-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-error">
                        Pengiriman Dibatalkan
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        22 Sep 2026, 17:00 WIB · Dibatalkan oleh sistem merchant
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start border-l-2 border-border-subtle pl-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">
                        Pesanan Dibuat
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        22 Sep 2026, 16:00 WIB · Permintaan pickup disetujui
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-border-subtle flex flex-col gap-3">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">
                  Butuh Bantuan?
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Jika Anda merasa tidak mengajukan pembatalan, silakan buka
                  pusat bantuan Anteraja.
                </p>
                <a
                  href="/bantuan"
                  className="w-full h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Pusat Bantuan Anteraja</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </a>
              </div>
              <a
                href="/lacak"
                className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  search
                </span>
                <span>Lacak Nomor Resi Lain</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
