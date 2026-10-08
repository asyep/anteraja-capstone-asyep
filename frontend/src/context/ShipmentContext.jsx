import { createContext, useContext, useState } from "react";

const ShipmentContext = createContext(null);

export function ShipmentProvider({ children }) {
  const [activeShipment, setActiveShipment] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [userName, setUserName] = useState(() => {
    if (typeof window === "undefined") return "Asep";
    return window.sessionStorage.getItem("activeUser") || "Asep";
  });

  function updateUserName(name) {
    setUserName(name);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("activeUser", name);
    }
  }

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

export function useShipmentContext() {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error("useShipmentContext must be used within ShipmentProvider");
  }
  return context;
}