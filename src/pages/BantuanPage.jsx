import React, { useState } from "react";

export default function BantuanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      q: "Kenapa status resi belum bergerak padahal sudah lebih dari 24 jam?",
      a: "Paket kemungkinan sedang dalam antrean transit jalur darat/laut antar kota atau Hub Staging. Resi akan diperbarui secara otomatis begitu paket tiba dan dipindai di hub transit tujuan berikutnya. Jika resi tidak berubah lebih dari 48 jam, silakan hubungi tim Satria Care via WhatsApp untuk pemeriksaan fisik langsung.",
    },
    {
      id: 2,
      q: "Bagaimana cara mengubah alamat atau nomor kontak pengantaran?",
      a: "Perubahan alamat dapat dilakukan selama paket masih dalam status Hub Transit dan belum dibawa oleh kurir pengantar. Segera siapkan nomor resi Anda dan hubungi WhatsApp Satria Care dengan melampirkan identitas penerima serta alamat lengkap baru yang valid.",
    },
    {
      id: 3,
      q: "Bagaimana alur dan syarat pengajuan klaim paket hilang atau rusak?",
      a: "Pengajuan klaim wajib dilakukan maksimal 3x24 jam sejak paket berstatus terkirim. Siapkan foto/video unboxing yang memperlihatkan label resi, invoice pembelian, dan kondisi barang. Tim klaim akan memverifikasi dalam 1x24 jam kerja dan memproses pencairan kompensasi sesuai ketentuan asuransi.",
    },
    {
      id: 4,
      q: "Apakah saya bisa meminta Satria menitipkan paket ke tetangga atau pos satpam?",
      a: "Bisa. Saat kurir Satria menghubungi Anda sebelum pengiriman atau melalui pelacakan aktif, Anda dapat memberikan izin tertulis untuk menitipkan paket ke tetangga atau pos jaga setempat. Satria akan mengambil foto bukti serah terima (Proof of Delivery) demi keamanan barang Anda.",
    },
    {
      id: 5,
      q: "Kapan batas waktu jam pengantaran harian kurir Satria?",
      a: "Kurir Satria melakukan pengantaran setiap hari mulai pukul 08:00 hingga 20:00 WIB. Khusus layanan Same Day atau layanan ekspres prioritas di area perkotaan besar, pengantaran dapat berlangsung hingga pukul 21:00 WIB sesuai konfirmasi penerima.",
    },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    const faqElement = document.getElementById("faq-section");
    if (faqElement) faqElement.scrollIntoView({ behavior: "smooth" });
  };

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-74px)] bg-[#fcf9f8]">
      {/* Hero Search Section */}
      <section className="w-full bg-white border-b border-[#E5E7EB] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd9e4] text-[#8d0051] mb-3">
            <span className="material-symbols-outlined text-[16px] text-[#b30069]">
              support_agent
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Satria Care 24/7
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1b1b] tracking-tight mb-2">
            Pusat Bantuan Anteraja
          </h1>
          <p className="text-base text-[#5a3f49] mb-8 max-w-xl mx-auto">
            Cari jawaban cepat atau hubungi tim Satria Care kami untuk solusi
            pengiriman Anda.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto bg-[#f6f3f2] rounded-2xl p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[#b30069] focus-within:bg-white transition-all">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 w-full"
            >
              <div className="flex items-center pl-4 text-[#b30069]">
                <span className="material-symbols-outlined text-[24px]">
                  search
                </span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik kata kunci kendala atau nomor resi..."
                className="w-full bg-transparent py-2.5 text-sm text-[#1c1b1b] placeholder:text-[#9CA3AF] focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="shrink-0 inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#b30069] hover:bg-[#e00085] text-white text-sm font-bold transition-colors shadow-sm"
              >
                Cari
              </button>
            </form>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-[#5a3f49] font-bold mr-1">
              Pencarian populer:
            </span>
            {["Status Resi", "Ubah Alamat", "Klaim Paket", "Jadwal Kurir"].map(
              (chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSearchQuery(chip)}
                  className="px-3.5 py-1 rounded-full bg-[#eae7e7] hover:bg-[#ffd9e4] hover:text-[#b30069] text-[#1c1b1b] text-xs font-semibold transition-colors"
                >
                  {chip}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-[#1c1b1b] tracking-tight mb-1">
            Kategori Bantuan Terpopuler
          </h2>
          <p className="text-sm text-[#5a3f49]">
            Pilih topik di bawah untuk melihat petunjuk dan panduan penyelesaian
            masalah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between border border-[#E5E7EB]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#ffd9e4] text-[#b30069] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">
                  radar
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1c1b1b] mb-2 group-hover:text-[#b30069] transition-colors">
                Lacak &amp; Status Paket
              </h3>
              <p className="text-xs text-[#5a3f49] leading-relaxed">
                Arti status resi, resi stuck manifest di hub, dan estimasi waktu
                tiba.
              </p>
            </div>
            <div className="mt-6 pt-2 flex items-center gap-1 text-xs text-[#b30069] font-bold">
              <span>Lihat Panduan</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between border border-[#E5E7EB]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#ffdf98] text-[#775a00] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">
                  two_wheeler
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1c1b1b] mb-2 group-hover:text-[#b30069] transition-colors">
                Pengantaran &amp; Kurir
              </h3>
              <p className="text-xs text-[#5a3f49] leading-relaxed">
                Kontak kurir aktif, instruksi titip satpam, atau jadwal ulang
                jam pengantaran.
              </p>
            </div>
            <div className="mt-6 pt-2 flex items-center gap-1 text-xs text-[#b30069] font-bold">
              <span>Lihat Panduan</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between border border-[#E5E7EB]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">
                  edit_location_alt
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1c1b1b] mb-2 group-hover:text-[#b30069] transition-colors">
                Perubahan Alamat &amp; Data
              </h3>
              <p className="text-xs text-[#5a3f49] leading-relaxed">
                Koreksi alamat salah ketik, perbarui nomor HP, atau alihkan ke
                drop point.
              </p>
            </div>
            <div className="mt-6 pt-2 flex items-center gap-1 text-xs text-[#b30069] font-bold">
              <span>Lihat Panduan</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between border border-[#E5E7EB]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#146b00] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">
                  verified_user
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1c1b1b] mb-2 group-hover:text-[#b30069] transition-colors">
                Klaim &amp; Kendala Paket
              </h3>
              <p className="text-xs text-[#5a3f49] leading-relaxed">
                Ganti rugi paket hilang/rusak, garansi SLA ongkir kembali, dan
                syarat asuransi.
              </p>
            </div>
            <div className="mt-6 pt-2 flex items-center gap-1 text-xs text-[#b30069] font-bold">
              <span>Lihat Panduan</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1c1b1b] tracking-tight mb-1">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm text-[#5a3f49]">
            Temukan jawaban langsung untuk pertanyaan yang paling sering
            ditanyakan pelanggan kami.
          </p>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#E5E7EB]"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-[#1c1b1b] hover:text-[#b30069] transition-colors"
              >
                <span>{faq.q}</span>
                <span
                  className={`material-symbols-outlined text-[20px] text-[#6B7280] transition-transform duration-200 ${openFaq === faq.id ? "rotate-180" : ""}`}
                >
                  expand_more
                </span>
              </button>
              {openFaq === faq.id && (
                <div className="px-4 pb-4 text-xs text-[#5a3f49] leading-relaxed border-t border-[#f0eded] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Direct Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm text-center border border-[#E5E7EB]">
          <h3 className="text-xl font-bold text-[#1c1b1b] mb-1">
            Masih Butuh Bantuan Lebih Lanjut?
          </h3>
          <p className="text-sm text-[#5a3f49] max-w-xl mx-auto mb-8">
            Tim layanan pelanggan Anteraja siap membantu menjawab kendala paket
            Anda setiap hari.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* WhatsApp */}
            <div className="bg-[#f6f3f2] p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#146b00] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[24px]">
                  chat
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1c1b1b] mb-1">
                WhatsApp Satria
              </h4>
              <p className="text-xs text-[#5a3f49] mb-4">
                Respon cepat asisten interaktif
              </p>
              <a
                href="https://wa.me/6281119603333"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-[#146b00] hover:bg-[#1b8700] text-white text-xs font-bold transition-colors shadow-sm"
              >
                <span>+62 811-1960-3333</span>
              </a>
            </div>

            {/* Hotline */}
            <div className="bg-[#f6f3f2] p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#ffd9e4] text-[#b30069] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[24px]">
                  call
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1c1b1b] mb-1">
                Hotline 24 Jam
              </h4>
              <p className="text-xs text-[#5a3f49] mb-4">
                Panggilan langsung ke operator
              </p>
              <a
                href="tel:02150663333"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-[#eae7e7] hover:bg-[#dcd9d9] text-[#1c1b1b] text-xs font-bold transition-colors shadow-sm"
              >
                <span>021-50663333</span>
              </a>
            </div>

            {/* Email */}
            <div className="bg-[#f6f3f2] p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#eae7e7] text-[#1c1b1b] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[24px]">
                  mail
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1c1b1b] mb-1">
                Email Dukungan
              </h4>
              <p className="text-xs text-[#5a3f49] mb-4">
                Untuk pengaduan &amp; kerja sama
              </p>
              <a
                href="mailto:cs@anteraja.id"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-[#eae7e7] hover:bg-[#dcd9d9] text-[#1c1b1b] text-xs font-bold transition-colors shadow-sm"
              >
                <span>cs@anteraja.id</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
