/**
 * =============================================================================
 * OperationalWarningBanner.jsx - Komponen Peringatan Kendala Operasional (FRD F-04)
 * =============================================================================
 * 
 * FUNGSI KOMPONEN:
 * Menampilkan banner peringatan visual yang transparan, profesional, dan empati
 * ketika sistem mendeteksi adanya kendala operasional lapangan (misal: cuaca buruk,
 * kemacetan parah, atau kendala kendaraan transit).
 * 
 * ATURAN BISNIS & ACCEPTANCE CRITERIA (FRD F-04):
 * - BR-04.1: Muncul jika `has_delay = true` (pemicu: delay_reason atau traffic Heavy).
 * - BR-04.2: Menggunakan palet perhatian Amber/Orange (#F59E0B / #F97316) dan ikon warning.
 * - BR-04.3: Naskah ringkasan:
 *   "Perhatian: Terdapat kendala {delay_reason} (Kondisi Lalu Lintas: {traffic_status}) di jalur transit."
 * - AC-F4.1: Resi berkendala -> Banner tampil elegan di atas Narrative Box.
 * - AC-F4.2: Resi lancar (`has_delay = false`) -> Banner otomatis disembunyikan (null).
 * =============================================================================
 */

import React from "react";

/**
 * @param {Object} props
 * @param {Object} props.warning - Data konteks operasional kendala pengiriman
 * @param {boolean} props.warning.hasDelay - Flag apakah paket mengalami kendala
 * @param {string} [props.warning.delayReason] - Alasan spesifik keterlambatan
 * @param {string} [props.warning.trafficStatus] - Status lalu lintas (misal: Heavy, Clear)
 * @param {string} [props.warning.weatherCondition] - Kondisi cuaca sepanjang rute (misal: Hujan Lebat)
 * @param {number} [props.warning.waitingTimeMinutes] - Estimasi waktu tunggu/keterlambatan (menit)
 * @param {string} [props.warning.whatsappUrl] - URL direct chat WhatsApp bantuan
 */
export default function OperationalWarningBanner({ warning }) {
  // AC-F4.2: JIKA has_delay = false atau data tidak ada, sembunyikan banner
  if (!warning || !warning.hasDelay) {
    return null;
  }

  const delayReason = warning.delayReason || "Kepadatan Jalur Pengiriman";
  const trafficStatus = warning.trafficStatus || "Padat";
  const weather = warning.weatherCondition;
  const waitingMinutes = warning.waitingTimeMinutes;
  const whatsappUrl = warning.whatsappUrl || "https://wa.me/6281119603333";

  return (
    <aside
      aria-label="Peringatan Operasional Jalur Pengiriman"
      className="relative w-full overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-amber-50/70 to-orange-50/80 p-space-md shadow-md shadow-amber-500/5 transition-all duration-300 md:p-space-lg"
      role="alert"
    >
      {/* Dekorasi ambient glow oranye di sudut banner */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-orange-400/15 blur-xl" />

      <div className="relative z-10 flex flex-col gap-space-sm sm:flex-row sm:items-start sm:gap-space-md">
        {/* Ikon Peringatan dengan Badge Bulat Glowing */}
        <div className="relative flex shrink-0 items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300 bg-amber-100/90 text-amber-700 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">
              warning
            </span>
          </div>
          {/* Status Ping Dot Oranye */}
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-600" />
          </span>
        </div>

        {/* Konten Teks Peringatan Sesuai BR-04.3 */}
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-200/60 px-2.5 py-0.5 font-label-sm text-[11px] font-extrabold uppercase tracking-wide text-amber-900">
              <span className="material-symbols-outlined text-[13px] text-amber-700">
                notifications_active
              </span>
              Peringatan Operasional Jalur
            </span>

            {/* Chip Tambahan: Kondisi Cuaca jika terdeteksi */}
            {weather && weather !== "Cerah" && weather !== "Clear" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-white/70 px-2 py-0.5 font-label-sm text-[11px] font-semibold text-amber-800">
                <span className="material-symbols-outlined text-[12px] text-amber-600">
                  cloud
                </span>
                Cuaca: {weather}
              </span>
            )}

            {/* Chip Tambahan: Estimasi Delay Menit jika ada */}
            {waitingMinutes > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-white/70 px-2 py-0.5 font-label-sm text-[11px] font-semibold text-amber-800">
                <span className="material-symbols-outlined text-[12px] text-amber-600">
                  timelapse
                </span>
                Penyesuaian: +{waitingMinutes} menit
              </span>
            )}
          </div>

          {/* Teks Naskah Resmi Sesuai Ketentuan FRD F-04 BR-04.3 & AC-F4.1 */}
          <h2 className="font-headline-sm text-sm font-bold leading-snug text-amber-950 sm:text-base">
            Perhatian: Terdapat kendala{" "}
            <span className="underline decoration-amber-400 decoration-2 underline-offset-2">
              {delayReason}
            </span>{" "}
            (Kondisi Lalu Lintas:{" "}
            <span className="font-extrabold text-amber-900">{trafficStatus}</span>)
            di jalur transit.
          </h2>

          <p className="font-body-sm text-xs leading-relaxed text-amber-800/90 sm:text-sm">
            Tim operasional Anteraja dan armada Satria sedang berkoordinasi di lapangan untuk memilih rute alternatif guna meminimalkan durasi keterlambatan. Paket Anda tetap dalam pemantauan aman 24/7.
          </p>
        </div>

        {/* Tombol Aksi Bantuan Tanggap Cepat */}
        <div className="mt-2 shrink-0 sm:mt-0 sm:self-center">
          <a
            aria-label="Konfirmasi kendala via WhatsApp"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3.5 py-2 font-label-sm text-xs font-bold text-amber-900 shadow-sm transition-all hover:bg-amber-100/70 hover:shadow active:scale-95"
            href={whatsappUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">
              chat
            </span>
            <span>Tanya Satria</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
