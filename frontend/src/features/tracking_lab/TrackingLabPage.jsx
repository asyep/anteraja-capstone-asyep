import React from "react";
import FeatureGrid from "@/features/tracking_lab/components/FeatureGrid";
import HelpAndFaq from "@/features/tracking_lab/components/HelpAndFaq";
import QuickGuide from "@/features/tracking_lab/components/QuickGuide";
import SearchPod from "@/features/tracking_lab/components/SearchPod";

export default function LacakPage() {
  return (
    <main className="w-full bg-surface">
      <div className="flex w-full flex-col">
        {/* Ambient glow & pattern underlay */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute -top-36 left-1/2 h-[360px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/10 via-secondary-container/15 to-ai-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute right-10 top-20 h-72 w-72 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative z-10 mx-auto max-w-[1200px] px-margin pb-16 pt-16 md:px-margin-tablet lg:px-margin-desktop">
            <SearchPod />
            <FeatureGrid />
            <QuickGuide />
            <HelpAndFaq />
          </div>
        </div>
      </div>
    </main>
  );
}
