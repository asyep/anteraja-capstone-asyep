/**
 * =============================================================================
 * TrackingResolverPage.jsx - Dynamic Route & Milestone Dispatcher
 * =============================================================================
 * Berfungsi sebagai perantara (bridge) cerdas saat pencarian nomor resi dilakukan:
 * 1. Jalur Sinkron Cepat (0ms): Jika nomor resi cocok dengan dataset lokal atau
 *    riwayat tersimpan, langsung redirect ke rute milestone spesifik tanpa loading.
 * 2. Jalur Resolusi Jaringan (< 750ms): Jika nomor resi baru, mengambil status
 *    operasional (`order_status`) melalui API lalu mendistribusikan ke:
 *    - `ORDER_CREATED` -> `/tracking/order-created`
 *    - `PICKUP_READY` / `COURIER_PROCESSED` -> `/tracking/courier-processed`
 *    - `IN_TRANSIT` -> `/tracking/in-transit`
 *    - `OUT_FOR_DELIVERY` -> `/tracking/out-for-delivery`
 *    - `DELIVERED` -> `/delivered`
 *    - Status tidak dikenal / gagal -> `/not-found`
 */

import React, { useEffect } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { fetchTrackingData } from "../lib/api";
import { saveRecentSearch } from "../hooks/useRecentSearches";
import { cleanResiInput, getRouteForResi } from "../data/shipmentsData";

export default function TrackingResolverPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawWaybill = searchParams.get("waybill_number") ?? "";
  const waybill = cleanResiInput(rawWaybill);

  // 1. Pengalihan Instan (0ms) untuk resi yang telah terdaftar di dataset lokal
  if (waybill) {
    const directRoute = getRouteForResi(waybill);
    if (!directRoute.startsWith("/cek-resi")) {
      saveRecentSearch(waybill);
      return <Navigate to={directRoute} replace />;
    }
  } else {
    return <Navigate to="/not-found" replace />;
  }

  // 2. Resolusi API Asinkron untuk resi baru dengan timeout ketat
  useEffect(() => {
    let active = true;

    async function resolveTracking() {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 750)
        );
        const result = await Promise.race([fetchTrackingData(waybill), timeoutPromise]);
        const status = result?.data?.order_status;
        saveRecentSearch(waybill);

        let path = "/not-found";
        if (status === "ORDER_CREATED") path = "/tracking/order-created";
        else if (status === "PICKUP_READY" || status === "COURIER_PROCESSED")
          path = "/tracking/courier-processed";
        else if (status === "IN_TRANSIT") path = "/tracking/in-transit";
        else if (status === "OUT_FOR_DELIVERY") path = "/tracking/out-for-delivery";
        else if (status === "DELIVERED") path = "/delivered";

        if (active) {
          navigate(`${path}?waybill_number=${waybill}`, { replace: true });
        }
      } catch {
        if (active) {
          navigate(`/not-found?waybill_number=${waybill}`, { replace: true });
        }
      }
    }

    resolveTracking();

    return () => {
      active = false;
    };
  }, [waybill, navigate]);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-20rem)] bg-surface items-center justify-center p-8">
      {/* Top progress indicator bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20 overflow-hidden">
        <div className="h-full bg-primary animate-pulse w-full" />
      </div>

      <div className="text-center flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-medium text-on-surface-variant">
          Menghubungkan status resi <strong className="font-mono text-on-surface">#{waybill}</strong>...
        </p>
      </div>
    </div>
  );
}
