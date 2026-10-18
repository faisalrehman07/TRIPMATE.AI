"use client";

import React, { useState } from "react";
import { Mountain, Waves, Compass, Sparkles, Navigation, Cloud } from "lucide-react";

interface TravelMotionBannerProps {
  currentVibe?: string;
  onSelectVibe?: (vibe: string) => void;
}

export function TravelMotionBanner({ currentVibe, onSelectVibe }: TravelMotionBannerProps) {
  const [activeScene, setActiveScene] = useState<"ALL" | "MOUNTAINS" | "BEACH" | "TRAIN">("ALL");

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-emerald-900/30 dark:border-emerald-500/20 shadow-xl bg-gradient-to-b from-[#0e2a22] via-[#0b1f19] to-[#071511] text-white">
      {/* Subtle Sky Gradient with Stars / Twilight Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/40 via-emerald-950/20 to-transparent pointer-events-none" />

      {/* Floating High-altitude Airplane */}
      <div className="absolute top-4 left-0 w-full pointer-events-none overflow-hidden h-14">
        <div className="animate-plane flex items-center gap-2 opacity-80">
          <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-white/40 to-white/90" />
          <svg className="w-5 h-5 text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>
      </div>

      {/* Floating Mountain Clouds */}
      <div className="absolute top-8 w-full pointer-events-none flex justify-between px-10 animate-clouds opacity-30 dark:opacity-20">
        <Cloud className="w-16 h-16 text-white/50" />
        <Cloud className="w-24 h-24 text-white/40 -mt-4" />
        <Cloud className="w-20 h-20 text-white/45" />
      </div>

      {/* Scenic SVG Landscape: Mountain Ridges, Coastal Shore, Palm Trees, Railway Viaduct */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden select-none">
        <svg
          className="absolute inset-0 w-full h-full preserve-3d"
          viewBox="0 0 1200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Distant Mountain Silhouettes */}
          <path
            d="M0 160L90 110L210 145L340 85L480 140L620 95L750 150L890 100L1030 145L1140 105L1200 135V240H0V160Z"
            fill="#12372A"
            opacity="0.45"
          />

          {/* Midground Rolling Hills & Tea Plantations */}
          <path
            d="M0 180L140 140L280 170L450 130L600 165L780 135L920 170L1080 145L1200 165V240H0V180Z"
            fill="#184535"
            opacity="0.75"
          />

          {/* Stone Viaduct / Train Bridge across the Mountain Valley */}
          <path
            d="M60 160H720"
            stroke="#264e3c"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
          {/* Bridge Pillars */}
          <path d="M120 160V220M240 160V220M360 160V220M480 160V220M600 160V220" stroke="#1f4434" strokeWidth="4" />

          {/* Coastal Beach & Ocean on the Right */}
          <path
            d="M720 185C820 170 950 180 1060 195C1130 205 1180 215 1200 220V240H720V185Z"
            fill="#134e4a"
            opacity="0.9"
          />

          {/* Ocean Waves */}
          <path
            className="animate-wave-1"
            d="M780 205C860 198 940 208 1040 212C1110 215 1170 218 1200 222V240H780V205Z"
            fill="#0f766e"
            opacity="0.7"
          />
          <path
            className="animate-wave-2"
            d="M820 215C900 210 990 218 1080 222C1140 224 1180 227 1200 230V240H820V215Z"
            fill="#14b8a6"
            opacity="0.5"
          />

          {/* Tropical Palm Trees on Beach Shore */}
          <g className="animate-palm" transform="translate(1080, 140)">
            {/* Trunk */}
            <path d="M15 65C12 45 10 25 18 0" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
            {/* Fronds */}
            <path d="M18 0C10 -15 -10 -10 -18 -4" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M18 0C12 -18 35 -15 42 -5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M18 0C5 -8 20 -25 28 -22" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 0C-5 -5 -15 -22 -2 -22" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
          </g>

          <g className="animate-palm" style={{ animationDelay: "1s" }} transform="translate(1130, 150)">
            <path d="M12 55C10 38 8 20 15 0" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M15 0C8 -12 -8 -8 -15 -3" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 0C10 -15 28 -12 34 -4" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 0C-4 -4 -12 -18 -1 -18" stroke="#047857" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </svg>

        {/* Animated Moving Mountain Express Train */}
        <div className="absolute top-[138px] left-0 w-full pointer-events-none">
          <div className="animate-train inline-flex items-center gap-1.5">
            {/* Steam puffs */}
            <div className="flex items-center gap-1 mr-1 opacity-70">
              <span className="h-2 w-2 rounded-full bg-white/60 animate-ping inline-block" />
              <span className="h-3 w-3 rounded-full bg-white/40 animate-pulse inline-block" />
            </div>

            {/* Locomotive Engine */}
            <div className="h-6 w-11 rounded-r-lg bg-gradient-to-r from-amber-600 via-emerald-700 to-amber-500 border border-amber-300/60 shadow-md flex items-center justify-between px-1 relative">
              <div className="h-2 w-2 rounded-xs bg-amber-200/90 shadow-[0_0_6px_#f59e0b]" />
              <span className="text-[8px] font-bold tracking-tighter text-stone-900">EXP</span>
              <div className="absolute -top-1.5 left-2 h-2 w-1.5 bg-stone-700 rounded-t-xs" />
            </div>

            {/* Passenger Coach 1 */}
            <div className="h-5 w-12 rounded-sm bg-emerald-800 border border-emerald-400/50 flex items-center justify-evenly px-0.5 shadow-sm">
              <div className="h-2 w-2 rounded-xs bg-amber-200/90" />
              <div className="h-2 w-2 rounded-xs bg-amber-200/90" />
              <div className="h-2 w-2 rounded-xs bg-amber-200/90" />
            </div>

            {/* Passenger Coach 2 */}
            <div className="h-5 w-12 rounded-sm bg-emerald-800 border border-emerald-400/50 flex items-center justify-evenly px-0.5 shadow-sm">
              <div className="h-2 w-2 rounded-xs bg-amber-200/90" />
              <div className="h-2 w-2 rounded-xs bg-amber-200/90" />
              <div className="h-2 w-2 rounded-xs bg-amber-200/90" />
            </div>

            {/* Observation Lounge Coach */}
            <div className="h-5 w-12 rounded-l-sm bg-teal-800 border border-teal-400/50 flex items-center justify-evenly px-0.5 shadow-sm">
              <div className="h-2 w-2 rounded-xs bg-amber-200/90" />
              <div className="h-2 w-3 rounded-xs bg-amber-100/90" />
            </div>
          </div>
        </div>

        {/* Roadway at Foreground with Moving 4x4 Roadtrip SUV */}
        <div className="absolute bottom-2 left-6 right-6 flex items-center justify-between border-t border-emerald-800/40 pt-2 z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="animate-car flex items-center gap-1 bg-stone-900/80 backdrop-blur-xs border border-emerald-500/40 rounded-full px-2.5 py-1 text-[11px] font-bold text-emerald-300 shadow-md">
              <span>🚙</span>
              <span>Roadtrip SUV • En Route</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-300/80">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Journey Motion System</span>
          </div>
        </div>
      </div>

      {/* Interactive Vibe Badges Row */}
      <div className="px-5 py-3.5 bg-black/40 backdrop-blur-md border-t border-emerald-900/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Travel Atmosphere:
          </span>
          <span className="text-xs text-stone-300 font-medium hidden sm:inline">
            From mountain tea trails to sunny coastal waves & scenic railways
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "MOUNTAINS", label: "🏔️ Misty Mountains", hint: "Coorg, Chikmagalur, Ooty" },
            { id: "TRAIN", label: "🚂 Scenic Rail & Transit", hint: "Nilgiri & Western Ghats" },
            { id: "BEACH", label: "🏖️ Coastal Beaches", hint: "Goa, Gokarna, Varkala" },
            { id: "ADVENTURE", label: "⚡ 4x4 Jeep & Rapids", hint: "Mandalpatti & Dubare" },
          ].map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => {
                setActiveScene(vibe.id as any);
                if (onSelectVibe) onSelectVibe(vibe.label);
              }}
              className="rounded-full px-3 py-1 text-[11px] font-semibold bg-emerald-950/60 hover:bg-emerald-800/80 border border-emerald-700/40 text-emerald-200 hover:text-white transition-all hover:scale-105 active:scale-95 shrink-0"
              title={vibe.hint}
            >
              {vibe.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
