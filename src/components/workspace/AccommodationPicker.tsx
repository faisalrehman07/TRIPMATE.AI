"use client";

import React, { useState } from "react";
import { HotelOffer } from "@/lib/types/trip";
import { SAMPLE_HOTELS } from "@/lib/db/mockData";
import { formatINR } from "@/lib/utils";
import { Star, ShieldCheck, Check, ArrowRightLeft, Users, Building, Sparkles } from "lucide-react";

interface AccommodationPickerProps {
  currentHotel: HotelOffer;
  groupSize: number;
  nights: number;
  destination: string;
  onSelectHotel: (hotel: HotelOffer) => void;
}

export function AccommodationPicker({
  currentHotel,
  groupSize,
  nights,
  destination,
  onSelectHotel,
}: AccommodationPickerProps) {
  const [filterMode, setFilterMode] = useState<"ALL" | "CHEAPEST" | "BEST_RATED">("ALL");

  const hotelList = SAMPLE_HOTELS["Coorg (Kodagu)"] || [];

  // Filter & sort
  let displayedHotels = [...hotelList];
  if (filterMode === "CHEAPEST") {
    displayedHotels.sort((a, b) => a.totalStayCost - b.totalStayCost);
  } else if (filterMode === "BEST_RATED") {
    displayedHotels.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-white">
            Accommodation Intelligence & Room Allocation
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Calculated for <span className="font-semibold text-stone-900 dark:text-white">{groupSize} guests</span> across{" "}
            <span className="font-semibold text-stone-900 dark:text-white">{nights} nights</span> based on room capacity (2 guests/room).
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 p-1 border border-stone-200 dark:border-stone-700">
          <button
            onClick={() => setFilterMode("ALL")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterMode === "ALL" ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs" : "text-stone-600 dark:text-stone-400"
            }`}
          >
            All Verified ({displayedHotels.length})
          </button>
          <button
            onClick={() => setFilterMode("CHEAPEST")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterMode === "CHEAPEST" ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs" : "text-stone-600 dark:text-stone-400"
            }`}
          >
            Cheapest First
          </button>
          <button
            onClick={() => setFilterMode("BEST_RATED")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterMode === "BEST_RATED" ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs" : "text-stone-600 dark:text-stone-400"
            }`}
          >
            Top Rated
          </button>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedHotels.map((hotel) => {
          const isSelected = currentHotel.id === hotel.id;
          const costDiff = hotel.totalStayCost - currentHotel.totalStayCost;

          return (
            <div
              key={hotel.id}
              className={`relative flex flex-col rounded-3xl border transition-all duration-300 overflow-hidden ${
                isSelected
                  ? "border-emerald-600 dark:border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20"
                  : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 hover:border-emerald-400/50 hover:shadow-lg"
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{hotel.rating}</span>
                  <span className="text-stone-300">({hotel.reviewCount} verified reviews)</span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-950/90 px-2.5 py-1 text-[10px] font-bold text-emerald-400 backdrop-blur">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Live Verified</span>
                </div>

                {isSelected && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-xl bg-emerald-800 dark:bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    <Check className="h-4 w-4" />
                    <span>Currently Active Stay</span>
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">
                        {hotel.type}
                      </span>
                      <h4 className="text-base font-bold text-stone-900 dark:text-white mt-0.5">{hotel.name}</h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">{hotel.address}</p>
                    </div>
                  </div>

                  {/* Room Math Breakdown */}
                  <div className="mt-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/80 p-3.5 text-xs">
                    <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-stone-500 dark:text-stone-400" />
                        Room Allocation Math:
                      </span>
                      <span className="font-bold text-stone-900 dark:text-white">
                        {hotel.requiredRooms} Double Rooms ({hotel.maxOccupancyPerRoom} guests/room)
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                      <span>
                        ₹{hotel.pricePerNight.toLocaleString("en-IN")}/room × {hotel.requiredRooms} rooms × {nights} nights
                      </span>
                      <span className="font-bold text-stone-900 dark:text-white">
                        {formatINR(hotel.totalStayCost)} Total
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {hotel.amenities.slice(0, 4).map((amenity, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[10px] font-medium text-stone-600 dark:text-stone-300"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-stone-900 dark:text-white">
                      {formatINR(hotel.totalStayCost)}
                      <span className="text-xs font-normal text-stone-500 dark:text-stone-400"> total stay</span>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      {formatINR(hotel.perPersonStayCost)} / person
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      <Check className="h-4 w-4" />
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectHotel(hotel)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 dark:bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                      <ArrowRightLeft className="h-3.5 w-3.5" />
                      <span>
                        Swap to This {costDiff < 0 ? `(Save ₹${Math.abs(costDiff).toLocaleString("en-IN")})` : `(+₹${costDiff.toLocaleString("en-IN")})`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
