"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Trip, HotelOffer, ExpenseRecord, GroupMember } from "@/lib/types/trip";
import { TripStorage } from "@/lib/db/storage";
import { SAMPLE_COORG_TRIP } from "@/lib/db/mockData";
import { formatINR } from "@/lib/utils";
import { ReplanningService } from "@/lib/services/ReplanningService";

// Workspace subcomponents
import { TimelineView } from "@/components/workspace/TimelineView";
import { InteractiveMap } from "@/components/workspace/InteractiveMap";
import { AccommodationPicker } from "@/components/workspace/AccommodationPicker";
import { BudgetBreakdown } from "@/components/workspace/BudgetBreakdown";
import { GroupExpenses } from "@/components/workspace/GroupExpenses";
import { WhatIfSimulator } from "@/components/workspace/WhatIfSimulator";
import { BookingWallet } from "@/components/workspace/BookingWallet";
import { WeatherSafetyBanner } from "@/components/workspace/WeatherSafetyBanner";
import { AiAssistantDrawer } from "@/components/workspace/AiAssistantDrawer";

import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  Map,
  Hotel,
  PieChart,
  Users,
  Sliders,
  Wallet,
  Bot,
  RotateCcw,
  CheckCircle,
  Share2,
} from "lucide-react";

interface TripWorkspaceClientProps {
  tripId?: string;
}

export function TripWorkspaceClient({ tripId: propTripId }: TripWorkspaceClientProps = {}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryId = searchParams?.get("id");
  const paramId = typeof params?.id === "string" ? params.id : undefined;
  const activeStoredId = typeof window !== "undefined" ? TripStorage.getActiveTripId() : null;
  const tripId = propTripId || queryId || paramId || activeStoredId || SAMPLE_COORG_TRIP.id;

  const [trip, setTrip] = useState<Trip>(SAMPLE_COORG_TRIP);
  const [activeTab, setActiveTab] = useState<
    "TIMELINE" | "MAP" | "STAYS" | "BUDGET" | "EXPENSES" | "SCENARIOS" | "WALLET"
  >("TIMELINE");
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Load trip from storage on mount
  useEffect(() => {
    const loaded = TripStorage.getTripById(tripId);
    if (loaded) {
      setTrip(loaded);
    } else {
      const all = TripStorage.getAllTrips();
      if (all.length > 0) {
        setTrip(all[0]);
      }
    }
  }, [tripId]);

  // Save changes to storage whenever trip state updates
  const updateTripState = (newTrip: Trip) => {
    setTrip(newTrip);
    TripStorage.saveTrip(newTrip);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // 1. Hotel Swap Action
  const handleSelectHotel = (newHotel: HotelOffer) => {
    const result = ReplanningService.replaceHotel(trip, newHotel);
    updateTripState(result.updatedTrip);
  };

  // 2. Remove Activity Action
  const handleRemoveItem = (itemId: string) => {
    const result = ReplanningService.removeActivity(trip, itemId);
    updateTripState(result.updatedTrip);
  };

  // 3. Swap Rain / Indoor Alternative Action
  const handleSwapIndoor = (itemId?: string) => {
    const targetId = itemId || "item-d1-3";
    const result = ReplanningService.applyIndoorAlternative(trip, targetId);
    updateTripState(result.updatedTrip);
  };

  // 4. Add Group Expense Action
  const handleAddExpense = (newExpense: ExpenseRecord) => {
    const updatedTrip: Trip = {
      ...trip,
      expenses: [newExpense, ...trip.expenses],
      updatedAt: new Date().toISOString(),
    };
    updateTripState(updatedTrip);
  };

  // 5. Add Friend / Group Member Action
  const handleAddMember = (newMember: GroupMember) => {
    const updatedMembers = [...trip.members, newMember];
    const newGroupSize = updatedMembers.length;
    // Deterministically update budget perPersonCost & groupSize
    const updatedTrip: Trip = {
      ...trip,
      members: updatedMembers,
      groupSize: newGroupSize,
      budget: {
        ...trip.budget,
        perPersonCost: Math.round(trip.budget.totalTripCost / newGroupSize),
      },
      updatedAt: new Date().toISOString(),
    };
    updateTripState(updatedTrip);
  };

  // 6. Apply Scenario Simulation Action
  const handleApplyScenario = (simulatedTrip: Trip) => {
    updateTripState(simulatedTrip);
    setActiveTab("TIMELINE");
  };

  // 7. Reset to Demo Initial State
  const handleResetTrip = () => {
    TripStorage.resetToDemo();
    setTrip(SAMPLE_COORG_TRIP);
  };

  const tabs = [
    { id: "TIMELINE", label: "Timeline", icon: Clock },
    { id: "MAP", label: "Route Map", icon: Map },
    { id: "STAYS", label: "Accommodation", icon: Hotel },
    { id: "BUDGET", label: "Budget & Costs", icon: PieChart },
    { id: "EXPENSES", label: "Splitwise & Shared", icon: Users },
    { id: "SCENARIOS", label: "What-If Simulator", icon: Sliders },
    { id: "WALLET", label: "Wallet & Export", icon: Wallet },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] dark:bg-[#09120e] text-stone-900 dark:text-stone-100 transition-colors duration-300">
      <Navbar />

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-stone-900 dark:bg-stone-800 border border-emerald-500/30 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom duration-300">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>Plan & Budget Updated Deterministically</span>
        </div>
      )}

      {/* Workspace Sub-Header */}
      <section className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 py-6 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  {trip.destination}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {trip.days} Days • {trip.nights} Nights
                </span>
                <span className="text-stone-300 dark:text-stone-600">•</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {trip.groupSize} Travelers ({trip.preferences.groupProfile})
                </span>
                <span className="text-stone-300 dark:text-stone-600">•</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Origin: {trip.originCity}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 dark:text-white">
                {trip.title}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-3xl">
                {trip.tagline}
              </p>

              {/* Squad Members / Friends Names Roster */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mr-1">
                  <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Squad ({trip.members.length}):
                </span>
                {trip.members.map((member, idx) => (
                  <div
                    key={member.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/80 pl-1 pr-2.5 py-0.5 text-xs font-medium text-stone-800 dark:text-stone-200 shadow-xs"
                    title={member.email || member.name}
                  >
                    <img
                      src={member.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(member.name)}`}
                      alt={member.name}
                      className="h-5 w-5 rounded-full object-cover border border-emerald-500/40"
                    />
                    <span>{member.name}</span>
                    {idx === 0 && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 ml-0.5">★ Lead</span>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setActiveTab("EXPENSES")}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-emerald-500/50 hover:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/50 transition-colors"
                >
                  <span>+ Add Friend</span>
                </button>
              </div>
            </div>

            {/* Quick Stats & AI Action Button */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/80 px-4 py-2 text-right">
                <div className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500">Total Group Cost</div>
                <div className="text-lg font-bold font-serif text-stone-900 dark:text-white">
                  {formatINR(trip.budget.totalTripCost)}
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  {formatINR(trip.budget.perPersonCost)} / friend
                </div>
              </div>

              <button
                onClick={() => setIsAiDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 dark:from-emerald-600 dark:to-teal-600 px-4 py-3 text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Bot className="h-4 w-4" />
                <span>AI Assistant</span>
              </button>

              <button
                onClick={handleResetTrip}
                className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-3 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white transition-colors"
                title="Reset trip to demo state"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex items-center gap-1.5 overflow-x-auto border-t border-stone-100 dark:border-stone-800 pt-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-800 to-teal-800 dark:from-emerald-600 dark:to-teal-600 text-white shadow-xs"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Workspace Body */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Weather & Rain Safety Warning Banner */}
        <WeatherSafetyBanner
          destination={trip.destination}
          hasWeatherSensitiveItems={trip.daysItinerary.some((d) =>
            d.items.some((i) => i.weatherSensitive)
          )}
          onApplyIndoorAlternative={() => handleSwapIndoor()}
        />

        {/* Tab Content Views */}
        {activeTab === "TIMELINE" && (
          <TimelineView
            days={trip.daysItinerary}
            onRemoveItem={handleRemoveItem}
            onSwapIndoor={handleSwapIndoor}
          />
        )}

        {activeTab === "MAP" && (
          <div className="h-[600px] w-full">
            <InteractiveMap
              days={trip.daysItinerary}
              selectedHotel={trip.selectedHotel}
              destination={trip.destination}
            />
          </div>
        )}

        {activeTab === "STAYS" && (
          <AccommodationPicker
            currentHotel={trip.selectedHotel}
            groupSize={trip.groupSize}
            nights={trip.nights}
            destination={trip.destination}
            onSelectHotel={handleSelectHotel}
          />
        )}

        {activeTab === "BUDGET" && (
          <BudgetBreakdown budget={trip.budget} groupSize={trip.groupSize} />
        )}

        {activeTab === "EXPENSES" && (
          <GroupExpenses
            members={trip.members}
            expenses={trip.expenses}
            onAddExpense={handleAddExpense}
            onAddMember={handleAddMember}
          />
        )}

        {activeTab === "SCENARIOS" && (
          <WhatIfSimulator trip={trip} onApplyScenario={handleApplyScenario} />
        )}

        {activeTab === "WALLET" && <BookingWallet trip={trip} />}
      </main>

      {/* Conversational AI Assistant Drawer */}
      <AiAssistantDrawer
        trip={trip}
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        onUpdateTrip={updateTripState}
      />

      <Footer />
    </div>
  );
}
