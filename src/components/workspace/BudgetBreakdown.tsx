"use client";

import React from "react";
import { BudgetSummary } from "@/lib/types/trip";
import { formatINR } from "@/lib/utils";
import { DollarSign, AlertCircle, Lightbulb, TrendingUp, ShieldCheck, PieChart, Users } from "lucide-react";

interface BudgetBreakdownProps {
  budget: BudgetSummary;
  groupSize: number;
}

export function BudgetBreakdown({ budget, groupSize }: BudgetBreakdownProps) {
  const categories = [
    { label: "Accommodation (Stay)", amount: budget.categories.accommodation, color: "bg-emerald-600 dark:bg-emerald-500" },
    { label: "Intercity Transit & Tolls", amount: budget.categories.intercityTransport, color: "bg-teal-600 dark:bg-teal-500" },
    { label: "Local Transport (4x4 Jeep)", amount: budget.categories.localTransport, color: "bg-amber-600 dark:bg-amber-500" },
    { label: "Food & Dining", amount: budget.categories.food, color: "bg-orange-500 dark:bg-orange-400" },
    { label: "Activities & Sightseeing", amount: budget.categories.activities + budget.categories.tickets, color: "bg-indigo-600 dark:bg-indigo-400" },
    { label: "Emergency Contingency", amount: budget.contingencyReserve, color: "bg-stone-400 dark:bg-stone-500" },
  ];

  const isOverBudget = budget.totalTripCost > budget.budgetLimit;

  return (
    <div className="space-y-6">
      {/* Top Cards: Total, Per-Person, Remaining, Utilisation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-500/30">
          <div className="text-xs font-medium text-stone-500 dark:text-stone-400">Estimated Total Cost</div>
          <div className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">
            {formatINR(budget.totalTripCost)}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            Target Budget: {formatINR(budget.budgetLimit)}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-500/50">
          <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Cost Per Person ({groupSize} Guests)</div>
          <div className="text-2xl font-bold font-serif text-emerald-900 dark:text-emerald-400 mt-1">
            {formatINR(budget.perPersonCost)}
          </div>
          <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/70 mt-1">
            Equal split allocation
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-stone-300 dark:hover:border-stone-700">
          <div className="text-xs font-medium text-stone-500 dark:text-stone-400">
            {isOverBudget ? "Budget Deficit" : "Remaining Buffer"}
          </div>
          <div className={`text-2xl font-bold font-serif mt-1 ${isOverBudget ? "text-rose-600 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"}`}>
            {formatINR(Math.abs(budget.remainingBudget))}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            {isOverBudget ? "Exceeds plan limit" : "Safe cushion left"}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-stone-300 dark:hover:border-stone-700">
          <div className="text-xs font-medium text-stone-500 dark:text-stone-400">Budget Utilization</div>
          <div className={`text-2xl font-bold font-serif mt-1 ${budget.utilizationPercent > 100 ? "text-rose-600 dark:text-rose-400" : "text-stone-900 dark:text-stone-100"}`}>
            {budget.utilizationPercent}%
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            Deterministic formula
          </div>
        </div>
      </div>

      {/* Utilization Progress Bar */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
          <span className="flex items-center gap-1.5">
            <PieChart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Category Allocation Distribution
          </span>
          <span className="font-mono text-stone-900 dark:text-stone-200">{formatINR(budget.totalTripCost)} / {formatINR(budget.budgetLimit)}</span>
        </div>

        {/* Stacked multi-color bar */}
        <div className="h-4 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex shadow-inner">
          {categories.map((cat, idx) => {
            const pct = (cat.amount / Math.max(1, budget.totalTripCost)) * 100;
            if (pct <= 0) return null;
            return (
              <div
                key={idx}
                title={`${cat.label}: ${formatINR(cat.amount)} (${pct.toFixed(1)}%)`}
                style={{ width: `${pct}%` }}
                className={`${cat.color} transition-all duration-500 hover:opacity-90`}
              />
            );
          })}
        </div>

        {/* Breakdown Items List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          {categories.map((cat, idx) => {
            const pct = ((cat.amount / Math.max(1, budget.totalTripCost)) * 100).toFixed(0);
            return (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className={`h-3 w-3 rounded-full shrink-0 ${cat.color}`} />
                <div className="truncate">
                  <div className="font-medium text-stone-900 dark:text-stone-200 truncate">{cat.label}</div>
                  <div className="text-stone-500 dark:text-stone-400 text-[11px]">
                    {formatINR(cat.amount)} ({pct}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warnings & Suggestions */}
      {(budget.warnings.length > 0 || budget.costSavingTips.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budget.warnings.length > 0 && (
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/20 p-4">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-semibold text-xs">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Budget Alerts</span>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-amber-800 dark:text-amber-300/90">
                {budget.warnings.map((w, idx) => (
                  <li key={idx}>• {w}</li>
                ))}
              </ul>
            </div>
          )}

          {budget.costSavingTips.length > 0 && (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-4">
              <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-300 font-semibold text-xs">
                <Lightbulb className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                <span>Optimization Recommendations</span>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-emerald-900 dark:text-emerald-200/90">
                {budget.costSavingTips.map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
