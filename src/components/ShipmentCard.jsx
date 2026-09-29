import React from 'react';

export default function ShipmentCard({ shipment, isActive, onSelect }) {
  const { waybill_number, order_status, seller_city, customer_city, has_delay } = shipment;

  const getStatusDisplay = () => {
    if (order_status === 'canceled') return { label: 'Dibatalkan', color: 'bg-stone-100 text-stone-600' };
    if (order_status === 'delivered') return { label: 'Telah Tiba', color: 'bg-success/10 text-success-800' };
    if (has_delay) return { label: 'Terkendala', color: 'bg-amber-100 text-amber-800' };
    return { label: 'Dalam Perjalanan', color: 'bg-magenta/10 text-magenta' };
  };

  const statusInfo = getStatusDisplay();

  return (
    <button
      onClick={() => onSelect(waybill_number)}
      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        isActive 
          ? 'border-magenta bg-magenta/5 ring-1 ring-magenta shadow-sm' 
          : 'border-stone-200 bg-white hover:border-magenta/40 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <p className="font-mono text-sm font-bold text-ink break-all mr-3 leading-none">
          {waybill_number}
        </p>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap uppercase tracking-wide ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted font-medium">
        <span className="truncate max-w-[120px]">{seller_city}</span>
        <svg className="w-3.5 h-3.5 text-stone-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        <span className="truncate max-w-[120px]">{customer_city}</span>
      </div>
    </button>
  );
}
