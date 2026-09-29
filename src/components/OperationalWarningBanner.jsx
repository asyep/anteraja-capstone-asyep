import React from 'react';

export default function OperationalWarningBanner({ shipment }) {
  // Guard clause
  if (!shipment) return null;

  const { has_delay, logistics_delay_reason, traffic_status } = shipment;

  // Jika tidak ada delay (has_delay === false), komponen tidak dirender (return null)
  if (!has_delay) {
    return null;
  }

  // Pemetaan translasi reason agar lebih user-friendly (Opsional, tapi bagus untuk UX Indonesia)
  const delayReasonTranslate = {
    'Weather': 'Cuaca Buruk',
    'Traffic Jam': 'Kemacetan Panjang',
    'Mechanical Failure': 'Kendala Teknis Armada',
    'None': 'Lainnya'
  };
  const reasonText = delayReasonTranslate[logistics_delay_reason] || logistics_delay_reason;

  const trafficTranslate = {
    'Clear': 'Lancar',
    'Heavy': 'Padat',
    'Detour': 'Pengalihan Rute'
  };
  const trafficText = trafficTranslate[traffic_status] || traffic_status;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
      <div className="text-amber-500 mt-0.5 shrink-0 bg-white p-1 rounded-full shadow-sm">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <h3 className="text-sm font-bold text-amber-800 tracking-wide uppercase mb-1">Peringatan Operasional</h3>
        <p className="text-sm font-medium text-amber-900 leading-relaxed">
          Perhatian: Terdapat kendala {reasonText} (Kondisi Lalu Lintas: {trafficText}) di jalur transit.
        </p>
      </div>
    </div>
  );
}
