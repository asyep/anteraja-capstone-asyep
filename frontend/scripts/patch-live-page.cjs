const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '../src/pages/TrackingLivePage.jsx');
let content = fs.readFileSync(filepath, 'utf8');

// Replace static texts in TrackingLivePage
content = content.replace(/Estimasi Tiba: 29 September 2026, 12:00 WIB/g, `Estimasi Tiba: {formatLongWib(data.order_estimated_delivery_date)}`);
content = content.replace(/28 September 2026, Est\. 18:30 WIB/g, `{formatLongWib(data.order_estimated_delivery_date)}`);
content = content.replace(/10009214778215/g, `{data.waybill_number}`);
  
content = content.replace(/>Toko Sentral Komputer Semarang</g, `>{shipment.sender?.name}<`);
content = content.replace(/>Semarang Barat, Kota Semarang, Jawa Tengah</g, `>{shipment.sender?.city}<`);
  
content = content.replace(/>Bambang Hidayat</g, `>{shipment.receiver?.name}<`);
content = content.replace(/>Cilandak Barat, Cilandak, Jakarta Selatan 12430</g, `>{shipment.receiver?.address}<`);
  
content = content.replace(/>1\.45 Kg</g, `>{formatWeight(shipment.weight_kg)}<`);
content = content.replace(/>0\.003 m³</g, `>{formatVolume(shipment.volume_m3)}<`);

content = content.replace(/>AR-SD \(Same Day\)</g, `>{shipment.service?.code}<`);
content = content.replace(/>Elektronik & Aksesoris</g, `>{shipment.service?.code}<`);

// Replace timeline stages check (optional, let's keep hardcoded style for simplicity but just format dates)
// Actually we could do similar for milestones, but we already have shipment variables working.

fs.writeFileSync(filepath, content, 'utf8');
