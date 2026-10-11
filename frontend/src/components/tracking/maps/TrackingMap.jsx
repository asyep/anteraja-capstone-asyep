/**
 * =============================================================================
 * TrackingMap.jsx - Komponen Peta Interaktif Pelacakan Pengiriman (Leaflet)
 * =============================================================================
 * Menampilkan visualisasi geografis interaktif perjalanan paket:
 * 1. Base Map: OpenStreetMap tiles dengan kustomisasi kontrol zoom Leaflet.
 * 2. Visualisasi Rute: Polyline garis rute pengiriman (Hub asal -> Hub tujuan / Penerima).
 * 3. Custom Markers:
 *    - Marker Kurir/Armada dengan kalkulasi arah rotasi sudut (*bearing*).
 *    - Marker Lokasi Hub & Titik Drop-off Tujuan.
 * 4. Pengontrol Kamera Cerdas (`StaticMapController`):
 *    - Auto-centering posisi awal tanpa memaksa animasi saat pengguna sedang menggeser peta.
 */

import React, { useEffect, useRef, useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Inisialisasi perbaikan icon default Leaflet di lingkungan bundling Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});


function getBearing(startLat, startLng, endLat, endLng) {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const endLatRad = (endLat * Math.PI) / 180;
  const endLngRad = (endLng * Math.PI) / 180;
  const dLng = endLngRad - startLngRad;
  const y = Math.sin(dLng) * Math.cos(endLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(endLatRad) -
    Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(dLng);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Komponen pengontrol kamera peta yang tenang dan stabil.
 * - Memposisikan mobil di tengah (center) saat peta pertama kali dibuka.
 * - TIDAK ada animasi flyTo berulang yang membuat peta goyang atau zoom in/out sendiri.
 * - Jika user menyentuh/menggeser peta, peta bebas digerakkan user tanpa ditarik paksa.
 */
function StaticMapController({ centerLat, centerLon, zoom }) {
  const map = useMap();
  const userInteractedRef = useRef(false);
  const prevCoordKeyRef = useRef(null);

  useEffect(() => {
    const handleUserInteraction = () => {
      userInteractedRef.current = true;
    };

    map.on("dragstart", handleUserInteraction);
    map.on("zoomstart", handleUserInteraction);
    map.on("touchstart", handleUserInteraction);

    return () => {
      map.off("dragstart", handleUserInteraction);
      map.off("zoomstart", handleUserInteraction);
      map.off("touchstart", handleUserInteraction);
    };
  }, [map]);

  useEffect(() => {
    const coordKey = `${centerLat.toFixed(4)},${centerLon.toFixed(4)},${zoom}`;
    if (prevCoordKeyRef.current !== coordKey) {
      prevCoordKeyRef.current = coordKey;
      // Hanya atur posisi awal jika pengguna belum menggeser peta secara manual
      if (!userInteractedRef.current) {
        map.setView([centerLat, centerLon], zoom, { animate: false });
      }
    }
  }, [centerLat, centerLon, zoom, map]);

  return null;
}

export default function TrackingMap({ waypoints = [], activeIndex = 0, variant, telemetryGeo, destinationAddress }) {
  const isTransit = variant === "transit";
  const isDelivery = variant === "delivery";
  const isMovingVehicle = (isTransit || isDelivery) && waypoints.length >= 2;
  
  // Default fallback center (Jakarta)
  const defaultCenter = [-6.2088, 106.8456];
  
  const activeWaypoint = waypoints[activeIndex] || waypoints[0];
  const centerLat = telemetryGeo?.lat ?? activeWaypoint?.geo?.lat ?? defaultCenter[0];
  const centerLon = telemetryGeo?.lon ?? activeWaypoint?.geo?.lon ?? defaultCenter[1];

  const coordsList = useMemo(
    () => waypoints.map((wp) => (wp.geo ? [wp.geo.lat, wp.geo.lon] : defaultCenter)),
    [waypoints]
  );

  // State untuk pergerakan kendaraan navigasi (truk di transit, motor di delivery)
  const [vehicleCoord, setVehicleCoord] = useState(() => {
    if (isDelivery && waypoints[0]?.geo) {
      return [waypoints[0].geo.lat, waypoints[0].geo.lon];
    }
    return [centerLat, centerLon];
  });
  const [vehicleBearing, setVehicleBearing] = useState(65);

  // Animasi pergerakan kendaraan pelan dan mulus di jalurnya (peta tetap diam dan tenang)
  useEffect(() => {
    if (!isMovingVehicle || waypoints.length < 2) {
      setVehicleCoord([centerLat, centerLon]);
      return;
    }

    let animId;
    let lastTime = performance.now();

    if (isTransit) {
      // Varian Transit: Truk kargo antar-kota bergerak di jalur tol
      const segmentDuration = 25000;
      const segIndex = Math.max(0, Math.min(activeIndex, waypoints.length - 2));
      const pA = telemetryGeo && segIndex === activeIndex 
        ? telemetryGeo 
        : (waypoints[segIndex]?.geo || { lat: centerLat, lon: centerLon });
      const pB = waypoints[segIndex + 1]?.geo || pA;

      const bearing = getBearing(pA.lat, pA.lon, pB.lat, pB.lon);
      setVehicleBearing(bearing);

      let progress = 0.05;

      const tickTransit = (now) => {
        const dt = now - lastTime;
        lastTime = now;

        progress += dt / segmentDuration;
        if (progress >= 0.95) {
          progress = 0.05;
        }

        if (pA && pB) {
          const curLat = pA.lat + (pB.lat - pA.lat) * progress;
          const curLon = pA.lon + (pB.lon - pA.lon) * progress;
          if (Number.isFinite(curLat) && Number.isFinite(curLon)) {
            setVehicleCoord([curLat, curLon]);
          }
        }

        animId = requestAnimationFrame(tickTransit);
      };

      animId = requestAnimationFrame(tickTransit);
      return () => cancelAnimationFrame(animId);
    }

    if (isDelivery) {
      // Varian Delivery: Motor Kurir Satria bergerak di rute jalan menuju alamat rumah penerima
      // Bergerak menyusuri rute dari titik awal hingga tiba di alamat rumah penerima
      const routePoints = waypoints.map((wp) => wp.geo).filter(Boolean);

      if (routePoints.length < 2) {
        setVehicleCoord([centerLat, centerLon]);
        return;
      }

      // Hitung panjang tiap segmen jalan untuk laju motor yang proporsional & natural
      const segments = [];
      let totalDist = 0;
      for (let i = 0; i < routePoints.length - 1; i++) {
        const a = routePoints[i];
        const b = routePoints[i + 1];
        const dist = Math.hypot(b.lat - a.lat, b.lon - a.lon) || 0.0001;
        const bearing = getBearing(a.lat, a.lon, b.lat, b.lon);
        segments.push({ a, b, dist, bearing });
        totalDist += dist;
      }

      if (segments.length === 0 || totalDist <= 0) {
        setVehicleCoord([centerLat, centerLon]);
        return;
      }

      // Set posisi awal motor di titik awal rute
      setVehicleCoord([routePoints[0].lat, routePoints[0].lon]);
      setVehicleBearing(segments[0].bearing);

      // Durasi perjalanan motor kurir: 15 detik menyusuri jalan ke rumah penerima
      const tripDuration = 15000;
      let progress = 0.01;
      let pauseTimer = 0;

      const tickDelivery = (now) => {
        const dt = now - lastTime;
        lastTime = now;

        if (pauseTimer > 0) {
          pauseTimer -= dt;
          animId = requestAnimationFrame(tickDelivery);
          return;
        }

        progress += dt / tripDuration;
        if (progress >= 0.98) {
          progress = 0.01;
          pauseTimer = 1600; // Berhenti sejenak di rumah penerima saat paket sampai sebelum loop
        }

        const currentDist = progress * totalDist;
        let accum = 0;
        let activeSeg = segments[0];
        let segFraction = 0;

        for (let i = 0; i < segments.length; i++) {
          const seg = segments[i];
          if (currentDist <= accum + seg.dist || i === segments.length - 1) {
            activeSeg = seg;
            segFraction = Math.max(0, Math.min(1, (currentDist - accum) / seg.dist));
            break;
          }
          accum += seg.dist;
        }

        if (activeSeg) {
          const curLat = activeSeg.a.lat + (activeSeg.b.lat - activeSeg.a.lat) * segFraction;
          const curLon = activeSeg.a.lon + (activeSeg.b.lon - activeSeg.a.lon) * segFraction;
          if (Number.isFinite(curLat) && Number.isFinite(curLon)) {
            setVehicleCoord([curLat, curLon]);
          }
          setVehicleBearing(activeSeg.bearing);
        }

        animId = requestAnimationFrame(tickDelivery);
      };

      animId = requestAnimationFrame(tickDelivery);
      return () => cancelAnimationFrame(animId);
    }
  }, [isTransit, isDelivery, isMovingVehicle, waypoints, isTransit ? activeIndex : null, telemetryGeo, centerLat, centerLon]);

  // Icon Gambar Truk Armada Navigasi (Top-Down Bird's Eye View Truk Box Kargo Linehaul Anteraja)
  const createTruckIcon = (bearing) => {
    const htmlString = `
      <div style="position: relative; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
        <!-- Gelombang GPS Telemetri Berdenyut Halus -->
        <div style="position: absolute; width: 38px; height: 38px; border-radius: 9999px; background: rgba(236, 0, 140, 0.22); animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>

        <!-- Bodi Truk Box Berputar Sesuai Jalur Navigasi Tol/Jalan -->
        <div style="
          position: relative;
          width: 28px;
          height: 50px;
          transform: rotate(${Math.round(bearing)}deg);
          transition: transform 0.2s linear;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.42));
        ">
          <!-- Gambar Truk Box Logistik Top-Down (SVG) -->
          <svg width="28" height="50" viewBox="0 0 28 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="truckHeadlightMini" x1="14" y1="8" x2="14" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="truckCabGradMini" x1="4" y1="7" x2="24" y2="20" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#ff2a9d"/>
                <stop offset="50%" stop-color="#ec008c"/>
                <stop offset="100%" stop-color="#b80066"/>
              </linearGradient>
              <linearGradient id="truckBoxGradMini" x1="2" y1="20" x2="26" y2="47" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="55%" stop-color="#f8fafc"/>
                <stop offset="100%" stop-color="#e2e8f0"/>
              </linearGradient>
              <linearGradient id="truckWindshieldMini" x1="14" y1="9" x2="14" y2="15" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#1e293b"/>
                <stop offset="100%" stop-color="#0f172a"/>
              </linearGradient>
            </defs>

            <!-- Sorot Lampu Depan Menyala Terang ke Jalan -->
            <polygon points="6,8 0,0 28,0 22,8" fill="url(#truckHeadlightMini)" opacity="0.8" />

            <!-- Roda Depan (Kiri & Kanan) -->
            <rect x="1" y="11" width="3" height="6.5" rx="1.5" fill="#0f172a" />
            <rect x="24" y="11" width="3" height="6.5" rx="1.5" fill="#0f172a" />

            <!-- Roda Belakang Tandem/Ganda Khas Truk Muatan Kargo -->
            <rect x="1" y="31" width="3" height="11" rx="1.5" fill="#0f172a" />
            <rect x="24" y="31" width="3" height="11" rx="1.5" fill="#0f172a" />

            <!-- Spion Truk Samping Kiri & Kanan -->
            <path d="M4 13 L0.8 12.5 C0.3 12.5 0 12.8 0 13.5 L0 14.5 C0 15.2 0.3 15.5 0.8 15.5 L4 15 Z" fill="#ec008c" />
            <path d="M24 13 L27.2 12.5 C27.7 12.5 28 12.8 28 13.5 L28 14.5 C28 15.2 27.7 15.5 27.2 15.5 L24 15 Z" fill="#ec008c" />

            <!-- Kepala Kabin Truk (Cab) -->
            <path d="M4.5 13 C4.5 8.5 7 7 14 7 C21 7 23.5 8.5 23.5 13 L23.5 20 L4.5 20 Z" fill="url(#truckCabGradMini)" stroke="#ffffff" stroke-width="0.8" />

            <!-- Kaca Depan Truk (Windshield) -->
            <path d="M6 13.5 C6 10.5 8 9.5 14 9.5 C20 9.5 22 10.5 22 13.5 L21 15 L7 15 Z" fill="url(#truckWindshieldMini)" stroke="#ffffff" stroke-width="0.4" />
            <path d="M8 10.5 L10 10 L12 14.5 L10 14.5 Z" fill="#ffffff" opacity="0.45" />

            <!-- Topi Kabin / Spoiler Aerodinamis Atap Truk -->
            <rect x="8" y="16" width="12" height="3" rx="1" fill="#c00072" stroke="#ffffff" stroke-width="0.4" opacity="0.9" />

            <!-- Lampu Depan Truk (Kuning Terang) -->
            <circle cx="6.5" cy="8" r="1.3" fill="#fef08a" />
            <circle cx="21.5" cy="8" r="1.3" fill="#fef08a" />

            <!-- Box Kontainer Belakang (Cargo Box Muatan Besar) -->
            <rect x="2.5" y="19" width="23" height="27.5" rx="2.5" fill="url(#truckBoxGradMini)" stroke="#94a3b8" stroke-width="0.8" />

            <!-- Rusuk Profil Atap Box Kontainer -->
            <line x1="7" y1="21" x2="7" y2="44.5" stroke="#cbd5e1" stroke-width="0.75" />
            <line x1="11" y1="21" x2="11" y2="44.5" stroke="#e2e8f0" stroke-width="0.75" />
            <line x1="17" y1="21" x2="17" y2="44.5" stroke="#e2e8f0" stroke-width="0.75" />
            <line x1="21" y1="21" x2="21" y2="44.5" stroke="#cbd5e1" stroke-width="0.75" />

            <!-- Strip Kargo Kontainer Anteraja Magenta -->
            <rect x="12" y="23" width="4" height="20" rx="1" fill="#ec008c" />
            <rect x="13" y="25" width="2" height="16" rx="0.5" fill="#ffffff" opacity="0.7" />

            <!-- Palang Pintu Pengaman Belakang Box -->
            <rect x="3.5" y="45.5" width="21" height="1" fill="#64748b" />
            <rect x="8.5" y="44.5" width="1.5" height="2.5" fill="#334155" />
            <rect x="18" y="44.5" width="1.5" height="2.5" fill="#334155" />

            <!-- Lampu Rem Belakang (Merah Terang) & Bumper -->
            <rect x="3.5" y="46.8" width="4" height="1.4" rx="0.6" fill="#ef4444" />
            <rect x="20.5" y="46.8" width="4" height="1.4" rx="0.6" fill="#ef4444" />
            <rect x="11.5" y="47.2" width="5" height="1" fill="#334155" />
          </svg>
        </div>
      </div>
    `;

    return new L.divIcon({
      className: "bg-transparent",
      html: htmlString,
      iconSize: [52, 52],
      iconAnchor: [26, 26],
    });
  };

  // Icon Gambar Sepeda Motor Kurir Satria (Top-Down Bird's Eye View Motor Kurir Anteraja)
  const createMotorcycleIcon = (bearing) => {
    const htmlString = `
      <div style="position: relative; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
        <!-- Gelombang GPS Telemetri Motor Satria Berdenyut -->
        <style>
          @keyframes satriaPulse {
            0% { transform: scale(0.7); opacity: 0.85; }
            70% { transform: scale(1.6); opacity: 0; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        </style>
        <div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: rgba(236, 0, 140, 0.35); animation: satriaPulse 2s ease-out infinite; pointer-events: none;"></div>

        <!-- Bodi Motor Satria Berputar Mengikuti Jalur Jalan -->
        <div style="
          position: relative;
          width: 26px;
          height: 46px;
          transform: rotate(${Math.round(bearing)}deg);
          transition: transform 0.15s linear;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45));
        ">
          <!-- Gambar Motor Kurir Satria Top-Down (SVG) -->
          <svg width="26" height="46" viewBox="0 0 26 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Sorot Lampu Depan Motor (Headlight Beam) -->
              <linearGradient id="motoHeadlightMini" x1="13" y1="8" x2="13" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
              </linearGradient>
              <!-- Bodi & Tangki Motor Magenta Anteraja -->
              <linearGradient id="motoBodyGrad" x1="9" y1="11" x2="17" y2="23" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#ff1a9b"/>
                <stop offset="60%" stop-color="#ec008c"/>
                <stop offset="100%" stop-color="#990055"/>
              </linearGradient>
            </defs>

            <!-- Sorot Lampu Depan Menyala Terang ke Jalan -->
            <polygon points="11,8 3,0 23,0 15,8" fill="url(#motoHeadlightMini)" opacity="0.85" />

            <!-- Ban Depan Motor -->
            <rect x="11.5" y="4" width="3" height="8" rx="1.5" fill="#0f172a" />

            <!-- Spakbor Depan Magenta -->
            <rect x="11" y="6" width="4" height="4.5" rx="1.2" fill="#ec008c" />

            <!-- Stang Motor & Spion -->
            <path d="M5 12 C9 11 17 11 21 12" stroke="#334155" stroke-width="2.4" stroke-linecap="round" />
            <!-- Handgrip Kiri & Kanan -->
            <rect x="3.5" y="11" width="2.4" height="3" rx="0.6" fill="#0f172a" />
            <rect x="20.1" y="11" width="2.4" height="3" rx="0.6" fill="#0f172a" />
            <!-- Kaca Spion Bulat Khas Motor -->
            <circle cx="3.8" cy="9" r="1.4" fill="#ec008c" stroke="#ffffff" stroke-width="0.5" />
            <circle cx="22.2" cy="9" r="1.4" fill="#ec008c" stroke="#ffffff" stroke-width="0.5" />

            <!-- Lampu Utama Depan (Kuning Terang) -->
            <circle cx="13" cy="8" r="1.5" fill="#fef08a" />

            <!-- Tangki Bensin / Bodi Depan Motor -->
            <path d="M9.5 12 L16.5 12 L16 19 L10 19 Z" fill="url(#motoBodyGrad)" stroke="#ffffff" stroke-width="0.5" />

            <!-- Badan & Bahu Kurir Satria (Jaket Magenta Anteraja) -->
            <ellipse cx="13" cy="20" rx="7" ry="4.2" fill="#ec008c" stroke="#ffffff" stroke-width="0.7" />

            <!-- Helm Kurir Satria (Tampak Atas) -->
            <ellipse cx="13" cy="18" rx="4.2" ry="4.6" fill="#0f172a" stroke="#ec008c" stroke-width="0.9" />
            <!-- Kaca Helm (Visor Glare Biru Cyan Terang) -->
            <path d="M10.5 16 Q13 14.5 15.5 16" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" fill="none" />

            <!-- Jok Pengendara Motor -->
            <rect x="11" y="23" width="4" height="5" rx="1.2" fill="#1e293b" />

            <!-- Tas Kargo / Keranjang Delivery Paket Anteraja di Belakang Jok -->
            <rect x="7" y="27" width="12" height="10.5" rx="2" fill="#be185d" stroke="#ffffff" stroke-width="0.8" />
            <!-- Aksen Label & Tali Tas Paket Satria -->
            <line x1="13" y1="27" x2="13" y2="37.5" stroke="#ffffff" stroke-width="0.8" opacity="0.6" />
            <rect x="10" y="30" width="6" height="4" rx="0.6" fill="#ffffff" opacity="0.95" />
            <rect x="11" y="31.3" width="4" height="1.4" rx="0.3" fill="#ec008c" />

            <!-- Ban Belakang Motor -->
            <rect x="11.5" y="36" width="3" height="7" rx="1.5" fill="#0f172a" />

            <!-- Lampu Stop Belakang (Merah) -->
            <rect x="11" y="42" width="4" height="1.8" rx="0.6" fill="#ef4444" />
          </svg>
        </div>
      </div>
    `;

    return new L.divIcon({
      className: "bg-transparent border-0",
      html: htmlString,
      iconSize: [52, 52],
      iconAnchor: [26, 26],
    });
  };

  // Pin Penanda Tujuan Akhir: Alamat Rumah Penerima
  const createDestinationIcon = (destWp, customAddr) => {
    const address = customAddr || destWp?.label || "Jl. Tebet Barat Dalam No. 42";
    const htmlString = `
      <div class="flex flex-col items-center -ml-28 -mt-20 w-56 pointer-events-none">
        <div class="flex items-center gap-2 whitespace-nowrap rounded-xl border border-primary/40 bg-white px-3 py-1.5 shadow-xl">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <span class="material-symbols-outlined text-[17px]">
              home
            </span>
          </div>
          <div class="flex flex-col text-left min-w-0">
            <span class="font-sans text-[11px] font-bold leading-tight text-primary truncate max-w-[145px]">
              ${address}
            </span>
            <span class="mt-0.5 font-sans text-[9px] font-medium leading-none text-gray-500">
              Alamat Rumah Penerima
            </span>
          </div>
          <span class="ml-0.5 flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        </div>
        <div class="-mt-1 h-2.5 w-2.5 rotate-45 border-b border-r border-primary/40 bg-white shadow-sm"></div>
        <div class="relative flex items-center justify-center h-8 w-8 mt-1">
          <span class="absolute inline-flex h-full w-full rounded-full bg-primary/25 animate-ping"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-white shadow-md"></span>
        </div>
      </div>
    `;

    return new L.divIcon({
      className: "bg-transparent",
      html: htmlString,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  // Pin Standar untuk varian Staging dan Delivered
  const createCustomIcon = (wp, isActive) => {
    const isStaging = variant === "staging";
    const title = wp.label;
    const subtitle = wp.detail;
    
    let colorClass = "text-primary";
    let bgClass = "bg-primary";
    let borderClass = "border-primary/30";
    
    if (variant === "delivered") {
      colorClass = "text-tertiary";
      bgClass = "bg-tertiary";
      borderClass = "border-tertiary/30";
    }

    const iconName = variant === "delivered" ? "inventory_2" : (isStaging ? "warehouse" : "local_shipping");

    const htmlString = `
      <div class="flex flex-col items-center -ml-24 -mt-16 w-48 pointer-events-none">
        <div class="flex items-center gap-2 whitespace-nowrap rounded-xl border ${borderClass} bg-white px-3 py-1.5 shadow-lg">
          <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${bgClass} text-white shadow-sm">
            <span class="material-symbols-outlined text-[15px]">
              ${iconName}
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
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  const initialZoom =
    variant === "delivery" || variant === "delivered"
      ? 15
      : variant === "staging"
        ? 14
        : 13;

  const destinationWp = waypoints[waypoints.length - 1];

  return (
    <div className="absolute inset-0 h-full w-full z-0 bg-[#eef2f6]">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <ZoomControl position="topright" />

        {/* Pengendali Kamera Stabil: Menjaga mobil tetap di center tanpa goyang atau zoom liar */}
        <StaticMapController centerLat={centerLat} centerLon={centerLon} zoom={initialZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Garis Rute Jalur Jalan yang Bersih dan Rapi */}
        {coordsList.length > 1 && (
          <>
            {/* Outline Garis Jalan Putih (Casing) */}
            <Polyline 
              positions={coordsList} 
              color="#ffffff" 
              weight={6} 
              opacity={0.85} 
            />
            {/* Garis Inti Rute Magenta Khas Anteraja */}
            <Polyline 
              positions={coordsList} 
              color="#ec008c" 
              weight={3.5} 
              opacity={0.95} 
              dashArray={variant === "delivery" ? "6, 6" : undefined} 
            />
          </>
        )}

        {/* Render Marker Berdasarkan Varian */}
        {isTransit && waypoints.length >= 2 ? (
          /* Varian Transit: Truk Box Kargo Linehaul */
          <Marker 
            position={vehicleCoord} 
            icon={createTruckIcon(vehicleBearing)} 
            zIndexOffset={1000} 
          />
        ) : isDelivery && waypoints.length >= 2 ? (
          /* Varian Delivery: Sepeda Motor Kurir Satria + Pin Alamat Rumah Penerima */
          <>
            {/* 1. Pin Penanda Tujuan Akhir: Alamat Rumah Penerima */}
            {destinationWp?.geo && (
              <Marker 
                position={[destinationWp.geo.lat, destinationWp.geo.lon]} 
                icon={createDestinationIcon(destinationWp, destinationAddress)} 
                zIndexOffset={900} 
              />
            )}

            {/* 2. Sepeda Motor Kurir Satria Bergerak Menuju Rumah Penerima */}
            {Array.isArray(vehicleCoord) && Number.isFinite(vehicleCoord[0]) && Number.isFinite(vehicleCoord[1]) && (
              <Marker 
                position={vehicleCoord} 
                icon={createMotorcycleIcon(vehicleBearing)} 
                zIndexOffset={2000} 
              />
            )}
          </>
        ) : (
          /* Varian Non-Animasi Kendaraan (Staging & Delivered) */
          <>
            {coordsList.map((coord, idx) => {
               if (idx !== activeIndex) {
                  return (
                    <Marker key={idx} position={coord} icon={createCustomIcon(waypoints[idx], false)} />
                  );
               }
               return null;
            })}

            <Marker position={[centerLat, centerLon]} icon={createCustomIcon(activeWaypoint, true)} zIndexOffset={1000} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
