import { useState } from "react";
import { SHIPPING_SERVICES } from "../utils/constants";
import { formatIndonesianDate, formatRupiah } from "../utils/formatters";

export default function useShippingCalculator() {
  const [weight, setWeight] = useState("1");
  const [service, setService] = useState("reguler");
  const selectedService = SHIPPING_SERVICES[service];
  const numericWeight = Math.max(0, Number(weight) || 0);
  const price = Math.round(numericWeight * selectedService.rate);
  const eta = new Date();
  eta.setDate(eta.getDate() + selectedService.days);

  return {
    weight,
    setWeight,
    service,
    setService,
    services: SHIPPING_SERVICES,
    priceText: formatRupiah(price),
    etaText:
      selectedService.days === 0 ? "Hari ini" : formatIndonesianDate(eta),
  };
}