import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ShipmentProvider } from "@/context/ShipmentContext";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import HomePage from "@/pages/HomePage";
import LacakPage from "@/pages/LacakPage";
import OrderCreatedPage from "@/pages/OrderCreatedPage";
import CourierProcessedPage from "@/pages/CourierProcessedPage";
import InTransitPage from "@/pages/InTransitPage";
import OutForDeliveryPage from "@/pages/OutForDeliveryPage";
import HelpPage from "@/pages/HelpPage";
import DeliveredPage from "@/pages/DeliveredPage";
import NotFoundPage from "@/pages/NotFoundPage";

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
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#fcf9f8] font-['Plus_Jakarta_Sans',sans-serif]">
          <Header />
          <main className="min-h-[calc(100vh-20rem)] flex-1 bg-surface pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lacak" element={<LacakPage />} />
              <Route path="/tracking/order-created" element={<OrderCreatedPage />} />
              <Route path="/tracking/courier-processed" element={<CourierProcessedPage />} />
              <Route path="/tracking/in-transit" element={<InTransitPage />} />
              <Route path="/tracking/out-for-delivery" element={<OutForDeliveryPage />} />
              <Route path="/bantuan" element={<HelpPage />} />
              <Route path="/delivered" element={<DeliveredPage />} />
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
