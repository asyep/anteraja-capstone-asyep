import { useEffect, useState } from "react";

import StagingMap from "@/features/tracking/components/maps/StagingMap";
import StandbyMap from "@/features/tracking/components/maps/StandbyMap";
import TransitMap from "@/features/tracking/components/maps/TransitMap";
import { TRANSIT_ROUTES } from "@/features/tracking/data/transitRoutes";
import useTransitAnimation from "@/features/tracking/hooks/useTransitAnimation";

/** Label kapsul badge di kanan atas kartu. */
function StatusPill({ children, strong }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 font-label-sm text-label-sm font-bold ${
        strong
          ? "bg-tertiary-fixed text-on-tertiary-fixed"
          : "bg-surface-container-low text-text-muted"
      }`}
    >
      {children}
    </span>
  );
}

/** Tombol zoom peta (tampilan saja). */
function ZoomControls() {
  return (
    <div className="absolute right-2.5 top-2.5 z-10 flex flex-col gap-1">
      {["+", "−"].map((simbol) => (
        <button
          aria-label={simbol === "+" ? "Perbesar peta" : "Perkecil peta"}
          className="flex h-7 w-7 items-center justify-center rounded border border-border-subtle/50 bg-white text-xs font-bold text-on-surface shadow-sm transition-colors hover:bg-surface-container-high"
          key={simbol}
          type="button"
        >
          {simbol}
        </button>
      ))}
    </div>
  );
}

/**
 * Kartu "Radar Posisi Paket" dengan tiga varian tampilan:
 * - "standby" : paket belum dijemput, GPS belum aktif
 * - "staging" : paket ada di Staging DC (peta kawasan statis)
 * - "transit" : paket sedang dalam perjalanan — penanda armada bergerak
 *               mengikuti waypoint rute secara real-time
 */
export default function LivePositionCard({ radar }) {
  const isTransit = radar.variant === "transit";
  const rute = isTransit ? TRANSIT_ROUTES[radar.routeId] : null;

  // Animasi hanya aktif untuk varian transit.
  const { index, waypoint, tibaDiTujuan } = useTransitAnimation(
    rute ?? { waypoints: [] },
    {
      startIndex: radar.startIndex ?? 0,
      intervalMs: radar.intervalMs ?? 4000,
    },
  );

  // Label dinaikkan sedikit agar area peta tetap terbaca.
  const [labelTerlihat, setLabelTerlihat] = useState(false);
  useEffect(() => {
    if (waypoint) setLabelTerlihat(true);
  }, [waypoint]);

  const petaKelas = isTransit
    ? "relative h-56 w-full overflow-hidden rounded-xl border border-border-subtle/50 bg-[#eef2f6] shadow-inner"
    : radar.variant === "staging"
      ? "relative h-56 w-full overflow-hidden rounded-xl border border-border-subtle/50 bg-[#eef2f6] shadow-inner"
      : "relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl shadow-inner";

  return (
    <div className="flex w-full flex-col gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-lg">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-label-md text-label-md font-bold text-on-surface">
          <span className="material-symbols-outlined text-[18px] text-primary">
            {radar.icon}
          </span>
          Radar Posisi Paket
        </span>
        <StatusPill strong={radar.variant !== "standby"}>
          {isTransit ? radar.pillLabel : radar.statusLabel}
        </StatusPill>
      </div>

      <div className={petaKelas}>
        {isTransit ? (
          <>
            <TransitMap marker={waypoint?.svg} />
            <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-md border border-border-subtle/50 bg-white px-2.5 py-1 text-[11px] font-bold text-on-surface shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success-base" />
              {radar.liveBadgeLabel}
            </div>
            <ZoomControls />

            {/* Pin armada — peta yang menggeser, jadi pin tetap di tengah */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-20"
              style={{
                transform: "translate(-50%, -88%)",
                opacity: labelTerlihat ? 1 : 0,
              }}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-primary/30 bg-surface-container-lowest px-3 py-1.5 shadow-lg">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                    <span className="material-symbols-outlined text-[15px]">
                      {radar.icon}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-label-sm text-[11px] font-bold leading-tight text-primary">
                      {waypoint?.label}
                    </span>
                    <span className="mt-0.5 font-body-sm text-[9px] leading-none text-text-muted">
                      {waypoint?.detail}
                    </span>
                  </div>
                  <span className="ml-0.5 h-1.5 w-1.5 animate-ping rounded-full bg-success-base" />
                </div>
                <div className="-mt-1 h-2.5 w-2.5 rotate-45 border-b border-r border-primary/30 bg-surface-container-lowest shadow-sm" />
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between rounded-lg border border-border-subtle/50 bg-white/95 px-3 py-1.5 text-[11px] shadow-sm">
              <span className="flex items-center gap-1.5 font-medium text-text-primary">
                <span className="material-symbols-outlined text-[14px] text-primary">
                  verified
                </span>
                {isTransit
                  ? `${radar.zoneLabel} — ${waypoint?.status ?? ""}`
                  : radar.zone}
              </span>
              <span className="font-mono-code text-[10px] font-bold text-primary">
                {isTransit
                  ? `LAT: ${waypoint?.geo?.lat ?? "-"}, LON: ${waypoint?.geo?.lon ?? "-"}`
                  : radar.coordinates}
              </span>
            </div>
          </>
        ) : radar.variant === "staging" ? (
          <>
            <StagingMap />
            {radar.liveBadge ? (
              <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-md border border-border-subtle/50 bg-white px-2.5 py-1 text-[11px] font-bold text-on-surface shadow-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-success-base" />
                Live GPS Aktif
              </div>
            ) : null}
            <ZoomControls />
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-[88%] flex-col items-center">
              <div className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-primary/30 bg-surface-container-lowest px-3 py-1.5 shadow-lg">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                  <span className="material-symbols-outlined text-[15px]">
                    {radar.icon}
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-label-sm text-[11px] font-bold leading-tight text-primary">
                    {radar.pin.title}
                  </span>
                  <span className="mt-0.5 font-body-sm text-[9px] leading-none text-text-muted">
                    {radar.pin.subtitle}
                  </span>
                </div>
                <span className="ml-0.5 h-1.5 w-1.5 animate-ping rounded-full bg-success-base" />
              </div>
              <div className="-mt-1 h-2.5 w-2.5 rotate-45 border-b border-r border-primary/30 bg-surface-container-lowest shadow-sm" />
            </div>
            {radar.coordinates ? (
              <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between rounded-lg border border-border-subtle/50 bg-white/95 px-3 py-1.5 text-[11px] shadow-sm">
                <span className="flex items-center gap-1.5 font-medium text-text-primary">
                  <span className="material-symbols-outlined text-[14px] text-primary">
                    verified
                  </span>
                  {radar.zone}
                </span>
                <span className="font-mono-code text-[10px] font-bold text-primary">
                  {radar.coordinates}
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <StandbyMap description={radar.description} title={radar.title} />
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span
          className={
            radar.variant === "standby"
              ? "font-body-sm text-body-sm text-text-muted"
              : "flex items-center gap-1 font-label-sm text-label-sm text-text-muted"
          }
        >
          {radar.variant === "standby" ? (
            radar.footerLeft
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px] text-primary">
                {radar.icon}
              </span>
              {isTransit && tibaDiTujuan
                ? radar.footerDoneLabel
                : radar.footerLabel}
            </>
          )}
        </span>
        {radar.variant === "standby" ? (
          <span className="flex items-center gap-0.5 font-label-sm text-label-sm text-text-muted">
            {radar.footerRight}
          </span>
        ) : isTransit ? (
          <span className="font-label-sm text-label-sm text-text-muted">
            Pos {index + 1}/{rute?.waypoints?.length ?? 0}
          </span>
        ) : null}
      </div>
    </div>
  );
}
