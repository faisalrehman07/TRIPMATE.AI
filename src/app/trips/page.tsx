"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Trip } from "@/lib/types/trip";
import { TripStorage } from "@/lib/db/storage";
import { formatINR } from "@/lib/utils";
import { MapPin, Calendar, Users, ArrowRight, Plus, Trash2, ShieldCheck } from "lucide-react";

export default function SavedTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    setTrips(TripStorage.getAllTrips());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    TripStorage.deleteTrip(id);
    setTrips(TripStorage.getAllTrips());
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 transition-colors">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-stone-900 dark:text-stone-100">Your Saved Trips</h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Access and manage your generated travel itineraries, group budgets, and live plans.
            </p>
          </div>

          <Link
            href="/wizard"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 dark:bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 dark:hover:bg-emerald-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Trip</span>
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-12 text-center max-w-md mx-auto space-y-4 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-2xl bg-stone-100 dark:bg-stone-800 mx-auto flex items-center justify-center text-stone-500 dark:text-stone-400">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">No saved trips yet</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Launch the Trip Creation Wizard to design your first intelligent, budget-optimized getaway.
            </p>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 dark:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 dark:hover:bg-emerald-600 transition-colors"
            >
              <span>Start Planning</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="group relative flex flex-col rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 overflow-hidden shadow-sm hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-md transition-all backdrop-blur-sm"
              >
                {/* Image / Header bar */}
                <div className="relative h-44 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <img
                    src={
                      trip.selectedHotel?.image ||
                      "https://images.unsplash.com/photo-1592639296346-560c37a0f711?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={trip.destination}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                    {trip.destination}
                  </div>
                  <div className="absolute top-3 right-3 rounded-full bg-emerald-950/80 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 backdrop-blur flex items-center gap-1 border border-emerald-800/40">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Live Verified</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">{trip.tagline}</p>

                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-stone-600 dark:text-stone-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-stone-400" />
                        <span>{trip.days} Days ({trip.nights} Nights)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-stone-400" />
                        <span>{trip.groupSize} Guests</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                        {formatINR(trip.budget.totalTripCost)}
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        {formatINR(trip.budget.perPersonCost)} / person
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(trip.id, e)}
                        className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        title="Delete saved trip"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 group-hover:bg-emerald-900 dark:group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
