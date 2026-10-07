import React, { useEffect } from "react";

/**
 * Notifikasi ringan (pengganti alert bawaan browser) supaya aksi seperti
 * "Salin" tetap punya umpan balik tanpa memblokir halaman.
 */
export default function Toast({ open, message, onClose, duration = 2400 }) {
  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-8 z-[60] flex justify-center px-4"
      role="status"
    >
      <div className="flex items-center gap-2 rounded-full bg-on-surface px-5 py-3 text-white shadow-lg">
        <span className="material-symbols-outlined text-[18px] text-[#8dfc6e]">
          check_circle
        </span>
        <span className="font-label-md text-label-md font-semibold">
          {message}
        </span>
      </div>
    </div>
  );
}
