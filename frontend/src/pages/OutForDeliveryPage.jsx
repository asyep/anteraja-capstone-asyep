/**
 * =============================================================================
 * OutForDeliveryPage.jsx - Halaman Status: "Sedang Diantar" (Milestone 4)
 * =============================================================================
 * Menampilkan rincian pelacakan paket pada tahap last-mile delivery, di mana
 * kurir Satria sedang mengantarkan paket langsung ke alamat tujuan penerima.
 *
 * Fitur:
 * - Mengambil nomor resi aktif dari query parameter `?waybill_number=...`.
 * - Melakukan sinkronisasi data live melalui hook `useTrackingDetail`.
 * - Menggabungkan data live dengan template visual `OUT_FOR_DELIVERY_DATA`.
 * - Menampilkan profil kurir Satria (nama, foto, plat nomor) dan posisi GPS real-time.
 */

import React from "react";
import { useSearchParams } from "react-router-dom";
import TrackingStatusLayout from "../components/tracking/TrackingStatusLayout";
import { OUT_FOR_DELIVERY_DATA } from "../data/outForDeliveryData";
import { useTrackingDetail, mergeShipmentData } from "../hooks/useTrackingDetail";

export default function OutForDeliveryPage() {
  const [searchParams] = useSearchParams();
  const waybill = searchParams.get("waybill_number") || OUT_FOR_DELIVERY_DATA.waybill;

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
  const mergedData = mergeShipmentData(OUT_FOR_DELIVERY_DATA, apiData);

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
