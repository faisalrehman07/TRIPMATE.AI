"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { SAMPLE_DESTINATIONS } from "@/lib/db/mockData";
import { DestinationCandidate } from "@/lib/types/trip";
import { formatINR } from "@/lib/utils";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Clock,
  CloudSun,
  ShieldCheck,
  Filter,
  Layers,
  Shuffle,
} from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<DestinationCandidate[]>(SAMPLE_DESTINATIONS);
  const [sortBy, setSortBy] = useState<"MATCH" | "CHEAPEST" | "SHORTEST_TIME" | "ADVENTURE">("MATCH");
  const [selectedVibe, setSelectedVibe] = useState<string>("ALL");

  const vibesList = ["ALL", "Adventure", "Mountains", "Waterfalls", "Beaches", "Nightlife", "Cafes", "Relaxation"];

  // Sort & filter logic
  let filtered = [...destinations];
  if (selectedVibe !== "ALL") {
    filtered = filtered.filter((d) => d.topVibes.some((v) => v.toLowerCase().includes(selectedVibe.toLowerCase())));
  }

  if (sortBy === "CHEAPEST") {
    filtered.sort((a, b) => a.estimatedCostPerPerson - b.estimatedCostPerPerson);
  } else if (sortBy === "MATCH") {
    filtered.sort((a, b) => b.matchScore - a.matchScore);
  } else if (sortBy === "ADVENTURE") {
    filtered.sort((a, b) => (b.topVibes.includes("Adventure") ? 1 : 0) - (a.topVibes.includes("Adventure") ? 1 : 0));
  }

  const handleSurpriseMe = () => {
    const random = destinations[Math.floor(Math.random() * destinations.length)];
    router.push(`/wizard?dest=${encodeURIComponent(random.name)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 transition-colors">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Discovery Engine
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">Origin: Bengaluru (Karnataka)</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-2">
              Explore Suitable Getaways
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
              Constraint-aware destination discovery evaluating distance, live weather, budget feasibility, and group dynamics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200 shadow-xs hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              <Shuffle className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              <span>Surprise Me</span>
            </button>

            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 dark:bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 dark:hover:bg-emerald-600 transition-colors"
            >
              <Layers className="h-4 w-4" />
              <span>Compare Side-by-Side</span>
            </Link>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-sm backdrop-blur-sm">
          {/* Vibe filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {vibesList.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVibe(v)}
                className={`rounded-xl px-3 py-1.5 font-medium transition-colors shrink-0 ${
                  selectedVibe === v
                    ? "bg-stone-900 dark:bg-emerald-700 text-white"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-700"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            <span className="text-stone-500 dark:text-stone-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-3 py-1.5 font-semibold text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-700 dark:focus:border-emerald-500"
            >
              <option value="MATCH">Best Match Score</option>
              <option value="CHEAPEST">Lowest Cost Per Person</option>
              <option value="ADVENTURE">Most Adventurous</option>
            </select>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="group flex flex-col rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 overflow-hidden shadow-sm hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-md transition-all backdrop-blur-sm"
            >
              {/* Image & Match Score */}
              <div className="relative h-52 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-emerald-950/90 px-3 py-1 text-xs font-bold text-emerald-400 backdrop-blur shadow-sm border border-emerald-800/40">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{dest.matchScore}% Match</span>
                </div>

                <div className="absolute top-3 right-3 rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur flex items-center gap-1">
                  <CloudSun className="h-3.5 w-3.5 text-amber-300" />
                  <span>{dest.weatherForecast.temp} • {dest.weatherForecast.condition}</span>
                </div>

                <div className="absolute bottom-3 left-3 rounded-md bg-stone-900/80 px-2 py-0.5 text-[10px] font-semibold text-stone-200 backdrop-blur">
                  {dest.travelTimeFromOrigin}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      {dest.state}, {dest.country}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">{dest.idealDurationDays} Days Ideal</span>
                  </div>

                  <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">{dest.name}</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2">{dest.tagline}</p>

                  {/* Why it fits highlights */}
                  <div className="mt-4 space-y-1 rounded-xl bg-stone-50 dark:bg-stone-800/60 p-3 text-xs text-stone-700 dark:text-stone-300 border border-stone-100 dark:border-stone-800">
                    <div className="font-semibold text-stone-900 dark:text-stone-100 text-[11px] mb-1">Why this fits:</div>
                    {dest.matchReasons.slice(0, 2).map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">•</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  {/* Top Vibes Chips */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {dest.topVibes.map((v, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[10px] font-medium text-stone-600 dark:text-stone-400"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Pricing & Plan CTA */}
                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
                      {formatINR(dest.estimatedCostPerPerson)}
                      <span className="text-xs font-normal text-stone-500 dark:text-stone-400"> / person</span>
                    </div>
                    <div className="text-[10px] text-stone-400 dark:text-stone-500">
                      ≈ {formatINR(dest.estimatedGroupCost)} for 6 friends
                    </div>
                  </div>

                  <Link
                    href={`/wizard?dest=${encodeURIComponent(dest.name)}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 dark:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition-all group-hover:bg-emerald-900 dark:group-hover:bg-emerald-600"
                  >
                    <span>Plan Trip</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
