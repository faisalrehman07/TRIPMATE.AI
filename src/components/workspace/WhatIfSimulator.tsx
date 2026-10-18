"use client";

import React, { useState } from "react";
import { Trip, ScenarioSimulation } from "@/lib/types/trip";
import { formatINR } from "@/lib/utils";
import { Sliders, Plus, Users, Calendar, ArrowRight, Check, Sparkles, RefreshCw } from "lucide-react";
import { BudgetCalculationService } from "@/lib/services/BudgetCalculationService";

interface WhatIfSimulatorProps {
  trip: Trip;
  onApplyScenario: (simulatedTrip: Trip) => void;
}

export function WhatIfSimulator({ trip, onApplyScenario }: WhatIfSimulatorProps) {
  const [extraDays, setExtraDays] = useState(0);
  const [extraFriends, setExtraFriends] = useState(0);
  const [stayTier, setStayTier] = useState<"CURRENT" | "BUDGET" | "LUXURY">("CURRENT");
  const [transportMode, setTransportMode] = useState<"SUV" | "BUS">("SUV");

  // Calculate live delta deterministically
  const simulatedDays = trip.days + extraDays;
  const simulatedNights = trip.nights + extraDays;
  const simulatedGroupSize = trip.groupSize + extraFriends;

  // Hotel price adjustment
  let nightlyPrice = trip.selectedHotel?.pricePerNight || 2400;
  if (stayTier === "BUDGET") nightlyPrice = 1200; // Zostel
  if (stayTier === "LUXURY") nightlyPrice = 3500; // Heritage Resort

  const stayCalc = BudgetCalculationService.calculateStayCost(
    { pricePerNight: nightlyPrice, maxOccupancyPerRoom: 2 },
    simulatedNights,
    simulatedGroupSize,
    trip.preferences.roomPreference
  );

  // Transit adjustment
  const transitCost = transportMode === "BUS" ? 1800 * simulatedGroupSize : 6500;
  const foodCost = (trip.budget.categories.food / trip.days / trip.groupSize) * simulatedDays * simulatedGroupSize;
  const activitiesCost = trip.budget.categories.activities + (extraDays * 600 * (simulatedGroupSize / trip.groupSize));

  const simulatedTotalCost = Math.round(
    stayCalc.totalStayCost + transitCost + foodCost + activitiesCost + trip.budget.contingencyReserve
  );
  const simulatedPerPerson = Math.round(simulatedTotalCost / simulatedGroupSize);

  const costDelta = simulatedTotalCost - trip.budget.totalTripCost;
  const perPersonDelta = simulatedPerPerson - trip.budget.perPersonCost;
  const isFeasible = simulatedTotalCost <= trip.budget.budgetLimit;

  const handleApply = () => {
    // Generate new updated trip reflecting scenario
    const updatedTrip: Trip = {
      ...trip,
      days: simulatedDays,
      nights: simulatedNights,
      groupSize: simulatedGroupSize,
      preferences: {
        ...trip.preferences,
        days: simulatedDays,
        nights: simulatedNights,
        groupSize: simulatedGroupSize,
      },
      budget: {
        ...trip.budget,
        totalTripCost: simulatedTotalCost,
        perPersonCost: simulatedPerPerson,
        remainingBudget: trip.budget.budgetLimit - simulatedTotalCost,
        utilizationPercent: Number(((simulatedTotalCost / trip.budget.budgetLimit) * 100).toFixed(1)),
        categories: {
          ...trip.budget.categories,
          accommodation: stayCalc.totalStayCost,
          intercityTransport: transitCost,
          food: Math.round(foodCost),
          activities: Math.round(activitiesCost),
        },
      },
      updatedAt: new Date().toISOString(),
    };
    onApplyScenario(updatedTrip);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Sliders className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          What-If Scenario Simulator
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
          Simulate timeline, headcount, or stay changes before committing them to the live plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Sliders & Toggles */}
        <div className="lg:col-span-7 space-y-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 shadow-sm backdrop-blur-sm">
          {/* Slider 1: Extra Days */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-900 dark:text-stone-200">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                Trip Duration:
              </span>
              <span className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-emerald-800 dark:text-emerald-300 font-bold">
                {simulatedDays} Days ({simulatedNights} Nights)
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              {[0, 1, 2].map((days) => (
                <button
                  key={days}
                  onClick={() => setExtraDays(days)}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold border transition-all ${
                    extraDays === days
                      ? "border-emerald-600 dark:border-emerald-500 bg-emerald-900 dark:bg-emerald-800 text-white shadow-xs"
                      : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  {days === 0 ? "Standard 3 Days" : `+${days} Extra Day (${3 + days}D)`}
                </button>
              ))}
            </div>
          </div>

          {/* Slider 2: Extra Friends */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-900 dark:text-stone-200">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                Group Headcount:
              </span>
              <span className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-emerald-800 dark:text-emerald-300 font-bold">
                {simulatedGroupSize} Friends ({stayCalc.requiredRooms} Rooms)
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              {[0, 2, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => setExtraFriends(count)}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold border transition-all ${
                    extraFriends === count
                      ? "border-emerald-600 dark:border-emerald-500 bg-emerald-900 dark:bg-emerald-800 text-white shadow-xs"
                      : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  {count === 0 ? "6 Friends" : `+${count} Friends (${6 + count})`}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle 3: Stay Tier */}
          <div>
            <div className="text-xs font-semibold text-stone-900 dark:text-stone-200 mb-2">Accommodation Tier:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setStayTier("BUDGET")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  stayTier === "BUDGET"
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold"
                    : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300"
                }`}
              >
                <div className="font-semibold text-stone-900 dark:text-stone-100">Hostel Pods</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400">₹1,200/night</div>
              </button>

              <button
                onClick={() => setStayTier("CURRENT")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  stayTier === "CURRENT"
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold"
                    : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300"
                }`}
              >
                <div className="font-semibold text-stone-900 dark:text-stone-100">Balanced Resort</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400">₹2,400/night</div>
              </button>

              <button
                onClick={() => setStayTier("LUXURY")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  stayTier === "LUXURY"
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold"
                    : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300"
                }`}
              >
                <div className="font-semibold text-stone-900 dark:text-stone-100">Luxury Heritage</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400">₹3,500/night</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Impact Card & Apply Action */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/90 p-5 shadow-sm backdrop-blur-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Simulated Outcome
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  isFeasible
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                    : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                }`}
              >
                {isFeasible ? "Within Budget Limit" : "Exceeds Plan Limit"}
              </span>
            </div>

            {/* Simulated Costs */}
            <div className="mt-4 space-y-3">
              <div>
                <div className="text-xs text-stone-500 dark:text-stone-400">Simulated Group Cost:</div>
                <div className="text-3xl font-bold font-serif text-stone-900 dark:text-stone-100">
                  {formatINR(simulatedTotalCost)}
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  Difference:{" "}
                  <span className={`font-semibold ${costDelta > 0 ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                    {costDelta >= 0 ? "+" : ""}
                    {formatINR(costDelta)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
                <div className="text-xs text-stone-500 dark:text-stone-400">Simulated Cost Per Person:</div>
                <div className="text-xl font-bold text-emerald-800 dark:text-emerald-400 font-serif">
                  {formatINR(simulatedPerPerson)}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  {perPersonDelta >= 0 ? "+" : ""}
                  {formatINR(perPersonDelta)} per friend
                </div>
              </div>

              <div className="rounded-xl bg-white dark:bg-stone-800/80 p-3 border border-stone-200 dark:border-stone-700 text-xs space-y-1">
                <div className="text-stone-700 dark:text-stone-300">
                  • Accommodation: {stayCalc.requiredRooms} rooms required ({formatINR(stayCalc.totalStayCost)})
                </div>
                <div className="text-stone-700 dark:text-stone-300">
                  • Food & Dining: {formatINR(foodCost)} ({simulatedDays} days)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center gap-3">
            <button
              onClick={handleApply}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 dark:bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-800 dark:hover:bg-emerald-600"
            >
              <Check className="h-4 w-4" />
              <span>Apply This Scenario</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
