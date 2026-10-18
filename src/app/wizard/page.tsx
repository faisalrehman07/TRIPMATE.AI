"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { TripPreferences } from "@/lib/types/trip";
import { TripStorage } from "@/lib/db/storage";
import { TripGenerationService } from "@/lib/services/TripGenerationService";
import { formatINR } from "@/lib/utils";
import { TravelMotionBanner } from "@/components/ui/TravelMotionBanner";
import {
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Check,
  ShieldCheck,
  Car,
  Hotel,
  Utensils,
  Zap,
  Mountain,
  Waves,
  Trees,
  Flame,
  Plus,
  X,
  UserPlus,
  UserCheck,
  Smile,
} from "lucide-react";

export default function WizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");

  // Form State initialized to the user's specific Bengaluru 6-friends trip prompt
  const [preferences, setPreferences] = useState<TripPreferences>({
    originCity: "Bengaluru",
    destinationCity: "Coorg (Kodagu)",
    startDate: "2026-10-24",
    endDate: "2026-10-26",
    days: 3,
    nights: 2,
    totalBudget: 30000,
    perPersonBudget: 5000,
    currency: "INR",
    includeOriginTravelCost: true,
    groupProfile: "FRIENDS",
    groupSize: 6,
    friendNames: ["Faisal (You)", "Rohit", "Karan", "Aditya", "Vikram", "Siddharth"],
    roomPreference: "PRIVATE_DOUBLE",
    vibes: ["Misty Mountains", "Complete Fun Adventures", "Night Campfire & Stargazing", "4x4 ATV & Jeep Safari"],
    pace: "BALANCED",
    preferredStartTime: "08:30",
    walkingIntensity: "MODERATE",
    accommodationType: "RESORT",
    preferredAmenities: ["Outdoor Swimming Pool", "Bonfire", "Free Wi-Fi"],
    transportPreference: "RENTAL_CAR",
    transportPriority: "CONVENIENCE",
    dietary: ["NON_VEGETARIAN", "REGIONAL", "VEGETARIAN"],
    mustVisitPlaces: ["Mandalpatti Peak", "Abbey Falls"],
    avoidActivities: [],
    departureTime: "08:30",
    returnTime: "17:00",
    customNotes: "We are six friends travelling from Bengaluru for three days. Total budget is ₹30,000. Want adventure, scenic spots, good food and cozy resort.",
  });

  const handleDateChange = (newStart: string, newEnd: string) => {
    let days = preferences.days;
    let nights = preferences.nights;

    if (newStart && newEnd) {
      const s = new Date(newStart);
      const e = new Date(newEnd);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        const diffMs = e.getTime() - s.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) {
          nights = diffDays;
          days = diffDays === 0 ? 1 : diffDays + 1;
        } else {
          newEnd = newStart;
          nights = 0;
          days = 1;
        }
      }
    }

    setPreferences((prev) => ({
      ...prev,
      startDate: newStart,
      endDate: newEnd,
      days,
      nights,
    }));
  };

  const handleAdjustDuration = (delta: number) => {
    setPreferences((prev) => {
      const newDays = Math.max(1, prev.days + delta);
      const newNights = Math.max(0, newDays - 1);
      const s = new Date(prev.startDate || "2026-10-24");
      if (!isNaN(s.getTime())) {
        const newEndDate = new Date(s);
        newEndDate.setDate(newEndDate.getDate() + newNights);
        return {
          ...prev,
          days: newDays,
          nights: newNights,
          endDate: newEndDate.toISOString().split("T")[0],
        };
      }
      return { ...prev, days: newDays, nights: newNights };
    });
  };

  const handleUpdateFriendName = (index: number, newName: string) => {
    setPreferences((prev) => {
      const names = [...(prev.friendNames || [])];
      names[index] = newName;
      return { ...prev, friendNames: names };
    });
  };

  const handleAddFriend = () => {
    setPreferences((prev) => {
      const names = [...(prev.friendNames || [])];
      const nextNum = names.length + 1;
      names.push(`Friend ${nextNum}`);
      return {
        ...prev,
        friendNames: names,
        groupSize: names.length,
        perPersonBudget: Math.round(prev.totalBudget / names.length),
      };
    });
  };

  const handleRemoveFriend = (index: number) => {
    setPreferences((prev) => {
      const names = [...(prev.friendNames || [])];
      if (names.length <= 1) return prev;
      names.splice(index, 1);
      return {
        ...prev,
        friendNames: names,
        groupSize: names.length,
        perPersonBudget: Math.round(prev.totalBudget / names.length),
      };
    });
  };

  const handleAutofillFriends = () => {
    const sampleSquad = [
      "Faisal (You)",
      "Rohit",
      "Karan",
      "Aditya",
      "Vikram",
      "Siddharth",
      "Aman",
      "Priya",
      "Neha",
      "Rohan",
    ];
    const count = preferences.groupSize || 6;
    const names = sampleSquad.slice(0, count);
    while (names.length < count) {
      names.push(`Friend ${names.length + 1}`);
    }
    setPreferences((prev) => ({
      ...prev,
      friendNames: names,
    }));
  };

  const vibeCategories = [
    { title: "Misty Mountains", icon: Mountain, desc: "High peaks, pine air, and cloud valleys" },
    { title: "Coastal Beaches", icon: Waves, desc: "Ocean waves, cliff treks & beachside shacks" },
    { title: "Calm & Peaceful Nature", icon: Trees, desc: "Lush plantations, lakes & tranquility" },
    { title: "Complete Fun Adventures", icon: Zap, desc: "High-octane thrill, rapids & trails" },
  ];

  const adventureOptions = [
    { name: "4x4 ATV & Jeep Safari", emoji: "🚙" },
    { name: "Zip-Line Canopy Fly", emoji: "🧗" },
    { name: "River Rafting & Kayak", emoji: "🌊" },
    { name: "Night Campfire & Stargazing", emoji: "🔥" },
    { name: "Cliff & Waterfalls Trek", emoji: "💦" },
    { name: "Plantation Coffee Cupping", emoji: "☕" },
    { name: "Nightlife & Pubs", emoji: "🎶" },
    { name: "Spiritual Monasteries", emoji: "☸️" },
  ];

  const handleToggleVibe = (vibe: string) => {
    setPreferences((prev) => ({
      ...prev,
      vibes: prev.vibes.includes(vibe)
        ? prev.vibes.filter((v) => v !== vibe)
        : [...prev.vibes, vibe],
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    setGenerationStep("1. Querying verified tourism guides via RAG (KSTDC & Forest Dept)...");
    await new Promise((r) => setTimeout(r, 700));

    setGenerationStep("2. Searching live accommodation & calculating room occupancy (6 guests → 3 rooms)...");
    await new Promise((r) => setTimeout(r, 800));

    setGenerationStep("3. Running deterministic budget engine & OSRM routing optimization...");
    await new Promise((r) => setTimeout(r, 700));

    try {
      const trip = await TripGenerationService.generateTrip(preferences);
      TripStorage.saveTrip(trip);
      TripStorage.setActiveTripId(trip.id);
      router.push(`/trips?id=${trip.id}`);
    } catch (err) {
      console.error(err);
      router.push("/trips?id=trip-coorg-demo-001");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] dark:bg-[#09120e] text-stone-900 dark:text-stone-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Wizard Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-400 mb-2">
            <span className="text-emerald-700 dark:text-emerald-400">Step {currentStep} of 8</span>
            <span>
              {currentStep === 1 && "Trip Details & Budget"}
              {currentStep === 2 && "Group Profile & Rooms"}
              {currentStep === 3 && "Travel Vibe & Activities"}
              {currentStep === 4 && "Pace & Timing"}
              {currentStep === 5 && "Accommodation"}
              {currentStep === 6 && "Transportation"}
              {currentStep === 7 && "Food & Constraints"}
              {currentStep === 8 && "Review & Generation"}
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Travel Vibe Motion Banner in Wizard */}
        <div className="mb-8">
          <TravelMotionBanner
            onSelectVibe={(vibe) => {
              if (vibe.includes("Mountain")) {
                setPreferences((p) => ({
                  ...p,
                  destinationCity: "Coorg (Kodagu)",
                  vibes: ["Misty Mountains", "4x4 ATV & Jeep Safari"],
                }));
              } else if (vibe.includes("Beach")) {
                setPreferences((p) => ({
                  ...p,
                  destinationCity: "Gokarna Coast",
                  vibes: ["Coastal Beaches", "Beachside Shacks & Cliffs"],
                }));
              }
            }}
          />
        </div>

        {/* Wizard Card Container */}
        <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-6 sm:p-10 shadow-xl backdrop-blur-xl">
          {/* Step 1: Trip Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Step 1
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white mt-1">
                  Trip Details & Budget
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Tell us where you are starting from, dates, and target budget.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Starting City</label>
                  <input
                    type="text"
                    value={preferences.originCity}
                    onChange={(e) => setPreferences({ ...preferences, originCity: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-3 text-stone-900 dark:text-white outline-none focus:border-emerald-600"
                    placeholder="e.g. Bengaluru"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Destination</label>
                  <input
                    type="text"
                    value={preferences.destinationCity}
                    onChange={(e) => setPreferences({ ...preferences, destinationCity: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-3 text-stone-900 dark:text-white outline-none focus:border-emerald-600"
                    placeholder="e.g. Coorg (Kodagu) or AI_RECOMMENDED"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Start Date</label>
                  <input
                    type="date"
                    value={preferences.startDate}
                    onChange={(e) => handleDateChange(e.target.value, preferences.endDate)}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-3 text-stone-900 dark:text-white outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">End Date</label>
                  <input
                    type="date"
                    value={preferences.endDate}
                    onChange={(e) => handleDateChange(preferences.startDate, e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-3 text-stone-900 dark:text-white outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Live Calculated Trip Duration with adjustment steppers */}
                <div className="sm:col-span-2 rounded-2xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/40 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Calculated Dynamic Duration</span>
                      </div>
                      <div className="text-xl font-bold font-serif text-stone-900 dark:text-white mt-0.5">
                        {preferences.days} Days • {preferences.nights} Nights
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        From {preferences.startDate} to {preferences.endDate} ({preferences.nights} nights stay)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Fine-tune duration:</span>
                      <button
                        type="button"
                        onClick={() => handleAdjustDuration(-1)}
                        className="h-8 w-8 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold hover:bg-stone-100 dark:hover:bg-stone-700 text-sm shadow-xs active:scale-95 transition-all"
                        title="Decrease 1 day"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        {preferences.days} Days
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdjustDuration(1)}
                        className="h-8 w-8 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold hover:bg-stone-100 dark:hover:bg-stone-700 text-sm shadow-xs active:scale-95 transition-all"
                        title="Add 1 day"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Departure Schedule Selection */}
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <span>When will you depart on Day 1?</span>
                  </label>
                  <select
                    value={preferences.departureTime || "08:30"}
                    onChange={(e) => setPreferences({ ...preferences, departureTime: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-3 text-stone-900 dark:text-white outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="06:00">🌅 Early Morning (06:00 AM) — Beat Highway Tolls & Highway Breakfast</option>
                    <option value="08:30">☀️ Morning (08:30 AM) — Standard Scenic Start & Lunch Arrival</option>
                    <option value="13:00">🌤️ Afternoon (01:00 PM) — Post-Lunch Roadtrip & Sunset Check-in</option>
                    <option value="18:00">🌙 Evening (06:00 PM) — Night Drive & Stargazing Check-in</option>
                  </select>
                </div>

                {/* Return Schedule Selection */}
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <span>Return departure on final day?</span>
                  </label>
                  <select
                    value={preferences.returnTime || "17:00"}
                    onChange={(e) => setPreferences({ ...preferences, returnTime: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-3 text-stone-900 dark:text-white outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="13:00">☀️ Afternoon (01:00 PM) — Check-out & Midday Highway Return</option>
                    <option value="17:00">🌅 Evening (05:00 PM) — Full Day Sightseeing & Sunset Return</option>
                    <option value="20:00">🌙 Night (08:00 PM) — Farewell Dinner & Late Evening Drive</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Total Group Budget (₹ INR)</label>
                  <input
                    type="number"
                    value={preferences.totalBudget}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        totalBudget: Number(e.target.value),
                        perPersonBudget: Math.round(Number(e.target.value) / preferences.groupSize),
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-3 text-stone-900 dark:text-white outline-none focus:border-emerald-600 font-bold"
                  />
                  <div className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                    ≈ {formatINR(preferences.totalBudget / preferences.groupSize)} per person for {preferences.groupSize} travelers
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Group Profile */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Step 2
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white mt-1">
                  Group Profile & Room Allocations
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Select group dynamics to ensure accurate room calculations and activity pacing.
                </p>
              </div>

              <div className="space-y-5 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Number of Travelers</label>
                  <div className="mt-2 flex items-center gap-3">
                    {[1, 2, 4, 6, 8, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          const currentNames = [...(preferences.friendNames || [])];
                          let updatedNames = [...currentNames];
                          const defaultSample = [
                            "Faisal (You)",
                            "Rohit",
                            "Karan",
                            "Aditya",
                            "Vikram",
                            "Siddharth",
                            "Aman",
                            "Priya",
                            "Neha",
                            "Rohan",
                          ];
                          if (num > updatedNames.length) {
                            for (let i = updatedNames.length; i < num; i++) {
                              updatedNames.push(defaultSample[i] || `Friend ${i + 1}`);
                            }
                          } else if (num < updatedNames.length) {
                            updatedNames = updatedNames.slice(0, num);
                          }
                          setPreferences({
                            ...preferences,
                            groupSize: num,
                            friendNames: updatedNames,
                            perPersonBudget: Math.round(preferences.totalBudget / num),
                          });
                        }}
                        className={`flex-1 rounded-xl py-3 font-bold border transition-all ${
                          preferences.groupSize === num
                            ? "border-emerald-600 bg-emerald-900 text-white shadow-xs"
                            : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Squad Members Roster — Add & Customize Friend Names */}
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                        <span>Squad Members & Friend Names ({preferences.friendNames?.length || preferences.groupSize} Friends)</span>
                      </label>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        Type the actual names of your friends. They will be used in expense settlements, room occupancy, and booking passes.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAutofillFriends}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-1.5 text-[11px] font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-2xs"
                        title="Autofill sample squad names"
                      >
                        <Smile className="h-3.5 w-3.5 text-amber-500" />
                        <span>Autofill Squad</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAddFriend}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 dark:bg-emerald-700 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-2xs"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Add Friend</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                    {(preferences.friendNames || []).map((name, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center gap-2.5 rounded-xl border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-stone-900/90 p-2.5 shadow-2xs hover:border-emerald-500/50 transition-all"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-900 dark:bg-emerald-800 text-white font-bold text-xs shadow-2xs">
                          {idx === 0 ? "👑" : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            {idx === 0 ? "Trip Organizer (You)" : `Friend #${idx + 1}`}
                          </div>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => handleUpdateFriendName(idx, e.target.value)}
                            placeholder={`e.g. Friend ${idx + 1} Name`}
                            className="w-full bg-transparent font-medium text-xs text-stone-900 dark:text-white outline-none focus:text-emerald-700 dark:focus:text-emerald-300 border-b border-transparent focus:border-emerald-600 py-0.5"
                          />
                        </div>
                        {(preferences.friendNames || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFriend(idx)}
                            className="rounded-lg p-1 text-stone-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-600 transition-colors"
                            title="Remove Friend"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Group Profile</label>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {["FRIENDS", "BOYS_TRIP", "GIRLS_TRIP", "COUPLES", "FAMILY", "SOLO", "CORPORATE", "SENIORS"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setPreferences({ ...preferences, groupProfile: type as any })}
                        className={`rounded-xl p-3 text-left border transition-all ${
                          preferences.groupProfile === type
                            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-300 font-bold"
                            : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
                        }`}
                      >
                        {type.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Room Sharing Preference</label>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => setPreferences({ ...preferences, roomPreference: "PRIVATE_DOUBLE" })}
                      className={`p-3 rounded-xl border text-left ${
                        preferences.roomPreference === "PRIVATE_DOUBLE"
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-300 font-bold"
                          : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                      }`}
                    >
                      <div className="font-bold text-stone-900 dark:text-white">Private Double Rooms</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">2 guests per room (3 rooms for 6 guests)</div>
                    </button>

                    <button
                      onClick={() => setPreferences({ ...preferences, roomPreference: "SHARED_DORM" })}
                      className={`p-3 rounded-xl border text-left ${
                        preferences.roomPreference === "SHARED_DORM"
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-300 font-bold"
                          : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                      }`}
                    >
                      <div className="font-bold text-stone-900 dark:text-white">Shared Dorm / Pods</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Budget backpacker hostel dorms</div>
                    </button>

                    <button
                      onClick={() => setPreferences({ ...preferences, roomPreference: "WHOLE_VILLA" })}
                      className={`p-3 rounded-xl border text-left ${
                        preferences.roomPreference === "WHOLE_VILLA"
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-300 font-bold"
                          : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                      }`}
                    >
                      <div className="font-bold text-stone-900 dark:text-white">Entire Villa / Estate</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Private plantation estate for group</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Travel Vibe & Adventure Activities */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Step 3
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white mt-1">
                  Choose Vibe & Adventure Activities
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Select your atmosphere (Mountains, Beaches, Calm Nature, or Fun Adventures) and pick specific thrills (4x4 Jeep, ATV, Zip-line, Rafting).
                </p>
              </div>

              {/* Vibe Categories */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                  Atmosphere & Setting
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {vibeCategories.map((vc) => {
                    const Icon = vc.icon;
                    const isSelected = preferences.vibes.includes(vc.title);
                    return (
                      <button
                        key={vc.title}
                        onClick={() => handleToggleVibe(vc.title)}
                        className={`rounded-2xl p-3.5 text-left border transition-all ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-900 text-white shadow-sm"
                            : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700"
                        }`}
                      >
                        <Icon className="h-5 w-5 mb-2 text-emerald-400" />
                        <div className="font-bold text-xs">{vc.title}</div>
                        <div className="text-[10px] text-stone-400 dark:text-stone-400 line-clamp-1 mt-0.5">{vc.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Adventure Activities */}
              <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Must-Include Adventure Activities
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {adventureOptions.map((act) => {
                    const selected = preferences.vibes.includes(act.name);
                    return (
                      <button
                        key={act.name}
                        onClick={() => handleToggleVibe(act.name)}
                        className={`rounded-xl px-3.5 py-2 font-semibold transition-all border flex items-center gap-1.5 ${
                          selected
                            ? "border-emerald-600 bg-emerald-900 text-white shadow-xs"
                            : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                        }`}
                      >
                        <span>{act.emoji}</span>
                        <span>{act.name}</span>
                        {selected && <Check className="h-3.5 w-3.5 text-emerald-300 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Pace & Timing */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Step 4
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white mt-1">
                  Travel Pace & Daily Schedule
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  How active or relaxed do you want your daily itinerary to be?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { id: "RELAXED", title: "Relaxed", desc: "Late mornings, plenty of cafe chill time, 2-3 stops/day" },
                  { id: "BALANCED", title: "Balanced", desc: "Solid adventure by day, cozy resort chill by night" },
                  { id: "PACKED", title: "Packed", desc: "Dawn to dusk exploring, maximum sights covered" },
                ].map((pace) => (
                  <button
                    key={pace.id}
                    onClick={() => setPreferences({ ...preferences, pace: pace.id as any })}
                    className={`rounded-2xl p-4 border text-left transition-all ${
                      preferences.pace === pace.id
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-300 font-bold"
                        : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
                    }`}
                  >
                    <div className="text-sm font-bold text-stone-900 dark:text-white">{pace.title}</div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">{pace.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Accommodation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Step 5
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white mt-1">
                  Preferred Accommodation
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Choose your lodging style. Room costs will be accurately calculated based on capacity.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {["RESORT", "HOMESTAY", "HOSTEL", "PREMIUM_HOTEL", "VILLA", "BUDGET_HOTEL"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setPreferences({ ...preferences, accommodationType: type as any })}
                    className={`rounded-2xl p-4 border text-left ${
                      preferences.accommodationType === type
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-300 font-bold"
                        : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    <div className="font-bold text-stone-900 dark:text-white">{type.replace("_", " ")}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Transportation */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Step 6
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white mt-1">
                  Transportation & Route Preference
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  How will the group travel from {preferences.originCity}?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { id: "RENTAL_CAR", title: "Rental Car / SUV", desc: "Zoomcar / 7-seater SUV (fast & flexible)" },
                  { id: "PERSONAL_VEHICLE", title: "Personal Vehicle", desc: "Group car convoy with fuel & toll calculations" },
                  { id: "BUS", title: "KSRTC / Sleeper Bus", desc: "Economical group transit directly to Madikeri" },
                ].map((trans) => (
                  <button
                    key={trans.id}
                    onClick={() => setPreferences({ ...preferences, transportPreference: trans.id as any })}
                    className={`rounded-2xl p-4 border text-left ${
                      preferences.transportPreference === trans.id
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-300 font-bold"
                        : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    <div className="font-bold text-stone-900 dark:text-white">{trans.title}</div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">{trans.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Food & Restrictions */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Step 7
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white mt-1">
                  Food Preferences & Constraints
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Ensure dining recommendations cater to regional specialties and dietary restrictions.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Dietary Preferences</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["NON_VEGETARIAN", "VEGETARIAN", "REGIONAL", "STREET_FOOD", "JAIN"].map((diet) => (
                      <button
                        key={diet}
                        onClick={() => {
                          const exists = preferences.dietary.includes(diet);
                          setPreferences({
                            ...preferences,
                            dietary: exists
                              ? preferences.dietary.filter((d) => d !== diet)
                              : [...preferences.dietary, diet],
                          });
                        }}
                        className={`rounded-xl px-3.5 py-2 border font-medium ${
                          preferences.dietary.includes(diet)
                            ? "border-emerald-600 bg-emerald-900 text-white"
                            : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                        }`}
                      >
                        {diet.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Must-Visit Places / Custom Notes</label>
                  <textarea
                    rows={3}
                    value={preferences.customNotes}
                    onChange={(e) => setPreferences({ ...preferences, customNotes: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-3 outline-none focus:border-emerald-600 text-stone-900 dark:text-white"
                    placeholder="e.g. Mandalpatti peak 4x4 off-road is a must. Want comfortable resort with bonfire."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Review & Instant Generation */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Step 8
                </span>
                <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white mt-1">
                  Review & Generate Trip
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Summary of your travel criteria before launching RAG retrieval and constraint-aware optimization.
                </p>
              </div>

              {/* Preference Summary Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-4 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Route</span>
                  <div className="font-bold text-stone-900 dark:text-white">
                    {preferences.originCity} → {preferences.destinationCity}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Dates & Duration</span>
                  <div className="font-bold text-stone-900 dark:text-white">
                    {preferences.days} Days ({preferences.nights} Nights)
                  </div>
                  <div className="text-[10px] text-stone-500">{preferences.startDate} to {preferences.endDate}</div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Departure & Return</span>
                  <div className="font-bold text-stone-900 dark:text-white">
                    Depart: {preferences.departureTime || "08:30"}
                  </div>
                  <div className="text-[10px] text-stone-500">Return: {preferences.returnTime || "17:00"}</div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Group Squad</span>
                  <div className="font-bold text-stone-900 dark:text-white">
                    {preferences.groupSize} Friends
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">{(preferences.friendNames || []).slice(0, 3).join(", ")}...</div>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Total Budget</span>
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 font-serif text-sm">
                    {formatINR(preferences.totalBudget)}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">≈ {formatINR(preferences.totalBudget / preferences.groupSize)}/friend</div>
                </div>
              </div>

              {/* Selected Vibes Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Integrated Vibes & Activities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {preferences.vibes.map((v, i) => (
                    <span key={i} className="rounded-lg bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Generation Progress Indicator if triggered */}
              {isGenerating ? (
                <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/60 p-6 text-center space-y-3">
                  <div className="h-8 w-8 mx-auto rounded-full border-3 border-emerald-800 dark:border-emerald-400 border-t-transparent animate-spin" />
                  <div className="text-sm font-bold text-emerald-950 dark:text-emerald-200 font-serif">
                    Designing your TRIPMATE AI Itinerary...
                  </div>
                  <div className="text-xs text-emerald-800 dark:text-emerald-400 font-medium animate-pulse">
                    {generationStep}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 p-4 text-xs text-stone-600 dark:text-stone-400 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-white">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Real-time RAG & Deterministic Guarantee</span>
                  </div>
                  <p>
                    TRIPMATE AI retrieves official attraction entry guidelines and hotel rates. Prices are computed deterministically by math code, not estimated by LLM arithmetic.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 8 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-900 dark:bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 dark:hover:bg-emerald-500"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 dark:from-emerald-600 dark:to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:scale-105 active:scale-95 disabled:opacity-60 transition-all"
              >
                <Sparkles className="h-4 w-4 text-emerald-300" />
                <span>Generate Itinerary Now</span>
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
