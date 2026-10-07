import { useEffect, useState } from "react";

import DeliveredMap from "@/features/tracking/components/maps/DeliveredMap";
import DeliveryMap from "@/features/tracking/components/maps/DeliveryMap";
import StagingMap from "@/features/tracking/components/maps/StagingMap";
import StandbyMap from "@/features/tracking/components/maps/StandbyMap";
import TransitMap from "@/features/tracking/components/maps/TransitMap";
import { DELIVERY_ROUTES } from "@/features/tracking/data/deliveryRoutes";
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
 * Kartu "Radar Posisi Paket" dengan empat varian tampilan:
 * - "standby"  : paket belum dijemput, GPS belum aktif
 * - "staging"  : paket ada di Staging DC (peta kawasan statis)
 * - "transit"  : paket dalam perjalanan antarkota — penanda armada bergerak
 *                mengikuti waypoint rute
 * - "delivery" : kurir mengantar ke alamat penerima — penanda bergerak
 *                mendekati tujuan, lengkap dengan sisa jarak
 */
export default function LivePositionCard({ radar }) {
  const isDelivery = radar.variant === "delivery";
  const isTransit = radar.variant === "transit";
  // Varian transit & delivery sama-sama memakai animasi rute.
  const berAnimasi = isTransit || isDelivery;

  const rute = isTransit
    ? TRANSIT_ROUTES[radar.routeId]
    : isDelivery
      ? DELIVERY_ROUTES[radar.routeId]
      : null;

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

  // Peta besar (dengan bingkai) dipakai varian animasi, staging, dan delivered.
  const petaKelas =
    berAnimasi ||
    radar.variant === "staging" ||
    radar.variant === "delivered"
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
          {isDelivery
            ? waypoint?.sisaKm != null
              ? `Satria Bergerak (${waypoint.sisaKm} km)`
              : radar.pillLabel
            : isTransit
              ? radar.pillLabel
              : radar.statusLabel}
        </StatusPill>
      </div>

      <div className={petaKelas}>
        {berAnimasi ? (
          <>
            {isDelivery ? (
              <DeliveryMap marker={waypoint?.svg} tujuan={rute?.tujuan} />
            ) : (
              <TransitMap marker={waypoint?.svg} />
            )}
            <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-md border border-border-subtle/50 bg-white px-2.5 py-1 text-[11px] font-bold text-on-surface shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success-base" />
              {radar.liveBadgeLabel}
            </div>
            <ZoomControls />

            {/* Pin — peta yang menggeser, jadi pin tetap di tengah */}
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
                      {isDelivery ? rute?.kurir : waypoint?.label}
                    </span>
                    <span className="mt-0.5 font-body-sm text-[9px] leading-none text-text-muted">
                      {isDelivery
                        ? `${waypoint?.sisaKm ?? 0} km lagi • ${waypoint?.detail ?? ""}`
                        : waypoint?.detail}
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
                  {isDelivery ? "navigation" : "verified"}
                </span>
                {isDelivery
                  ? radar.zoneLabel
                  : isTransit
                    ? `${radar.zoneLabel} — ${waypoint?.status ?? ""}`
                    : radar.zone}
              </span>
              <span className="font-mono-code text-[10px] font-bold text-primary">
                {isDelivery
                  ? radar.coordinates
                  : isTransit
                    ? `LAT: ${waypoint?.geo?.lat ?? "-"}, LON: ${waypoint?.geo?.lon ?? "-"}`
                    : radar.coordinates}
              </span>
            </div>
          </>
        ) : radar.variant === "delivered" ? (
          <>
            <DeliveredMap />

            {/* Chip bukti serah terima (POD) */}
            <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-md border border-border-subtle/50 bg-white px-2.5 py-1 text-[11px] font-bold text-tertiary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-success-base" />
              {radar.liveBadgeLabel}
            </div>
            <ZoomControls />

            {/* Pin titik penyerahan — paket sudah diterima di alamat */}
            <div className="pointer-events-none absolute left-[64%] top-[25%] z-20 flex -translate-x-1/2 -translate-y-[88%] flex-col items-center">
              <div className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-tertiary/30 bg-surface-container-lowest px-3 py-1.5 shadow-lg">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-tertiary text-white shadow-sm">
                  <span className="material-symbols-outlined text-[15px]">
                    {radar.icon}
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-label-sm text-[11px] font-bold leading-tight text-tertiary">
                    {radar.pin.title}
                  </span>
                  <span className="mt-0.5 font-body-sm text-[9px] leading-none text-text-muted">
                    {radar.pin.subtitle}
                  </span>
                </div>
                <span className="material-symbols-outlined ml-0.5 text-[16px] text-success-base">
                  verified
                </span>
              </div>
              <div className="-mt-1 h-2.5 w-2.5 rotate-45 border-b border-r border-tertiary/30 bg-surface-container-lowest shadow-sm" />
            </div>

            <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between rounded-lg border border-border-subtle/50 bg-white/95 px-3 py-1.5 text-[11px] shadow-sm">
              <span className="flex items-center gap-1.5 font-medium text-text-primary">
                <span className="material-symbols-outlined text-[14px] text-tertiary">
                  pin_drop
                </span>
                {radar.zone}
              </span>
              <span className="font-mono-code text-[10px] font-bold text-tertiary">
                {radar.coordinates}
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
              {berAnimasi && tibaDiTujuan
                ? radar.footerDoneLabel
                : radar.footerLabel}
            </>
          )}
        </span>
        {radar.variant === "standby" ? (
          <span className="flex items-center gap-0.5 font-label-sm text-label-sm text-text-muted">
            {radar.footerRight}
          </span>
        ) : isDelivery ? (
          <span className="font-label-sm text-label-sm text-text-muted">
            {tibaDiTujuan
              ? "Tiba di alamat"
              : `Sisa ${waypoint?.sisaKm ?? 0} km`}
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
