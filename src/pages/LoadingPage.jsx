import React from "react";
import { Link } from "react-router-dom";

export default function LoadingPage() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-74px)] bg-[#fcf9f8]">
      <section className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5E7EB] flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#b30069]/10 text-[#b30069] flex items-center justify-center mb-6 shadow-inner animate-spin">
            <span className="material-symbols-outlined text-[36px]">sync</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#b30069]/10 text-[#b30069] text-xs font-extrabold uppercase mb-2">
            Simulasi Loading Telemetri
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] mb-3">
            Sistem Sedang Memproses Pencarian
          </h1>
          <p className="text-sm text-[#5a3f49] max-w-md mb-6 leading-relaxed">
            Menghubungkan ke jaringan Satria AI Telemetry untuk mengambil data
            posisi paket terbaru...
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Link
              to="/tracking-normal"
              className="flex-1 h-12 rounded-xl bg-[#b30069] text-white font-bold text-sm shadow-md hover:bg-[#e00085] transition-all flex items-center justify-center gap-2"
            >
              <span>Lihat Hasil Pelacakan Demo</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
            <Link
              to="/lacak"
              className="flex-1 h-12 rounded-xl bg-[#f0eded] text-[#1c1b1b] font-bold text-sm hover:bg-[#eae7e7] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                search
              </span>
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
