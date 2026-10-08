import React from "react";
import { useSearchParams } from "react-router-dom";

export default function DeliveredPage() {
  const [searchParams] = useSearchParams();
  const waybillParam =
    searchParams.get("waybill_number") || "11111111111111111111111111111111";
  return (
    <main className="w-full bg-surface min-h-[calc(100vh-20rem)]">
      <div className="flex flex-col w-full">
        <section className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-surface text-tertiary w-fit shadow-sm border border-success-base/30">
                <span className="material-symbols-outlined text-[18px]">
                  task_alt
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  Pengiriman Berhasil Selesai
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
                Paket Telah Tiba Di Tujuan
              </h1>
              <p className="text-sm text-on-surface-variant">
                Nomor Resi:{" "}
                <strong className="font-mono text-on-surface">
                  #{waybillParam}
                </strong>
              </p>
            </div>
          </div>
          <div className="w-full bg-success-surface rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-success-base/30 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-tertiary text-white flex items-center justify-center shadow-md shrink-0">
                <span className="material-symbols-outlined text-[26px]">
                  check_circle
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-tertiary uppercase tracking-wider">
                  Status Akhir Pengiriman
                </span>
                <span className="text-lg font-bold text-on-surface">
                  Diterima oleh Budi (Penerima Langsung) pada 25 September 2026,
                  14:20 WIB
                </span>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-tertiary text-white text-xs font-bold shrink-0">
              TerkonfirmasiPOD
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-border-subtle">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md bg-secondary-container shrink-0">
                    <img
                      alt="Satria Avatar"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida/AEtjO1Vctw_qF3mxbNifTxAQVSYGcMaAS2QsLK2Wh7MB4rOrJEAHAb6xB6uINRAQaVEFS-ewv3IIdVOqiAIzTK6HxVUhLEkcrAQiOF4nkcbgzeTMlXu0GOxudbl2cCd7X5ErCpfJh6TrgVY37lqI5R3vDE_4NxNkI53ZiNhy39RMi5DsIuypNAQ0fxsIVKw5ig48hfwvZwRIwiFEcM_5nkfaZtbseG-4rkjeSS40rrWiOVPsWO-RU_1MGe6dlZy5"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-on-surface">
                        Satria Assistant
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
                        Pengantaran Selesai
                      </span>
                    </div>
                    <p className="text-sm text-on-surface bg-surface-container-low/70 p-4 rounded-xl leading-relaxed">
                      "Halo Kak! Paketmu sudah berhasil diserahkan langsung
                      kepada penerima di alamat Tebet Barat pada tanggal 25
                      September 2026 pukul 14:20 WIB. Bukti serah terima foto
                      (POD) telah terverifikasi aman oleh sistem Anteraja.
                      Terima kasih telah mempercayakan pengirimanmu kepada
                      Anteraja!"
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-border-subtle">
                <h2 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[22px]">
                    verified
                  </span>
                  Tahapan Pengiriman Selesai (4/4)
                </h2>
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-success-surface border border-success-base/30 flex flex-col gap-1">
                    <span className="text-xs font-bold text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        check
                      </span>
                      Pesanan Dibuat
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      20 Sep 2026, 19:00
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-success-surface border border-success-base/30 flex flex-col gap-1">
                    <span className="text-xs font-bold text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        check
                      </span>
                      Diproses Hub
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      21 Sep 2026, 18:00
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-success-surface border border-success-base/30 flex flex-col gap-1">
                    <span className="text-xs font-bold text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        check
                      </span>
                      Dalam Perjalanan
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      23 Sep 2026, 16:30
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-tertiary text-white flex flex-col gap-1 shadow-sm">
                    <span className="text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        done_all
                      </span>
                      Telah Diterima
                    </span>
                    <span className="text-[11px] text-white/90">
                      25 Sep 2026, 14:20
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-border-subtle">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4 border-b border-border-subtle pb-2">
                  Rincian Paket
                </h3>
                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Layanan</span>
                    <span className="font-bold text-on-surface">
                      Anteraja Reguler
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Kota Asal</span>
                    <span className="font-bold text-on-surface">Surabaya</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Tujuan</span>
                    <span className="font-bold text-on-surface">
                      Jakarta Selatan
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Penerima</span>
                    <span className="font-bold text-on-surface">
                      Budi (Verified POD)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      Biaya Ongkir
                    </span>
                    <span className="font-bold text-tertiary">
                      Rp 10.000 (Gratis Ongkir)
                    </span>
                  </div>
                </div>
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
