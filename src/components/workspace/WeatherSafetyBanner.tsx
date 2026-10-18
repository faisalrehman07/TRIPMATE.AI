"use client";

import React from "react";
import { CloudRain, Sun, AlertTriangle, ShieldCheck, ArrowRight, Umbrella } from "lucide-react";
import { LiveTravelDataService } from "@/lib/services/LiveTravelDataService";

interface WeatherSafetyBannerProps {
  destination: string;
  hasWeatherSensitiveItems: boolean;
  onApplyIndoorAlternative?: () => void;
}

export function WeatherSafetyBanner({
  destination,
  hasWeatherSensitiveItems,
  onApplyIndoorAlternative,
}: WeatherSafetyBannerProps) {
  const weather = LiveTravelDataService.getWeather(destination);

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-sm transition-all backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
            {weather.rainProbability > 30 ? (
              <CloudRain className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                {destination} Weather: {weather.temp} • {weather.condition}
              </span>
              <span className="rounded-full bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[10px] font-medium text-stone-600 dark:text-stone-300">
                Rain Risk: {weather.rainProbability}%
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">{weather.advisory}</p>
          </div>
        </div>

        {hasWeatherSensitiveItems && (
          <div className="flex items-center gap-2">
            <button
              onClick={onApplyIndoorAlternative}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 px-3 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/60"
            >
              <Umbrella className="h-3.5 w-3.5" />
              <span>Swap Outdoor for Indoor Alternatives</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
