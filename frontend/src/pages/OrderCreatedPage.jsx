import { useSearchParams } from "react-router-dom";

import TrackingStatusLayout from "@/components/tracking/TrackingStatusLayout";
import { ORDER_CREATED_DATA } from "@/data/orderCreatedData";

/**
 * Halaman status pelacakan: "Pesanan Dibuat".
 *
 * Kondisi ketika pengirim baru membuat pesanan dan paket belum dijemput
 * Satria — belum ada posisi GPS dan kurir pengantaran belum dialokasikan.
 * Tata letak ditangani TrackingStatusLayout.
 */
export default function OrderCreatedView() {
  const [searchParams] = useSearchParams();
  const waybill =
    searchParams.get("waybill_number") || ORDER_CREATED_DATA.waybill;

  // Data masih statis; `waybill` dipakai agar nomor resi dari URL ikut tampil.
  const data = { ...ORDER_CREATED_DATA, waybill };

  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface">
      <div className="flex w-full flex-col">
        <TrackingStatusLayout data={data} />
      </div>
    </main>
  );
}
