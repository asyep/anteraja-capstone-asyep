import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ShipmentProvider } from "./context/ShipmentContext";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const HomePage = lazy(() => import("./pages/HomePage"));
const LacakPage = lazy(() => import("./pages/LacakPage"));
const TrackingResolverPage = lazy(() => import("./pages/TrackingResolverPage"));
const TrackingNormalPage = lazy(() => import("./pages/TrackingNormalPage"));
const TrackingLivePage = lazy(() => import("./pages/TrackingLivePage"));
const TrackingWarningPage = lazy(() => import("./pages/TrackingWarningPage"));
const BantuanPage = lazy(() => import("./pages/BantuanPage"));
const DeliveredPage = lazy(() => import("./pages/DeliveredPage"));
const CanceledPage = lazy(() => import("./pages/CanceledPage"));
const AiFallbackPage = lazy(() => import("./pages/AiFallbackPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ValidationErrorPage = lazy(() => import("./pages/ValidationErrorPage"));
const ServiceErrorPage = lazy(() => import("./pages/ServiceErrorPage"));
const LoadingPage = lazy(() => import("./pages/LoadingPage"));
const SmartWidgetPage = lazy(() => import("./pages/SmartWidgetPage"));
const PhpTrackingLabPage = lazy(() => import("./pages/PhpTrackingLabPage"));

export default function App() {
  return (
    <ShipmentProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#fcf9f8] font-['Plus_Jakarta_Sans',sans-serif]">
        <Header />
        <main className="flex-1 pt-[74px]">
          <Suspense
            fallback={
              <div
                aria-live="polite"
                className="mx-auto max-w-[1240px] px-4 py-10 text-sm text-[#777079] sm:px-8"
                role="status"
              >
                Memuat halaman...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lacak" element={<LacakPage />} />
              <Route path="/cek-resi" element={<TrackingResolverPage />} />
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
          </Suspense>
        </main>
        <Footer />
        </div>
      </Router>
    </ShipmentProvider>
  );
}
