"use client";

import React, { useState } from "react";
import { Mountain, Waves, Compass, Sparkles, Navigation, Train, Sun, Eye } from "lucide-react";

interface TravelMotionBannerProps {
  currentVibe?: string;
  onSelectVibe?: (vibe: string) => void;
}

type SceneFocus = "ALL" | "MOUNTAINS" | "TRAIN" | "BEACH" | "ROADTRIP";

export function TravelMotionBanner({ currentVibe, onSelectVibe }: TravelMotionBannerProps) {
  const [activeScene, setActiveScene] = useState<SceneFocus>("ALL");

  // Determine base path for GitHub Pages vs Localhost
  const basePath = typeof window !== "undefined" && window.location.pathname.startsWith("/TRIPMATE.AI")
    ? "/TRIPMATE.AI"
    : process.env.NODE_ENV === "production" ? "/TRIPMATE.AI" : "";
  const bannerImg = `${basePath}/images/realistic_travel_panorama.jpg`;

  // Dynamic zoom & focus alignment based on selected travel vibe
  const getTransformStyle = () => {
    switch (activeScene) {
      case "MOUNTAINS":
        return {
          transform: "scale(1.22) translate(12%, 4%)",
          transformOrigin: "left center",
        };
      case "TRAIN":
        return {
          transform: "scale(1.28) translate(8%, -2%)",
          transformOrigin: "25% 65%",
        };
      case "BEACH":
        return {
          transform: "scale(1.24) translate(-14%, 2%)",
          transformOrigin: "right center",
        };
      case "ROADTRIP":
        return {
          transform: "scale(1.26) translate(0%, -6%)",
          transformOrigin: "center 80%",
        };
      case "ALL":
      default:
        return {
          transform: "scale(1.03)",
          transformOrigin: "center center",
        };
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-emerald-950/20 dark:border-emerald-500/30 shadow-2xl bg-stone-950 text-white select-none">
      {/* Viewport Frame with Realistic Cinematic Image Backdrop */}
      <div className="relative h-60 sm:h-72 md:h-80 w-full overflow-hidden">
        {/* Photorealistic 8K Panorama Image with smooth transitions and subtle cinematic camera drift */}
        <div
          className="absolute inset-0 w-full h-full transition-all duration-1000 ease-out animate-cinematic"
          style={getTransformStyle()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerImg}
            alt="Scenic mountain viaduct train, winding coastal road, and turquoise beach landscape"
            className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.04]"
          />
        </div>

        {/* Realistic Golden Hour Sunburst & Atmospheric Glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl pointer-events-none animate-golden-glow" />

        {/* Realistic Soft Drifting Mist / Fog Layer across the Mountains */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-[150%] h-32 bg-gradient-to-r from-white/0 via-white/15 to-white/0 blur-2xl animate-mist" />
          <div className="absolute top-1/3 left-0 w-full h-24 bg-gradient-to-r from-emerald-100/10 via-white/20 to-teal-100/10 blur-xl animate-mist" style={{ animationDelay: "-9s" }} />
        </div>

        {/* High Altitude Passenger Jet Trail */}
        <div className="absolute top-4 left-0 w-full pointer-events-none overflow-hidden h-12">
          <div className="animate-plane flex items-center gap-2 opacity-75">
            <div className="h-[1px] w-36 bg-gradient-to-r from-transparent via-white/40 to-white/95" />
            <span className="text-[10px] text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">✈️</span>
          </div>
        </div>

        {/* Top Floating Glassmorphism Telemetry HUD */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 shadow-lg text-xs font-semibold text-white/90">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Active Trip Atmosphere:</span>
              <span className="text-amber-300 font-bold">
                {activeScene === "ALL" && "All-in-One Panorama"}
                {activeScene === "MOUNTAINS" && "Western Ghats Peaks • 1,420m"}
                {activeScene === "TRAIN" && "Heritage Mountain Express"}
                {activeScene === "BEACH" && "Turquoise Arabian Coast"}
                {activeScene === "ROADTRIP" && "Coastal Highway Expedition"}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-medium text-stone-200">
              <Sun className="h-3.5 w-3.5 text-amber-300 animate-spin" style={{ animationDuration: "25s" }} />
              <span>Golden Hour 24°C • Perfect Travel Weather</span>
            </div>
          </div>
        </div>

        {/* Bottom Realistic Journey Status Pills */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-medium text-emerald-300 shadow-md">
              <Mountain className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Peaks:</span>
              <span>Misty Hills</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-medium text-amber-300 shadow-md">
              <Train className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Rail:</span>
              <span>Viaduct Express</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-medium text-teal-300 shadow-md">
              <Waves className="h-3.5 w-3.5 text-teal-400" />
              <span className="hidden sm:inline">Coast:</span>
              <span>Ocean Surf</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-md">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>TRIPMATE AI Cinematic Engine</span>
          </div>
        </div>
      </div>

      {/* Interactive Atmosphere Perspective Selector */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-stone-950 via-emerald-950/80 to-stone-950 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Explore Live Vibe:
          </span>
          <span className="text-xs text-stone-300 font-medium hidden sm:inline">
            Click any perspective to focus the cinematic travel camera
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {[
            { id: "ALL", label: "🌐 Full Panorama", vibeName: "All Landscapes" },
            { id: "MOUNTAINS", label: "🏔️ Misty Peaks", vibeName: "Misty Mountain Treks & Calms" },
            { id: "TRAIN", label: "🚂 Scenic Rail & Viaduct", vibeName: "Scenic Heritage Railway Journeys" },
            { id: "BEACH", label: "🏖️ Tropical Beach & Surf", vibeName: "Coastal Beaches & Water Fun" },
            { id: "ROADTRIP", label: "🚙 4x4 Expedition Highway", vibeName: "Roadtrips & Thrill Adventures" },
          ].map((item) => {
            const isSelected = activeScene === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveScene(item.id as SceneFocus);
                  if (onSelectVibe) onSelectVibe(item.vibeName);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-400/60 scale-105"
                    : "bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white border border-white/10 hover:border-white/30"
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
