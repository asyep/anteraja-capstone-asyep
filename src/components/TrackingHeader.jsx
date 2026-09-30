import React from "react";

export default function TrackingHeader({
  audience,
  onAudienceChange,
  activeUser,
}) {
  return (
    <header className="bg-white border-b border-stone-200/60 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Assistant Greeting */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-magenta rounded-xl flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-md shadow-magenta/20 transform transition hover:scale-105 cursor-default">
            A
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-ink leading-tight tracking-tight">
              Anteraja
            </h1>
            <p className="text-xs sm:text-sm font-medium text-muted flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              Satria Assistant siap membantu, {activeUser}!
            </p>
          </div>
        </div>

        {/* View Toggle (B2C / B2B) */}
        {onAudienceChange && (
          <div className="flex items-center bg-canvas p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => onAudienceChange("B2C")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                audience === "B2C"
                  ? "bg-white text-magenta shadow-sm border border-stone-200/50"
                  : "text-muted hover:text-ink hover:bg-stone-100/50"
              }`}
            >
              Personal (B2C)
            </button>
            <button
              onClick={() => onAudienceChange("B2B")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                audience === "B2B"
                  ? "bg-white text-magenta shadow-sm border border-stone-200/50"
                  : "text-muted hover:text-ink hover:bg-stone-100/50"
              }`}
            >
              Bisnis (B2B)
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
