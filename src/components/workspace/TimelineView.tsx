"use client";

import React, { useState } from "react";
import { ItineraryDay, ItineraryItem } from "@/lib/types/trip";
import { formatINR } from "@/lib/utils";
import {
  Clock,
  MapPin,
  ShieldCheck,
  Trash2,
  Umbrella,
  Lock,
  Unlock,
  ExternalLink,
  Car,
  Utensils,
  Camera,
  Compass,
} from "lucide-react";

interface TimelineViewProps {
  days: ItineraryDay[];
  onRemoveItem: (itemId: string) => void;
  onSwapIndoor: (itemId: string) => void;
}

export function TimelineView({ days, onRemoveItem, onSwapIndoor }: TimelineViewProps) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const currentDay = days[activeDayIndex] || days[0];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "TRANSPORT":
        return <Car className="h-4 w-4 text-teal-600 dark:text-teal-400" />;
      case "MEAL":
        return <Utensils className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "ACTIVITY":
      case "SIGHTSEEING":
        return <Camera className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Compass className="h-4 w-4 text-stone-500 dark:text-stone-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {days.map((day, idx) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDayIndex(idx)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all border shrink-0 ${
              activeDayIndex === idx
                ? "border-emerald-600 dark:border-emerald-500 bg-emerald-900 dark:bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-500/20"
                : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
            }`}
          >
            <span>Day {day.dayNumber}</span>
            <span className={`text-[10px] ${activeDayIndex === idx ? "text-emerald-200" : "text-stone-400 dark:text-stone-500"}`}>
              {day.date}
            </span>
          </button>
        ))}
      </div>

      {/* Day Title & Summary Card */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Day {currentDay.dayNumber} Overview
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            {currentDay.items.length} Scheduled Stops
          </span>
        </div>
        <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">{currentDay.title}</h3>
        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">{currentDay.summary}</p>
      </div>

      {/* Vertical Timeline Items */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
        {currentDay.items.map((item, idx) => (
          <div key={item.id} className="relative group">
            {/* Dot Indicator */}
            <div className="absolute -left-6 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-stone-900 bg-emerald-700 dark:bg-emerald-500 text-white shadow-xs">
              <span className="text-[10px] font-bold">{idx + 1}</span>
            </div>

            {/* Timeline Card */}
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                      <Clock className="h-3 w-3 text-stone-500 dark:text-stone-400" />
                      {item.startTime} – {item.endTime} ({item.durationMinutes}m)
                    </span>
                    <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide border border-emerald-200 dark:border-emerald-800/50">
                      {item.timeSlot}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[10px] font-medium text-stone-600 dark:text-stone-300">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 pt-1">{item.name}</h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">{item.description}</p>
                </div>

                {/* Right Costs & Badges */}
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {item.groupCost === 0 ? "Free / Included" : formatINR(item.groupCost)}
                  </div>
                  {item.groupCost > 0 && (
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">
                      {formatINR(item.individualCost)} / person
                    </div>
                  )}
                </div>
              </div>

              {/* Source & Actions Footer */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Verified Source */}
                <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Source: {item.source}</span>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                    >
                      <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  )}
                </div>

                {/* Item Actions */}
                <div className="flex items-center gap-1.5">
                  {item.weatherSensitive && item.indoorAlternative && (
                    <button
                      onClick={() => onSwapIndoor(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60"
                    >
                      <Umbrella className="h-3 w-3" />
                      <span>Rain Alternative</span>
                    </button>
                  )}

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="inline-flex items-center gap-1 rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    title="Remove item from plan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
