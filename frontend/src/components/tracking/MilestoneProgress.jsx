/**
 * =============================================================================
 * MilestoneProgress.jsx - Stepper Visual 5 Tahapan Pengiriman Riil
 * =============================================================================
 * Menampilkan progress bar interaktif dengan 5 tahapan utama logistik:
 * 1. Pesanan Dibuat (Order Created)
 * 2. Diproses Kurir (Courier Processed / Pickup)
 * 3. Dalam Perjalanan (In Transit Linehaul)
 * 4. Sedang Diantar (Out For Delivery Satria)
 * 5. Tiba di Tujuan (Delivered)
 *
 * Mengatur garis penghubung otomatis (hijau untuk tahap yang sudah terlewati,
 * garis putus-putus untuk tahap mendatang), status aktif/pulse, dan tata letak
 * responsif (horizontal di desktop, vertikal di mobile).
 */

import React from "react";

const DONE_RING = "bg-success-base text-on-primary shadow-md ring-4 ring-success-surface";
const PENDING_RING =
  "bg-surface-container-high text-on-surface-variant shadow-inner ring-4 ring-surface-container-lowest";

/**
 * Komponen satu titik tahap pada stepper progres pengiriman.
 * @param {{ milestone: Object }} props
 */
function MilestoneStep({ milestone }) {

  const done = milestone.state === "done";

  return (
    <div
      className={`relative z-10 flex w-full items-center gap-space-sm text-left md:w-1/5 md:flex-col md:items-center md:text-center ${
        done ? "" : "opacity-60"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          done ? DONE_RING : PENDING_RING
        } ${milestone.pulse ? "animate-pulse" : ""}`}
      >
        <span
          className={`material-symbols-outlined text-[20px] ${done ? "font-bold" : ""}`}
        >
          {milestone.icon}
        </span>
      </div>

      <div className="flex flex-col md:items-center">
        <span
          className={`font-label-lg text-label-lg font-bold ${
            done ? "text-tertiary" : "text-on-surface-variant"
          }`}
        >
          {milestone.label}
        </span>
        <span
          className={`whitespace-nowrap font-mono-code text-body-sm font-bold ${
            done ? "text-tertiary" : "font-normal text-text-muted"
          }`}
        >
          {milestone.time}
        </span>
        <span
          className={`mt-0.5 font-body-sm text-body-sm md:text-[11px] md:leading-4 ${
            milestone.placeClass ?? "text-on-surface-variant"
          }`}
        >
          {milestone.place}
        </span>
      </div>
    </div>
  );
}

/**
 * Stepper "Progres Pengiriman Riil".
 *
 * Garis penghubung dihitung dari jumlah tahap yang sudah selesai:
 * segmen yang sudah dilalui berwarna hijau penuh, sisanya putus-putus abu.
 * Di mobile tahap menumpuk vertikal.
 */
export default function MilestoneProgress({ milestones, updatedLabel }) {
  const jumlahSelesai = milestones.filter((m) => m.state === "done").length;
  // Segmen penghubung = jumlah tahap - 1
  const segmen = milestones.map((milestone, index) => {
    if (index === milestones.length - 1) return null;
    return index < jumlahSelesai - 1 ? "done" : "pending";
  });

  return (
    <div className="flex flex-col">
      <div className="mb-space-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px] text-primary">
            timeline
          </span>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Progres Pengiriman Riil
          </h2>
        </div>
        <span className="font-mono-code text-label-sm text-on-surface-variant">
          {updatedLabel}
        </span>
      </div>

      <div className="relative flex flex-col items-start justify-between gap-space-lg pb-space-xs pt-space-xs md:flex-row md:gap-space-xs">
        {/* Garis penghubung (desktop) */}
        <div className="pointer-events-none absolute left-[5%] right-[5%] top-[22px] z-0 hidden h-1 md:block">
          <div className="flex h-full w-full">
            {segmen.map((state, i) =>
              state === null ? null : (
                <div
                  className={`h-full w-1/4 ${
                    state === "done"
                      ? "bg-success-base"
                      : "bg-[linear-gradient(to_right,#D1D5DB_50%,transparent_50%)] bg-[length:12px_100%]"
                  }`}
                  key={i}
                />
              ),
            )}
          </div>
        </div>

        {milestones.map((milestone) => (
          <MilestoneStep key={milestone.id} milestone={milestone} />
        ))}
      </div>
    </div>
  );
}
