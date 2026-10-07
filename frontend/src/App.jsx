import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ShipmentProvider } from "./context/ShipmentContext";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import LacakPage from "./pages/LacakPage";
import TrackingNormalPage from "./pages/TrackingNormalPage";
import TrackingLivePage from "./pages/TrackingLivePage";
import TrackingWarningPage from "./pages/TrackingWarningPage";
import BantuanPage from "./pages/BantuanPage";
import DeliveredPage from "./pages/DeliveredPage";
import CanceledPage from "./pages/CanceledPage";
import AiFallbackPage from "./pages/AiFallbackPage";
import NotFoundPage from "./pages/NotFoundPage";
import ValidationErrorPage from "./pages/ValidationErrorPage";
import ServiceErrorPage from "./pages/ServiceErrorPage";
import LoadingPage from "./pages/LoadingPage";
import SmartWidgetPage from "./pages/SmartWidgetPage";
import PhpTrackingLabPage from "./pages/PhpTrackingLabPage";

export default function App() {
  return (
    <ShipmentProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#fcf9f8] font-['Plus_Jakarta_Sans',sans-serif]">
        <Header />
        <main className="flex-1 pt-20">
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
