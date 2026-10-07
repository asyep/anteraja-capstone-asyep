import React from "react";
import FeatureGrid from "../components/lacak/FeatureGrid";
import HelpAndFaq from "../components/lacak/HelpAndFaq";
import QuickGuide from "../components/lacak/QuickGuide";
import SearchPod from "../components/lacak/SearchPod";
import TelemetryStrip, {
  LacakBreadcrumb,
} from "../components/lacak/TelemetryStrip";

export default function LacakPage() {
  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface">
      <div className="flex w-full flex-col">
        {/* Ambient glow & pattern underlay */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute -top-36 left-1/2 h-[360px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/10 via-secondary-container/15 to-ai-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute right-10 top-20 h-72 w-72 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative z-10 mx-auto max-w-[1200px] px-4 pb-16 pt-8 md:px-6 lg:px-10">
            <LacakBreadcrumb />
            <SearchPod />
            <TelemetryStrip />
            <FeatureGrid />
            <QuickGuide />
            <HelpAndFaq />
          </div>
        </div>
      </div>
    </main>
  );
}
