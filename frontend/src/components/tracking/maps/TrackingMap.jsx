import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issues with Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function TrackingMap({ waypoints = [], activeIndex = 0, variant }) {
  const mapRef = useRef(null);
  
  // Default fallback center (Jakarta)
  const defaultCenter = [-6.2088, 106.8456];
  
  const activeWaypoint = waypoints[activeIndex] || waypoints[0];
  const currentCoord = activeWaypoint?.geo 
    ? [activeWaypoint.geo.lat, activeWaypoint.geo.lon] 
    : defaultCenter;

  const coordsList = waypoints.map(wp => wp.geo ? [wp.geo.lat, wp.geo.lon] : defaultCenter);

  // Auto-pan to current marker
  useEffect(() => {
    if (mapRef.current && currentCoord) {
      mapRef.current.flyTo(currentCoord, variant === "delivery" || variant === "delivered" ? 15 : 11, { duration: 1.5 });
    }
  }, [currentCoord, variant]);

  // Create a rich HTML marker that looks exactly like the old SVG pin
  const createCustomIcon = (wp, isActive) => {
    const isDelivery = variant === "delivery";
    const title = isDelivery && isActive ? wp.kurir || wp.label : wp.label;
    const subtitle = isDelivery && isActive 
      ? `${wp.sisaKm ?? 0} km lagi • ${wp.detail ?? ""}`
      : wp.detail;
    
    // Choose color based on variant
    let colorClass = "text-primary";
    let bgClass = "bg-primary";
    let borderClass = "border-primary/30";
    
    if (variant === "delivered") {
      colorClass = "text-tertiary";
      bgClass = "bg-tertiary";
      borderClass = "border-tertiary/30";
    }

    const htmlString = `
      <div class="flex flex-col items-center -ml-24 -mt-16 w-48">
        <div class="flex items-center gap-2 whitespace-nowrap rounded-xl border ${borderClass} bg-white px-3 py-1.5 shadow-lg">
          <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${bgClass} text-white shadow-sm">
            <span class="material-symbols-outlined text-[15px]">
              ${variant === "delivered" ? "inventory_2" : (isDelivery ? "local_shipping" : "local_shipping")}
            </span>
          </div>
          <div class="flex flex-col text-left">
            <span class="font-sans text-[11px] font-bold leading-tight ${colorClass}">
              ${title || ""}
            </span>
            <span class="mt-0.5 font-sans text-[9px] leading-none text-gray-500">
              ${subtitle || ""}
            </span>
          </div>
          ${isActive && variant !== "delivered" ? `<span class="ml-0.5 h-1.5 w-1.5 animate-ping rounded-full bg-green-500"></span>` : ""}
          ${variant === "delivered" ? `<span class="material-symbols-outlined ml-0.5 text-[16px] text-green-500">verified</span>` : ""}
        </div>
        <div class="-mt-1 h-2.5 w-2.5 rotate-45 border-b border-r ${borderClass} bg-white shadow-sm"></div>
        ${isActive ? `
        <div class="relative flex items-center justify-center h-8 w-8 mt-1">
          <span class="absolute inline-flex h-full w-full rounded-full ${bgClass.replace('bg-', 'bg-[')} opacity-30 animate-pulse"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 ${bgClass} border-2 border-white shadow"></span>
        </div>` : `
        <div class="h-3 w-3 rounded-full ${bgClass} border-2 border-white shadow mt-2"></div>
        `}
      </div>
    `;

    return new L.divIcon({
      className: "bg-transparent",
      html: htmlString,
      iconSize: [0, 0], // The offset is handled in HTML with -ml-24 -mt-16
      iconAnchor: [0, 0],
    });
  };

  return (
    <div className="absolute inset-0 h-full w-full z-0 bg-[#eef2f6]">
      <MapContainer
        center={currentCoord}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
        ref={mapRef}
        zoomControl={false}
      >
        <ZoomControl position="topright" />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {coordsList.length > 1 && (
          <Polyline 
            positions={coordsList} 
            color="#b30069" 
            weight={4} 
            opacity={0.7} 
            dashArray={variant === "delivery" ? "8, 8" : undefined} 
          />
        )}

        {/* Origin / Past Waypoints */}
        {coordsList.map((coord, idx) => {
           if (idx !== activeIndex) {
              return (
                <Marker key={idx} position={coord} icon={createCustomIcon(waypoints[idx], false)} />
              )
           }
           return null;
        })}

        {/* Current Active Waypoint */}
        <Marker position={currentCoord} icon={createCustomIcon(activeWaypoint, true)} zIndexOffset={1000} />
      </MapContainer>
    </div>
  );
}
