import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TrackingLoadingState from "../components/tracking/TrackingLoadingState";

export default function TrackingResolverPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const waybill = searchParams.get("waybill_number")?.trim() ?? "";

  useEffect(() => {
    let active = true;
    
    async function resolveTracking() {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/tracking/${waybill}`);
        if (!response.ok) {
           navigate(`/not-found?waybill_number=${waybill}`, { replace: true });
           return;
        }
        const result = await response.json();
        const status = result.data.order_status;
        
        let path = "/not-found";
        if (status === "ORDER_CREATED") path = "/tracking/order-created";
        else if (status === "PICKUP_READY" || status === "COURIER_PROCESSED") path = "/tracking/courier-processed";
        else if (status === "IN_TRANSIT") path = "/tracking/in-transit";
        else if (status === "OUT_FOR_DELIVERY") path = "/tracking/out-for-delivery";
        else if (status === "DELIVERED") path = "/delivered";
        
        if (active) {
           navigate(`${path}?waybill_number=${waybill}`, { replace: true });
        }
      } catch (error) {
        if (active) {
           navigate(`/not-found?waybill_number=${waybill}`, { replace: true });
        }
      }
    }
    
    if (waybill) {
      resolveTracking();
    } else {
      navigate(`/not-found?waybill_number=${waybill}`, { replace: true });
    }

    return () => {
      active = false;
    };
  }, [waybill, navigate]);

  return <TrackingLoadingState waybill={waybill} />;
}
