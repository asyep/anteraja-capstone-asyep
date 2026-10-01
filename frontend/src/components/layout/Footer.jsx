import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#E5E7EB] text-[#5a3f49]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Contact Block */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Link to="/">
                <img
                  alt="Anteraja"
                  className="h-8 w-auto object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPPf6qGq-Zr5MtoSPI_IjEAsNa8dHslQycOXhNyUdWu-LvXw3V2gpmL5im-tGSWWGJai3NTCIeElX87nSwEa9c9z8sr22zJX2OWWris4_f2wpmtu_Dkb2EJQsN7qnn26WQqfM79RAFggsIEx_Js8CXBpkEh7bcsA_tLZ72TZltAYFOkFG4R3fRvxR_bHXd4DI30bERH9hbIuRjD1gVUQyx0Ya9v1VRwozrSFfnbg7ixWSpS5DfTZMFLsCnvGjalb_nSmE"
                />
              </Link>
            </div>
            <p className="text-xs text-[#5a3f49] leading-relaxed max-w-sm">
              Solusi pengiriman logistik kilat terpercaya berbasis ekosistem
              cerdas dan AI terintegrasi untuk kenyamanan jutaan pelanggan di
              seluruh Indonesia.
            </p>
            <div className="flex flex-col gap-1 text-xs text-[#5a3f49] mt-2">
              <span className="font-bold text-[#1c1b1b]">
                PT Tri Adi Bersama (Anteraja)
              </span>
              <span>
                Gedung Tri Adi Bersama, Jl. Terusan Rasuna Said No. 12, Kuningan
                Barat, Jakarta Selatan 12710
              </span>
              <span>Call Center Resmi: (021) 5060 3333 | cs@anteraja.id</span>
            </div>
          </div>

          {/* Layanan Column */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
              Layanan
            </h2>
            <nav className="flex flex-col gap-2 text-xs">
              <Link
                className="hover:text-[#b30069] transition-colors"
                to="/bantuan"
              >
                Bantuan
              </Link>
              <Link
                className="hover:text-[#b30069] transition-colors"
                to="/lacak"
              >
                Lacak Kiriman
              </Link>
            </nav>
          </div>

          {/* Kemitraan Column */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
              Kemitraan &amp; Karir
            </h2>
            <div className="flex flex-col gap-2 text-xs">
              <Link className="hover:text-[#b30069] transition-colors" to="/">
                Pendaftaran Mitra Satria
              </Link>
              <Link className="hover:text-[#b30069] transition-colors" to="/">
                Mitra Loket Drop Point
              </Link>
              <Link className="hover:text-[#b30069] transition-colors" to="/">
                Peluang Karir Satria &amp; IT
              </Link>
              <Link className="hover:text-[#b30069] transition-colors" to="/">
                Tentang PT Tri Adi Bersama
              </Link>
            </div>
          </div>

          {/* Sertifikasi & Keamanan Column */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold text-[#1c1b1b] uppercase tracking-wider">
              Sertifikasi &amp; Keamanan
            </h2>
            <div className="flex flex-col gap-2.5">
              <div className="p-3 bg-[#f0eded] rounded-xl flex items-center gap-3 border border-[#E5E7EB]">
                <span className="material-symbols-outlined text-[#b30069] text-[20px]">
                  verified
                </span>
                <div>
                  <div className="text-xs font-bold text-[#1c1b1b]">
                    ISO 9001:2015
                  </div>
                  <div className="text-[11px] text-[#5a3f49]">
                    Sistem Manajemen Mutu
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#f0eded] rounded-xl flex items-center gap-3 border border-[#E5E7EB]">
                <span className="material-symbols-outlined text-[#775a00] text-[20px]">
                  shield
                </span>
                <div>
                  <div className="text-xs font-bold text-[#1c1b1b]">
                    ISO 27001:2013
                  </div>
                  <div className="text-[11px] text-[#5a3f49]">
                    Keamanan Informasi &amp; Data
                  </div>
                </div>
              </div>
              <div className="p-2.5 bg-[#f0eded] rounded-xl flex items-center gap-2 border border-[#E5E7EB]">
                <span className="material-symbols-outlined text-[#146b00] text-[18px]">
                  verified_user
                </span>
                <div className="text-[11px] font-semibold text-[#1c1b1b]">
                  Izin Resmi Penyelenggaraan Pos &amp; PSE Kominfo RI
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#5a3f49]">
          <div className="flex flex-wrap items-center gap-6">
            <Link
              className="hover:text-[#b30069] transition-colors"
              to="/bantuan"
            >
              Syarat &amp; Ketentuan
            </Link>
            <Link
              className="hover:text-[#b30069] transition-colors"
              to="/bantuan"
            >
              Kebijakan Privasi
            </Link>
            <Link
              className="hover:text-[#b30069] transition-colors"
              to="/bantuan"
            >
              Pusat Bantuan (FAQ)
            </Link>
            <Link className="hover:text-[#b30069] transition-colors" to="/">
              Panduan Keamanan
            </Link>
          </div>
          <div className="text-center md:text-right">
            © 2025 PT Tri Adi Bersama (Anteraja). Hak Cipta Dilindungi
            Undang-Undang.
          </div>
        </div>
      </div>
    </footer>
  );
}
