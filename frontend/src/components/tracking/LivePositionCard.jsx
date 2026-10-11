import { useEffect, useState } from "react";

import TrackingMap from "./maps/TrackingMap";
import { DELIVERY_ROUTES } from "../../data/deliveryRoutes";
import { TRANSIT_ROUTES } from "../../data/transitRoutes";
import useTransitAnimation from "../../hooks/useTransitAnimation";

/** Label kapsul badge di kanan atas kartu. */
function StatusPill({ children, strong }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 font-label-sm text-label-sm font-bold ${strong
          ? "bg-tertiary-fixed text-on-tertiary-fixed"
          : "bg-surface-container-low text-text-muted"
        }`}
    >
      {children}
    </span>
  );
}

function parseStagingGeo(radar) {
  if (radar?.geo?.lat != null && radar?.geo?.lon != null) {
    return { lat: Number(radar.geo.lat), lon: Number(radar.geo.lon) };
  }
  if (radar?.coordinates) {
    const match = String(radar.coordinates).match(/LAT:\s*([-\d.]+),\s*LON:\s*([-\d.]+)/i);
    if (match) {
      return { lat: parseFloat(match[1]), lon: parseFloat(match[2]) };
    }
  }
  return { lat: -6.9582, lon: 110.4503 };
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
      loop: true,
      enabled: isDelivery,
    },
  );

  // Untuk varian transit dan delivery, posisi awal peta stabil mengikuti radar.startIndex
  const activeWpIndex = radar.startIndex ?? 0;
  const currentWaypoint = isTransit ? (rute?.waypoints?.[activeWpIndex] ?? waypoint) : (waypoint ?? rute?.waypoints?.[activeWpIndex]);

  // Label dinaikkan sedikit agar area peta tetap terbaca.
  const [labelTerlihat, setLabelTerlihat] = useState(false);
  useEffect(() => {
    if (currentWaypoint) setLabelTerlihat(true);
  }, [currentWaypoint]);

  // Peta besar (dengan bingkai) dipakai varian animasi, staging, dan delivered.
  const petaKelas =
    berAnimasi ||
      radar.variant === "staging" ||
      radar.variant === "delivered"
      ? "relative h-56 w-full overflow-hidden rounded-xl border border-border-subtle/50 bg-[#eef2f6] shadow-inner"
      : "relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-cover bg-center p-3 shadow-inner";

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

      <div
        className={petaKelas}
        data-location={radar.location || "Jl. Tebet Barat Dalam, Jakarta Selatan, Indonesia"}
        style={
          radar.variant === "standby" || (!berAnimasi && radar.variant !== "staging" && radar.variant !== "delivered")
            ? {
                backgroundImage: `url("${radar.backgroundImage || '/images/map-standby.png'}")`,
              }
            : undefined
        }
      >
        {berAnimasi ? (
          <>
            <TrackingMap
              waypoints={rute?.waypoints || []}
              activeIndex={activeWpIndex}
              variant={radar.variant}
              telemetryGeo={radar.telemetryGeo}
              destinationAddress={radar.destinationAddress || radar.location}
            />
            <div className="absolute left-2.5 top-2.5 z-[1000] flex items-center gap-1.5 rounded-md border border-border-subtle/50 bg-white px-2.5 py-1 text-[11px] font-bold text-on-surface shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success-base" />
              {radar.liveBadgeLabel}
            </div>

            <div className="absolute bottom-2 left-2 right-2 z-[1000] flex items-center justify-between rounded-lg border border-border-subtle/50 bg-white/95 px-3 py-1.5 text-[11px] shadow-sm">
              <span className="flex items-center gap-1.5 font-medium text-text-primary">
                <span className="material-symbols-outlined text-[14px] text-primary">
                  {isDelivery ? "navigation" : "verified"}
                </span>
                {isDelivery
                  ? radar.zoneLabel
                  : isTransit
                    ? `${radar.zoneLabel} — ${currentWaypoint?.status ?? ""}`
                    : radar.zone}
              </span>
              <span className="font-mono-code text-[10px] font-bold text-primary">
                {isDelivery
                  ? radar.coordinates
                  : isTransit
                    ? (radar.coordinates || `LAT: ${currentWaypoint?.geo?.lat ?? "-"}, LON: ${currentWaypoint?.geo?.lon ?? "-"}`)
                    : radar.coordinates}
              </span>
            </div>
          </>
        ) : radar.variant === "delivered" ? (
          <>
            <TrackingMap
              waypoints={[{ geo: { lat: -6.2370, lon: 106.8480 }, label: radar.pin.title, detail: radar.pin.subtitle }]}
              activeIndex={0}
              variant={radar.variant}
            />

            {/* Chip bukti serah terima (POD) */}
            <div className="absolute left-2.5 top-2.5 z-[1000] flex items-center gap-1.5 rounded-md border border-border-subtle/50 bg-white px-2.5 py-1 text-[11px] font-bold text-tertiary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-success-base" />
              {radar.liveBadgeLabel}
            </div>

            <div className="absolute bottom-2 left-2 right-2 z-[1000] flex items-center justify-between rounded-lg border border-border-subtle/50 bg-white/95 px-3 py-1.5 text-[11px] shadow-sm">
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
            <TrackingMap
              waypoints={[
                {
                  geo: parseStagingGeo(radar),
                  label: radar.pin?.title || "Staging Gateway Hub",
                  detail: radar.pin?.subtitle || "DC Anteraja",
                },
              ]}
              activeIndex={0}
              variant={radar.variant}
            />
            {radar.liveBadge ? (
              <div className="absolute left-2.5 top-2.5 z-[1000] flex items-center gap-1.5 rounded-md border border-border-subtle/50 bg-white px-2.5 py-1 text-[11px] font-bold text-on-surface shadow-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-success-base" />
                Live GPS Aktif
              </div>
            ) : null}

            {radar.coordinates ? (
              <div className="absolute bottom-2 left-2 right-2 z-[1000] flex items-center justify-between rounded-lg border border-border-subtle/50 bg-white/95 px-3 py-1.5 text-[11px] shadow-sm">
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
          <>
            <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm" />
            <div className="relative z-10 flex max-w-[240px] flex-col items-center gap-1 rounded-xl border border-border-subtle/50 bg-surface-container-lowest/95 p-3.5 text-center shadow-lg backdrop-blur-md">
              <div className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[18px]">
                  location_off
                </span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface">
                {radar.title}
              </span>
              <p className="font-body-sm text-[11px] leading-tight text-text-muted">
                {radar.description}
              </p>
            </div>
          </>
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
            Pos {activeWpIndex + 1}/{rute?.waypoints?.length ?? 0}
          </span>
        ) : null}
      </div>
    </div>
  );
}
