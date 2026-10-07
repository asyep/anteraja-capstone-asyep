import { useRef, useState } from "react";
import { fetchShipment } from "@/shared/lib/api";
import { useShipmentContext } from "@/features/tracking/context/ShipmentContext";

export default function useShipmentData() {
  const { recordShipment } = useShipmentContext();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestInFlight = useRef(false);

  async function searchShipment(waybill) {
    if (requestInFlight.current) return null;

    requestInFlight.current = true;
    setLoading(true);
    setError("");

    try {
      const result = await fetchShipment(waybill);
      setShipment(result);
      recordShipment(result);
      return result;
    } catch (requestError) {
      const message =
        requestError.name === "AbortError"
          ? ""
          : requestError.message ||
            "Terjadi gangguan saat mencari nomor resi. Silakan coba kembali.";
      setError(message);
      return null;
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  }

  return { shipment, loading, error, searchShipment };
}