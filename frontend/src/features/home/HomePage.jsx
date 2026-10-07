import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRouteForResi } from "@/features/home/data/shipmentsData";

import HeroSection from "@/features/home/components/sections/HeroSection";
import QuickAccessSection from "@/features/home/components/sections/QuickAccessSection";
import FeaturesSection from "@/features/home/components/sections/FeaturesSection";
import PricingSection from "@/features/home/components/sections/PricingSection";
import TestimonialSection from "@/features/home/components/sections/TestimonialSection";
import FaqSection from "@/features/home/components/sections/FaqSection";

export default function HomePage() {
  const navigate = useNavigate();
  const [waybill, setWaybill] = useState("1000849201994");

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(getRouteForResi(waybill));
  };

  return (
    <>
      <HeroSection
        onWaybillChange={setWaybill}
        onSubmit={handleSearch}
        waybill={waybill}
      />
      <QuickAccessSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialSection />
      <FaqSection />
    </>
  );
}
