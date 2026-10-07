import { useSearchParams } from "react-router-dom";

import TrackingStatusLayout from "@/features/tracking/components/TrackingStatusLayout";
import { OUT_FOR_DELIVERY_DATA } from "@/features/tracking/data/outForDeliveryData";

/**
 * Halaman status pelacakan: "Dalam Pengantaran".
 *
 * Kondisi ketika paket sudah dibawa Satria (kurir) dan sedang menuju alamat
 * penerima — tahap terakhir sebelum paket diterima.
 *
 * "Radar Posisi Paket" bergerak otomatis mendekati alamat penerima
 * (lihat data/deliveryRoutes.js + hooks/useTransitAnimation.js).
 */
export default function OutForDeliveryView() {
  const [searchParams] = useSearchParams();
  const waybill =
    searchParams.get("waybill_number") || OUT_FOR_DELIVERY_DATA.waybill;

  const data = { ...OUT_FOR_DELIVERY_DATA, waybill };

  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface">
      <div className="flex w-full flex-col">
        <TrackingStatusLayout data={data} />
      </div>
    </main>
  );
}
