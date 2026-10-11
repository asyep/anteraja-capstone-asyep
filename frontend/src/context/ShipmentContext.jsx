/**
 * =============================================================================
 * ShipmentContext.jsx - State Management Global untuk Pelacakan Pengiriman
 * =============================================================================
 * Berfungsi untuk menyimpan dan mendistribusikan data pelacakan yang sedang aktif,
 * riwayat pencarian pengguna (recent searches), dan identitas sesi pengguna ke
 * seluruh komponen tanpa perlu prop-drilling.
 */

import { createContext, useContext, useState } from "react";

// Inisialisasi Context
const ShipmentContext = createContext(null);

/**
 * Provider pembungkus aplikasi yang mengelola state bersama:
 * - `activeShipment`: Data pengiriman yang saat ini sedang dibuka.
 * - `searchHistory`: Daftar maksimal 10 nomor resi yang baru saja dicari.
 * - `userName`: Nama pengguna yang aktif (disimpan di sessionStorage).
 */
export function ShipmentProvider({ children }) {
  const [activeShipment, setActiveShipment] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [userName, setUserName] = useState(() => {
    if (typeof window === "undefined") return "Asep";
    return window.sessionStorage.getItem("activeUser") || "Asep";
  });

  /**
   * Mengubah nama pengguna aktif dan menyimpannya ke sessionStorage.
   * @param {string} name - Nama pengguna baru.
   */
  function updateUserName(name) {
    setUserName(name);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("activeUser", name);
    }
  }

  /**
   * Menyimpan resi aktif dan memperbarui daftar riwayat pencarian unik (maks. 10 item).
   * @param {Object} shipment - Objek data pengiriman.
   */
  function recordShipment(shipment) {
    setActiveShipment(shipment);
    setSearchHistory((history) => [
      shipment,
      ...history.filter(
        (item) => item.waybill_number !== shipment.waybill_number,
      ),
    ].slice(0, 10));
  }

  return (
    <ShipmentContext.Provider
      value={{
        activeShipment,
        setActiveShipment,
        searchHistory,
        recordShipment,
        userName,
        setUserName: updateUserName,
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
}

/**
 * Custom hook untuk mengakses ShipmentContext dengan validasi guard.
 * @returns {{ activeShipment, setActiveShipment, searchHistory, recordShipment, userName, setUserName }}
 */
export function useShipmentContext() {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error("useShipmentContext must be used within ShipmentProvider");
  }
  return context;
}