import React from "react";
import { useSearchParams } from "react-router-dom";

export default function AiFallbackPage() {
  const [searchParams] = useSearchParams();
  const waybillParam =
    searchParams.get("waybill_number") || "33333333333333333333333333333333";
  return (
    <main className="w-full bg-surface min-h-[calc(100vh-20rem)]">
      <div className="flex flex-col w-full">
        <section className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ai-surface text-ai-accent w-fit shadow-sm border border-ai-accent/20">
                <span className="material-symbols-outlined text-[18px]">
                  cached
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  Mode Penanganan Fallback AI
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
                Paket Dalam Perjalanan (Informasi Standar)
              </h1>
              <p className="text-sm text-on-surface-variant">
                Nomor Resi:{" "}
                <strong className="font-mono text-on-surface">
                  #{waybillParam}
                </strong>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="w-full bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-border-subtle">
                <h2 className="text-base font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-ai-accent text-[22px]">
                    auto_awesome
                  </span>
                  Penjelasan Status Paket
                </h2>
                <blockquote className="text-sm text-on-surface bg-surface-container-low/70 p-4 rounded-xl leading-relaxed">
                  "Paketmu saat ini sedang dalam perjalanan dari Surabaya menuju
                  Jakarta Selatan. Pengiriman berjalan lancar dan diperkirakan
                  tiba sesuai estimasi. Sistem menyajikan informasi terbaru dari
                  manifest fisik armada."
                </blockquote>
                <p className="text-xs text-on-surface-variant mt-3">
                  Catatan: Jika narasi AI dinamis sedang diperbarui, data status
                  fisik tetap 100% akurat.
                </p>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <a
                href="/tracking-normal"
                className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2"
              >
                <span>Buka Tracking Normal Lengkap</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
