"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Compass, ArrowRight, Home, Sparkles, MapPin } from "lucide-react";

export default function NotFound() {
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = window.location.pathname;
    // Check if the path was intended for a trip workspace: e.g. /trips/trip-1792341512731 or /TRIPMATE.AI/trips/trip-1792341512731
    const match = path.match(/\/trips\/(trip-[a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      setRedirecting(true);
      const tripId = match[1];
      const isGithub = path.startsWith("/TRIPMATE.AI");
      const targetUrl = (isGithub ? "/TRIPMATE.AI" : "") + `/trips?id=${tripId}`;
      window.location.replace(targetUrl);
    }
  }, []);

  if (redirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09120e] text-white">
        <div className="flex flex-col items-center gap-4 text-center p-6">
          <div className="h-12 w-12 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin" />
          <h2 className="text-xl font-bold font-serif text-emerald-300">Loading Your Travel Workspace...</h2>
          <p className="text-xs text-stone-400">Connecting to your saved itinerary and budget calculations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] dark:bg-[#09120e] text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center space-y-6">
          <div className="h-20 w-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 mx-auto flex items-center justify-center text-emerald-800 dark:text-emerald-300 shadow-lg animate-float">
            <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: "20s" }} />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              TRIPMATE AI • Compass Off-Course
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-serif text-stone-900 dark:text-white mt-2">
              Waypoint Not Found
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-md mx-auto">
              We couldn't locate this specific trail or coordinate. Let's redirect you back to your journey or explore curated destinations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 dark:from-emerald-600 dark:to-teal-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Back to Homepage</span>
            </Link>

            <Link
              href="/trips"
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 px-6 py-3 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            >
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span>View Saved Trips</span>
            </Link>

            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 px-6 py-3 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Plan New Trip</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
