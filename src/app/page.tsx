"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { formatINR } from "@/lib/utils";
import { SAMPLE_DESTINATIONS, SAMPLE_COORG_TRIP } from "@/lib/db/mockData";
import { TripStorage } from "@/lib/db/storage";
import { TravelMotionBanner } from "@/components/ui/TravelMotionBanner";
import {
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  Sliders,
  Wallet,
  Play,
  RotateCcw,
  Check,
  Flame,
  Waves,
  Mountain,
  Trees,
  Zap,
  Car,
  Compass as CompassIcon,
} from "lucide-react";

interface VibeCategory {
  id: string;
  title: string;
  icon: any;
  tagline: string;
  image: string;
  color: string;
  accentBg: string;
}

interface ActivityPill {
  id: string;
  name: string;
  emoji: string;
  category: string;
  popularIn: string;
}

export default function LandingPage() {
  const router = useRouter();

  // Selected Vibe Category state
  const [selectedVibeCategory, setSelectedVibeCategory] = useState<string>("MOUNTAINS");

  // Selected Activities state
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    "atv_jeep",
    "campfire",
    "waterfalls",
  ]);

  // Origin & Group Size
  const [originCity, setOriginCity] = useState("Bengaluru");
  const [groupSize, setGroupSize] = useState(6);
  const [budgetLimit, setBudgetLimit] = useState(30000);

  const vibeCategories: VibeCategory[] = [
    {
      id: "MOUNTAINS",
      title: "Misty Mountains",
      icon: Mountain,
      tagline: "High peaks, cool breeze & pine estates",
      image: "https://images.unsplash.com/photo-1592639296346-560c37a0f711?auto=format&fit=crop&w=800&q=80",
      color: "text-emerald-500",
      accentBg: "from-emerald-950/80 to-teal-950/90",
    },
    {
      id: "BEACHES",
      title: "Coastal Beaches",
      icon: Waves,
      tagline: "Sun-soaked shacks, cliffs & ocean tides",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      color: "text-cyan-400",
      accentBg: "from-cyan-950/80 to-blue-950/90",
    },
    {
      id: "CALM_NATURE",
      title: "Calm & Peaceful Area",
      icon: Trees,
      tagline: "Serene plantations, silent lakes & wellness",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      color: "text-teal-400",
      accentBg: "from-teal-950/80 to-emerald-950/90",
    },
    {
      id: "ADVENTURES",
      title: "Complete Fun Adventures",
      icon: Zap,
      tagline: "4x4 trails, zip-lines & river rafting",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
      color: "text-amber-400",
      accentBg: "from-amber-950/80 to-orange-950/90",
    },
  ];

  const adventureActivities: ActivityPill[] = [
    { id: "atv_jeep", name: "4x4 Jeep & ATV Off-Road", emoji: "🚙", category: "ADVENTURES", popularIn: "Coorg / Wayanad" },
    { id: "zipline", name: "Zip-Line Canopy Fly", emoji: "🧗", category: "ADVENTURES", popularIn: "Wayanad / Chikmagalur" },
    { id: "rafting", name: "River Rafting & Kayak", emoji: "🌊", category: "ADVENTURES", popularIn: "Dubare / Dandeli" },
    { id: "campfire", name: "Night Campfire & Music", emoji: "🔥", category: "CALM_NATURE", popularIn: "Woodstock Resort" },
    { id: "waterfalls", name: "Waterfalls & Spice Trails", emoji: "💦", category: "MOUNTAINS", popularIn: "Abbey Falls" },
    { id: "coffee_cupping", name: "Plantation Coffee Cupping", emoji: "☕", category: "CALM_NATURE", popularIn: "Madikeri" },
    { id: "nightlife", name: "Nightlife & Micro-Pubs", emoji: "🎶", category: "ADVENTURES", popularIn: "The Fort Mercara" },
    { id: "cliff_trek", name: "Cliffside Sunset Trek", emoji: "🌄", category: "MOUNTAINS", popularIn: "Mandalpatti Peak" },
  ];

  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Determine top matching destination reactively based on vibe & activities
  const getReactiveMatch = () => {
    if (selectedVibeCategory === "BEACHES") {
      return {
        name: "Gokarna Coast",
        tagline: "Untamed Cliffs, Arabian Sea Coastline & Beach Shacks",
        score: 94,
        cost: 25200,
        perPerson: 4200,
        transit: "8 hr overnight sleeper bus",
        features: ["Om Beach Sunset", "Kudle Cliff Walk", "Beachside Cafe Acoustic Nights"],
      };
    }
    if (selectedVibeCategory === "CALM_NATURE") {
      return {
        name: "Chikmagalur",
        tagline: "Coffee Estates, Serene Cloud Valleys & Baba Budangiri",
        score: 93,
        cost: 28200,
        perPerson: 4700,
        transit: "4.5 hr scenic expressway drive",
        features: ["Coffee Plantation Homestay", "Mullayanagiri Valley Peak", "Quiet Sunset Viewpoint"],
      };
    }
    // Default / Mountains / Adventures
    return {
      name: "Coorg (Kodagu)",
      tagline: "Misty Hills, Mandalpatti 4x4 Off-Road Jeep Trail & Resort Bonfires",
      score: 96,
      cost: 28650,
      perPerson: 4775,
      transit: "5.5 hr drive via Bangalore-Mysuru Expressway",
      features: [
        "Mandalpatti 4x4 Off-Road Trail (Included)",
        "3 Double Rooms at Woodstock Resort (Included)",
        "Private Bonfire & Abbey Falls Spice Trail",
      ],
    };
  };

  const currentMatch = getReactiveMatch();

  const handleLaunchTrip = () => {
    TripStorage.saveTrip(SAMPLE_COORG_TRIP);
    TripStorage.setActiveTripId(SAMPLE_COORG_TRIP.id);
    router.push(`/trips?id=${SAMPLE_COORG_TRIP.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] dark:bg-[#09120e] text-stone-900 dark:text-stone-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Dynamic Hero Section with Ambient Glowing Mesh */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
          {/* Ambient colorful glow meshes for high-impact travel energy */}
          <div className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/4 translate-x-1/2 w-96 h-96 bg-amber-500/15 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Main Header Text */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/60 px-4 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 shadow-xs backdrop-blur">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span>AI-Powered Vibe & Adventure Travel Architect</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-serif tracking-tight text-stone-900 dark:text-white leading-[1.1]">
                Your vibe. Your budget. <br />
                <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-400 bg-clip-text text-transparent italic font-normal">
                  Your journey.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto">
                Discover thrilling getaways from Bengaluru. Tailor your vibe from misty mountains to sunny beaches, pick specific adventure activities like 4x4 ATV rides and zip-lines, and let our deterministic engine compute the exact budget to the rupee.
              </p>
            </div>

            {/* Travel Journey in Motion Banner (Trains, Mountains, Beaches & Roadtrips) */}
            <div className="mt-8 max-w-5xl mx-auto">
              <TravelMotionBanner
                onSelectVibe={(vibeName) => {
                  if (vibeName.includes("Mountain")) setSelectedVibeCategory("MOUNTAINS");
                  else if (vibeName.includes("Beach")) setSelectedVibeCategory("BEACHES");
                  else if (vibeName.includes("Rail") || vibeName.includes("Transit")) setSelectedVibeCategory("MOUNTAINS");
                  else if (vibeName.includes("Jeep") || vibeName.includes("Adventure")) setSelectedVibeCategory("ADVENTURES");
                }}
              />
            </div>

            {/* INTERACTIVE VIBE & ACTIVITY SELECTOR HERO CARD */}
            <div className="mt-10 max-w-5xl mx-auto rounded-3xl border border-stone-200/90 dark:border-stone-800/90 bg-white/95 dark:bg-stone-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl travel-glow">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-white flex items-center gap-2">
                      <CompassIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      1. What Vibe Are You Looking For?
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Select your travel atmosphere to instantly shape route feasibility and hotel curation.
                    </p>
                  </div>

                  {/* Group & Origin Pill */}
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-3 py-1.5 text-stone-700 dark:text-stone-300">
                      📍 Origin: <strong>Bengaluru</strong>
                    </span>
                    <span className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-3 py-1.5 text-stone-700 dark:text-stone-300">
                      👥 <strong>6 Friends</strong>
                    </span>
                    <span className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1.5 text-emerald-900 dark:text-emerald-300 font-bold">
                      💰 <strong>₹30,000 Budget</strong>
                    </span>
                  </div>
                </div>

                {/* Vibe Category Cards Grid */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {vibeCategories.map((vibe) => {
                    const Icon = vibe.icon;
                    const isSelected = selectedVibeCategory === vibe.id;
                    return (
                      <button
                        key={vibe.id}
                        onClick={() => setSelectedVibeCategory(vibe.id)}
                        className={`group relative flex flex-col justify-between rounded-2xl p-4 text-left border transition-all duration-300 overflow-hidden ${
                          isSelected
                            ? "border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-500/20 shadow-lg -translate-y-1 bg-stone-900 text-white"
                            : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 hover:border-emerald-400/50 hover:bg-stone-100 dark:hover:bg-stone-800"
                        }`}
                      >
                        {/* Background Thumbnail preview */}
                        <div className="absolute inset-0 opacity-15 dark:opacity-25 transition-opacity group-hover:opacity-30">
                          <img src={vibe.image} alt={vibe.title} className="h-full w-full object-cover" />
                        </div>

                        <div className="relative z-10 space-y-2">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isSelected ? "bg-emerald-500 text-stone-950" : "bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 shadow-2xs"}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className={`font-bold text-sm ${isSelected ? "text-white" : "text-stone-900 dark:text-stone-100"}`}>
                              {vibe.title}
                            </div>
                            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                              {vibe.tagline}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="relative z-10 mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                            <Check className="h-3.5 w-3.5" />
                            <span>Active Vibe</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Specific Must-Have Activities */}
              <div className="pt-5 border-b border-stone-200 dark:border-stone-800 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-serif text-stone-900 dark:text-white flex items-center gap-1.5">
                      <Flame className="h-4 w-4 text-amber-500" />
                      2. Add Must-Have Adventure Activities
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Pick the activities you want integrated into your schedule (4x4 Jeep trail, Zip-lining, River Rafting, etc.).
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {selectedActivities.length} Activities Selected
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {adventureActivities.map((act) => {
                    const isChecked = selectedActivities.includes(act.id);
                    return (
                      <button
                        key={act.id}
                        onClick={() => toggleActivity(act.id)}
                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all duration-200 ${
                          isChecked
                            ? "border-emerald-600 bg-emerald-900 text-white shadow-sm -translate-y-0.5"
                            : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700"
                        }`}
                      >
                        <span className="text-base">{act.emoji}</span>
                        <span>{act.name}</span>
                        {isChecked ? (
                          <Check className="h-3 w-3 text-emerald-300 ml-1" />
                        ) : (
                          <span className="text-[10px] text-stone-400 dark:text-stone-500 ml-1">
                            ({act.popularIn.split(" / ")[0]})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Reactive Real-Time Match Output Bar */}
              <div className="pt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold text-lg shadow-md animate-pulse-glow">
                    {currentMatch.score}%
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        Top AI Recommendation
                      </span>
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:text-emerald-300">
                        Fits Budget Limit
                      </span>
                    </div>

                    <h4 className="text-xl font-bold font-serif text-stone-900 dark:text-white mt-0.5">
                      {currentMatch.name}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 max-w-xl">
                      {currentMatch.tagline} • {currentMatch.transit}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-xl font-extrabold font-serif text-stone-900 dark:text-white">
                      {formatINR(currentMatch.cost)}
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      {formatINR(currentMatch.perPerson)} / friend (6 guests)
                    </div>
                  </div>

                  <button
                    onClick={handleLaunchTrip}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 dark:from-emerald-600 dark:to-teal-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    <span>Generate My Custom Itinerary</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Trust and Engineering Micro-Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Grounded Hybrid RAG (pgvector + BM25)</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Deterministic Math (Zero LLM Arithmetic)</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Splitwise-Style Group Debt Settlement</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Adaptive Replanning & Map</span>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Getaways Showcase with Adventure Tags */}
        <section className="py-16 border-y border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Curated Weekend Destinations
                </span>
                <h2 className="text-3xl font-bold font-serif text-stone-900 dark:text-white mt-1">
                  Popular Road Trips from Bengaluru
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                  Grounded with official entry fees, operating hours, and live resort rate calculations.
                </p>
              </div>

              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-600"
              >
                <span>Explore All Destinations</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* 3 Featured Destination Cards with Hover Lift */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SAMPLE_DESTINATIONS.slice(0, 3).map((dest) => (
                <div
                  key={dest.id}
                  className="group relative flex flex-col rounded-3xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 overflow-hidden shadow-sm hover:border-emerald-600 dark:hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-stone-950/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                      {dest.name}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-950/90 px-2.5 py-1 text-[10px] font-bold text-emerald-300 backdrop-blur">
                      <Sparkles className="h-3 w-3" />
                      <span>{dest.matchScore}% Match</span>
                    </div>

                    <div className="absolute bottom-3 left-3 rounded-lg bg-stone-900/80 px-2.5 py-1 text-[10px] font-semibold text-stone-200 backdrop-blur">
                      {dest.travelTimeFromOrigin}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                        {dest.tagline}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {dest.topVibes.slice(0, 3).map((vibe, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-stone-200/60 dark:bg-stone-700/60 px-2 py-0.5 text-[10px] font-medium text-stone-700 dark:text-stone-300"
                          >
                            {vibe}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-stone-900 dark:text-white font-serif">
                          {formatINR(dest.estimatedCostPerPerson)}
                          <span className="text-xs font-normal text-stone-500"> / person</span>
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {formatINR(dest.estimatedGroupCost)} total for 6
                        </div>
                      </div>

                      <Link
                        href={`/wizard?dest=${encodeURIComponent(dest.name)}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 dark:text-stone-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs group-hover:bg-emerald-900 dark:group-hover:bg-emerald-500 dark:group-hover:text-white transition-colors"
                      >
                        <span>Plan This</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
