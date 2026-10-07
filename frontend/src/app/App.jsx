import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ShipmentProvider } from "@/features/tracking/context/ShipmentContext";

import Header from "@/app/layout/Header";
import Footer from "@/app/layout/Footer";

import HomePage from "@/features/home/HomePage";
import LacakPage from "@/features/tracking_lab/TrackingLabPage";
import TrackingNormalPage from "@/features/tracking/TrackingNormalView";
import TrackingLivePage from "@/features/tracking/TrackingLiveView";
import TrackingWarningPage from "@/features/tracking/TrackingWarningView";
import BantuanPage from "@/features/shipment-status/HelpPage";
import DeliveredPage from "@/features/shipment-status/DeliveredPage";
import CanceledPage from "@/features/shipment-status/CanceledPage";
import AiFallbackPage from "@/features/shipment-status/AiFallbackPage";
import NotFoundPage from "@/features/shipment-status/NotFoundPage";
import ValidationErrorPage from "@/features/shipment-status/ValidationErrorPage";
import ServiceErrorPage from "@/features/shipment-status/ServiceErrorPage";
import LoadingPage from "@/features/shipment-status/LoadingPage";
import SmartWidgetPage from "@/features/tracking/SmartWidgetView";
import PhpTrackingLabPage from "@/features/php_lab/PhpTrackingLabPage";

export default function App() {
  return (
    <ShipmentProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#fcf9f8] font-['Plus_Jakarta_Sans',sans-serif]">
        <Header />
        <main className="min-h-[calc(100vh-20rem)] flex-1 bg-surface pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lacak" element={<LacakPage />} />
            <Route path="/tracking-normal" element={<TrackingNormalPage />} />
            <Route path="/tracking-live" element={<TrackingLivePage />} />
            <Route path="/tracking" element={<TrackingWarningPage />} />
            <Route path="/bantuan" element={<BantuanPage />} />
            <Route path="/delivered" element={<DeliveredPage />} />
            <Route path="/canceled" element={<CanceledPage />} />
            <Route path="/ai-fallback" element={<AiFallbackPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="/validation-error" element={<ValidationErrorPage />} />
            <Route path="/service-error" element={<ServiceErrorPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/smart-widget" element={<SmartWidgetPage />} />
            <Route path="/php-tracking-lab" element={<PhpTrackingLabPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        </div>
      </Router>
    </ShipmentProvider>
  );
}
