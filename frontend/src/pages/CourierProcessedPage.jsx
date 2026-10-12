/**
 * =============================================================================
 * CourierProcessedPage.jsx - Halaman Status: "Diproses Kurir" (Milestone 2)
 * =============================================================================
 * Menampilkan rincian pelacakan paket pada tahap saat paket telah di-pickup
 * oleh kurir Satria atau sedang diproses di fasilitas staging/hub asal Anteraja.
 *
 * Fitur:
 * - Mengambil nomor resi aktif dari query parameter `?waybill_number=...`.
 * - Melakukan sinkronisasi data live melalui hook `useTrackingDetail`.
 * - Menggabungkan data live dengan template visual `COURIER_PROCESSED_DATA`.
 * - Menampilkan loading bar non-blocking di bagian atas saat revalidasi data.
 */

import React from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import TrackingStatusLayout from "../components/tracking/TrackingStatusLayout";
import { COURIER_PROCESSED_DATA } from "../data/courierProcessedData";
import { useTrackingDetail, mergeShipmentData } from "../hooks/useTrackingDetail";
import { cleanResiInput, getRouteForResi } from "../data/shipmentsData";

export default function CourierProcessedPage() {
  const [searchParams] = useSearchParams();
  const rawWaybill = searchParams.get("waybill_number");
  const waybill = rawWaybill ? cleanResiInput(rawWaybill) : COURIER_PROCESSED_DATA.waybill;

  // Jika nomor resi diberikan di URL, validasi kesesuaian status.
  // Resi anomali atau tidak terdaftar dialihkan langsung ke rute yang semestinya (/not-found).
  if (rawWaybill) {
    const expectedRoute = getRouteForResi(waybill);
    if (!expectedRoute.startsWith("/tracking/courier-processed")) {
      return <Navigate to={expectedRoute} replace />;
    }
  }

  // Mengambil data detail pelacakan secara reaktif
  const { data: apiData, loading, error } = useTrackingDetail(waybill);

  // Tampilan darurat bila terjadi kegagalan fatal tanpa cache
  if (error && !apiData) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Terjadi kendala saat memuat pelacakan: {error}
      </div>
    );
  }

  // Menggabungkan data master/API ke dalam struktur tampilan
  const mergedData = mergeShipmentData(COURIER_PROCESSED_DATA, apiData);

  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface relative">
      {/* Indikator loading halus di bagian atas layar */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20 overflow-hidden">
          <div className="h-full bg-primary animate-pulse w-full" />
        </div>
      )}

      {/* Konten layout pelacakan utama */}
      <div className="flex w-full flex-col">
        <TrackingStatusLayout data={mergedData} />
      </div>
    </main>
  );
}
