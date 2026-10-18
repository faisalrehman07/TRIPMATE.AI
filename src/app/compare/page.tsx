"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { SAMPLE_DESTINATIONS } from "@/lib/db/mockData";
import { formatINR } from "@/lib/utils";
import { Layers, Sparkles, Clock, Check, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "dest-coorg",
    "dest-chikmagalur",
    "dest-wayanad",
  ]);

  const candidates = SAMPLE_DESTINATIONS.filter((d) => selectedIds.includes(d.id));

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 transition-colors">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Comparative Analysis
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">Origin: Bengaluru • 6 Friends • ₹30,000 Budget</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-2">
            Side-by-Side Destination Comparison
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            Evaluate road transit feasibility, weather conditions, resort options, and budget headroom across candidate destinations.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 shadow-sm backdrop-blur-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/50">
                <th className="p-5 font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 w-1/4">
                  Feature / Metric
                </th>
                {candidates.map((dest) => (
                  <th key={dest.id} className="p-5 w-1/4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base font-serif text-stone-900 dark:text-stone-100">{dest.name}</span>
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        {dest.matchScore}%
                      </span>
                    </div>
                    <div className="text-[11px] font-normal text-stone-500 dark:text-stone-400 mt-0.5">{dest.state}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {/* Photo Row */}
              <tr>
                <td className="p-5 font-semibold text-stone-700 dark:text-stone-300">Preview</td>
                {candidates.map((dest) => (
                  <td key={dest.id} className="p-5">
                    <div className="h-32 w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-inner">
                      <img src={dest.image} alt={dest.name} className="h-full w-full object-cover" />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Estimated Budget Row */}
              <tr className="bg-stone-50/30 dark:bg-stone-800/20">
                <td className="p-5 font-semibold text-stone-700 dark:text-stone-300">Est. Total Group Cost (6 Friends)</td>
                {candidates.map((dest) => (
                  <td key={dest.id} className="p-5">
                    <div className="font-bold font-serif text-base text-stone-900 dark:text-stone-100">
                      {formatINR(dest.estimatedGroupCost)}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      {formatINR(dest.estimatedCostPerPerson)} / person
                    </div>
                    <div className="mt-1">
                      <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {dest.budgetSuitability.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Transit Distance & Time */}
              <tr>
                <td className="p-5 font-semibold text-stone-700 dark:text-stone-300">Drive Time from Bengaluru</td>
                {candidates.map((dest) => (
                  <td key={dest.id} className="p-5">
                    <div className="font-bold text-stone-800 dark:text-stone-200">{dest.travelTimeFromOrigin}</div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{dest.primaryTransportMode}</div>
                  </td>
                ))}
              </tr>

              {/* Weather & Rain */}
              <tr className="bg-stone-50/30 dark:bg-stone-800/20">
                <td className="p-5 font-semibold text-stone-700 dark:text-stone-300">Forecast & Advisory</td>
                {candidates.map((dest) => (
                  <td key={dest.id} className="p-5">
                    <div className="font-semibold text-stone-900 dark:text-stone-100">
                      {dest.weatherForecast.temp} • {dest.weatherForecast.condition}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                      {dest.weatherForecast.advisory || "Pleasant seasonal conditions."}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Sample Attractions */}
              <tr>
                <td className="p-5 font-semibold text-stone-700 dark:text-stone-300">Signature Highlights</td>
                {candidates.map((dest) => (
                  <td key={dest.id} className="p-5">
                    <ul className="space-y-1">
                      {dest.sampleAttractions.slice(0, 3).map((attr, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-700 dark:text-stone-300">
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{attr}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Action Row */}
              <tr className="bg-stone-50/50 dark:bg-stone-800/40">
                <td className="p-5 font-semibold text-stone-700 dark:text-stone-300">Plan This Trip</td>
                {candidates.map((dest) => (
                  <td key={dest.id} className="p-5">
                    <Link
                      href={`/wizard?dest=${encodeURIComponent(dest.name)}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-900 dark:bg-emerald-700 px-4 py-2 font-bold text-white shadow-sm hover:bg-emerald-800 dark:hover:bg-emerald-600 transition-colors"
                    >
                      <span>Choose {dest.name.split(" ")[0]}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
