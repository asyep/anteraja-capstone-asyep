const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');

function patchPage(filename, scenario) {
  const filepath = path.join(pagesDir, filename);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');

  // Skip if already heavily patched
  if (content.includes('const { shipment: data')) return;

  // Replace top imports and logic
  content = content.replace(
    /import React, { useState } from "react";\s*import { useNavigate, useSearchParams } from "react-router-dom";\s*import { getRouteForResi } from "\.\.\/data\/shipmentsData";/,
    `import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTrackingDetail from "../hooks/useTrackingDetail";
import TrackingLoadingState from "../components/tracking/TrackingLoadingState";
import { formatLongWib, formatShortWib, formatWeight, formatVolume, firstName } from "../utils/formatters";`
  );

  const logicToReplace = `  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryWaybill = searchParams.get("waybill_number");
  const initialWaybill = queryWaybill?.startsWith("10008492019945")
    ? "10008492019945"
    : queryWaybill || "10007812938125";
  const [waybill, setWaybill] = useState(initialWaybill);
  const [routeOpen, setRouteOpen] = useState(false);
  function handleSubmit(event) {
    event.preventDefault();
    const value = waybill.trim();
    if (value) navigate(getRouteForResi(value));
  }`;
  
  // Note: we'll just use Regex to find the useState block up to handleSubmit
  content = content.replace(
    /const navigate = useNavigate\(\);[\s\S]*?function handleSubmit\(event\) {[\s\S]*?}/,
    `const { shipment: data, loading } = useTrackingDetail("${scenario}");
  const navigate = useNavigate();
  const [waybill, setWaybill] = useState("");
  const [routeOpen, setRouteOpen] = useState(false);

  useEffect(() => {
    if (data) setWaybill(data.waybill_number);
  }, [data]);

  function handleSubmit(event) {
    event.preventDefault();
    const value = waybill.trim();
    if (value) navigate(\`/cek-resi?waybill_number=\${value}\`);
  }`
  );

  // Links block
  content = content.replace(
    /<div className="flex flex-wrap items-center gap-space-sm">[\s\S]*?<\/div>\s*<button/g,
    `<div className="flex flex-wrap items-center gap-space-sm">
                  <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider text-text-muted">
                    Uji Coba Resi:
                  </span>
                  <a className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-primary-fixed/40 hover:text-primary text-on-surface font-mono-code text-label-sm shadow-sm transition-all flex items-center gap-1.5" href="/tracking-normal">
                    <span className="w-2 h-2 rounded-full bg-success-base"></span>
                    Normal
                  </a>
                  <a className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-primary-fixed/40 hover:text-primary text-on-surface font-mono-code text-label-sm shadow-sm transition-all flex items-center gap-1.5" href="/tracking-live">
                    <span className="w-2 h-2 rounded-full bg-success-base animate-pulse"></span>
                    Live Map
                  </a>
                  <a className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-primary-fixed/40 hover:text-primary text-on-surface font-mono-code text-label-sm shadow-sm transition-all flex items-center gap-1.5" href="/tracking-warning">
                    <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim"></span>
                    Warning
                  </a>
                  <a className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-primary-fixed/40 hover:text-primary text-on-surface font-mono-code text-label-sm shadow-sm transition-all flex items-center gap-1.5" href="/tracking-delivered">
                    <span className="w-2 h-2 rounded-full bg-primary-fixed"></span>
                    Delivered
                  </a>
                </div>
                <button`
  );

  // Return statement loading guard
  if (!content.includes('if (loading || !data)')) {
    content = content.replace(
      /return \(\s*<main/,
      `if (loading || !data) return <TrackingLoadingState waybill={waybill} />;
  const shipment = data.shipment;
  const milestones = data.milestone_stages || [];
  const events = data.tracking_events || [];

  return (
    <main`
    );
  }

  // Common replacements
  content = content.replace(/28 September 2026, Est\. 18:30 WIB/g, `{formatLongWib(data.order_estimated_delivery_date)}`);
  content = content.replace(/Estimasi Tiba: 29 September 2026, 12:00 WIB/g, `Estimasi Tiba: {formatLongWib(data.order_estimated_delivery_date)}`);
  content = content.replace(/Estimasi awal: 28 September 2026, 18:00 WIB/g, ``); // clean up
  
  content = content.replace(/10009214778215/g, `{data.waybill_number}`);
  content = content.replace(/10007812938125/g, `{data.waybill_number}`);
  
  content = content.replace(/>Toko Sentral Gadget Bandung</g, `>{shipment.sender?.name}<`);
  content = content.replace(/>Coblong, Kota Bandung</g, `>{shipment.sender?.city}<`);
  content = content.replace(/>Toko Sentral Komputer Semarang</g, `>{shipment.sender?.name}<`);
  content = content.replace(/>Semarang Barat, Kota Semarang, Jawa Tengah</g, `>{shipment.sender?.city}<`);
  
  content = content.replace(/>Dimas Prasetyo</g, `>{shipment.receiver?.name}<`);
  content = content.replace(/>Jl\. Tebet Barat Raya No\. 45, Jakarta Selatan</g, `>{shipment.receiver?.address}<`);
  content = content.replace(/>Bambang Hidayat</g, `>{shipment.receiver?.name}<`);
  content = content.replace(/>Cilandak Barat, Cilandak, Jakarta Selatan 12430</g, `>{shipment.receiver?.address}<`);
  
  content = content.replace(/>1\.25 Kg</g, `>{formatWeight(shipment.weight_kg)}<`);
  content = content.replace(/>0\.002 m³</g, `>{formatVolume(shipment.volume_m3)}<`);
  content = content.replace(/>1\.45 Kg</g, `>{formatWeight(shipment.weight_kg)}<`);
  content = content.replace(/>0\.003 m³</g, `>{formatVolume(shipment.volume_m3)}<`);

  content = content.replace(/>AR-REG \(Reguler\)</g, `>{shipment.service?.code}<`);
  content = content.replace(/>Elektronik & Aksesoris</g, `>{shipment.service?.code}<`);

  fs.writeFileSync(filepath, content, 'utf8');
}

patchPage('TrackingWarningPage.jsx', 'warning');
patchPage('DeliveredPage.jsx', 'delivered');
