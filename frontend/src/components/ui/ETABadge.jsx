import React from "react";
import { formatIndonesianDate, formatWibTime } from "@/lib/formatters";

export default function DynamicETABadge({ shipment }) {
  if (!shipment) return null;

  const {
    order_status,
    order_estimated_delivery_date,
    order_delivered_customer_date,
  } = shipment;

  const formatEstimatedDate = (value) => {
    const date = formatIndonesianDate(value);
    const time = formatWibTime(value);
    return date ? `${date}${time ? `, Est. ${time} WIB` : ""}` : "Tanggal estimasi belum tersedia";
  };

  const formatDeliveredDate = (value) => {
    const date = formatIndonesianDate(value);
    const time = formatWibTime(value);
    return date ? `${date}${time ? `, ${time} WIB` : ""}` : "";
  };

  const isDelivered = order_status === "delivered";
  const isCanceled = order_status === "canceled";

  if (isDelivered) {
    return (
      <div className="bg-success/10 border border-success/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all shadow-sm">
        <div className="bg-success text-white rounded-full p-2 shadow-sm shadow-success/30 shrink-0">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-success/80 mb-0.5">
            Berhasil Terkirim
          </p>
          <p className="text-base sm:text-lg font-bold text-success-800">
            Paket Telah Tiba pada{" "}
            {formatDeliveredDate(order_delivered_customer_date)}
          </p>
        </div>
      </div>
    );
  }

  if (isCanceled) {
    return (
      <div className="bg-stone-100 border border-stone-200 rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all shadow-sm">
        <div className="bg-stone-400 text-white rounded-full p-2 shrink-0">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div>
          <p className="text-base sm:text-lg font-bold text-stone-700">
            Pengiriman Dibatalkan
          </p>
        </div>
      </div>
    );
  }

  // Tampilan Default (Sedang Diproses/Transit/Pickup)
  return (
    <div className="bg-white border border-stone-200/70 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm shadow-stone-100">
      <div className="flex items-center gap-4">
        <div className="bg-magenta/10 text-magenta rounded-full p-2 shrink-0">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">
            Estimasi Waktu Tiba
          </p>
          <p className="text-base sm:text-lg font-black text-ink">
            {formatEstimatedDate(order_estimated_delivery_date)}
          </p>
        </div>
      </div>
    </div>
  );
}
