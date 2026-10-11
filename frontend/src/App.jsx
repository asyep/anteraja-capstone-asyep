/**
 * =============================================================================
 * App.jsx - Komponen Utama & Pengatur Rute (Router) Aplikasi
 * =============================================================================
 * Berfungsi sebagai titik pusat navigasi Smart Tracking Anteraja.
 * Mengelola:
 * 1. Global Context Provider (`ShipmentProvider`) untuk cache & riwayat resi.
 * 2. Routing halaman menggunakan React Router v6.
 * 3. Otomatisasi scroll ke paling atas layar saat berpindah halaman (`ScrollToTop`).
 * 4. Layout konsisten: Header di atas, konten dinamis di tengah, dan Footer di bawah.
 */

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ShipmentProvider } from "./context/ShipmentContext";

// Komponen Layout Tetap (Header & Footer)
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Halaman-halaman Navigasi Utama
import HomePage from "./pages/HomePage";
import LacakPage from "./pages/LacakPage";
import HelpPage from "./pages/HelpPage";
import NotFoundPage from "./pages/NotFoundPage";

// Router Otomatis Status Resi
import TrackingResolverPage from "./pages/TrackingResolverPage";

// 5 Halaman Milestone Status Pengiriman
import OrderCreatedPage from "./pages/OrderCreatedPage";
import CourierProcessedPage from "./pages/CourierProcessedPage";
import InTransitPage from "./pages/InTransitPage";
import OutForDeliveryPage from "./pages/OutForDeliveryPage";
import DeliveredPage from "./pages/DeliveredPage";

/**
 * Komponen utilitas untuk mereset posisi scroll browser ke koordinat (0, 0)
 * setiap kali rute URL berubah.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ShipmentProvider>
      <Router>
        {/* Reset posisi scroll saat navigasi */}
        <ScrollToTop />

        {/* Wrapper Layout Keseluruhan */}
        <div className="flex flex-col min-h-screen bg-[#fcf9f8] font-['Plus_Jakarta_Sans',sans-serif]">
          <Header />

          {/* Konten Halaman Aktif Sesuai URL */}
          <main className="min-h-[calc(100vh-20rem)] flex-1 bg-surface pt-20">
            <Routes>
              {/* Beranda & Halaman Pelacakan Utama */}
              <Route path="/" element={<HomePage />} />
              <Route path="/lacak" element={<LacakPage />} />
              <Route path="/bantuan" element={<HelpPage />} />

              {/* Resolver Otomatis: Mengarahkan nomor resi ke halaman status yang sesuai */}
              <Route path="/cek-resi" element={<TrackingResolverPage />} />

              {/* 5 Milestone Tahapan Pengiriman */}
              <Route path="/tracking/order-created" element={<OrderCreatedPage />} />
              <Route path="/tracking/courier-processed" element={<CourierProcessedPage />} />
              <Route path="/tracking/in-transit" element={<InTransitPage />} />
              <Route path="/tracking/out-for-delivery" element={<OutForDeliveryPage />} />
              <Route path="/delivered" element={<DeliveredPage />} />

              {/* Penanganan Halaman 404 / Resi Tidak Ditemukan */}
              <Route path="/not-found" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ShipmentProvider>
  );
}

