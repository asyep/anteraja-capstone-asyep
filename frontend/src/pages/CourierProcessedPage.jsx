import { useSearchParams } from "react-router-dom";

import TrackingStatusLayout from "@/components/tracking/TrackingStatusLayout";
import { COURIER_PROCESSED_DATA } from "@/data/courierProcessedData";

/**
 * Halaman status pelacakan: "Sedang Diproses Kurir".
 *
 * Kondisi ketika paket sudah dijemput Satria Pickup dan tiba di Hub
 * Distribusi (Staging DC) kota asal — belum masuk tahap perjalanan ke
 * kota tujuan.
 * Tata letak ditangani TrackingStatusLayout.
 */
export default function CourierProcessedPage() {
  const [searchParams] = useSearchParams();
  const waybill =
    searchParams.get("waybill_number") || COURIER_PROCESSED_DATA.waybill;

  const data = { ...COURIER_PROCESSED_DATA, waybill };

  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface">
      <div className="flex w-full flex-col">
        <TrackingStatusLayout data={data} />
      </div>
    </main>
  );
}
