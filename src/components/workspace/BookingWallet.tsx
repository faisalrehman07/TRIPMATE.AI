"use client";

import React, { useState } from "react";
import { Trip } from "@/lib/types/trip";
import { formatINR } from "@/lib/utils";
import {
  Wallet,
  Printer,
  Share2,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Copy,
  PhoneCall,
  MapPin,
  Calendar,
} from "lucide-react";

interface BookingWalletProps {
  trip: Trip;
}

export function BookingWallet({ trip }: BookingWalletProps) {
  const [copied, setCopied] = useState(false);

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            Central Booking Wallet & Passes
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            Confirmed reservation vouchers, official provider booking portals, and emergency contacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 shadow-xs hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            {copied ? <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Link Copied!" : "Share Trip Link"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 dark:bg-stone-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print Itinerary / PDF</span>
          </button>
        </div>
      </div>

      {/* Accommodation Voucher Card */}
      {trip.selectedHotel && (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white dark:bg-stone-900/90 p-5 shadow-sm backdrop-blur-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-950 dark:bg-emerald-900/50 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-800/50">
                🏨
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">
                  Verified Stay Voucher
                </span>
                <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">{trip.selectedHotel.name}</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">{trip.selectedHotel.address}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Direct Provider Verified
              </span>
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-1">
                Ref: TM-{trip.selectedHotel.id.toUpperCase().slice(0, 8)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
            <div>
              <span className="text-stone-400 dark:text-stone-500 text-[10px] uppercase">Allocated Rooms</span>
              <div className="font-semibold text-stone-800 dark:text-stone-200">
                {trip.selectedHotel.requiredRooms} Double Rooms
              </div>
            </div>
            <div>
              <span className="text-stone-400 dark:text-stone-500 text-[10px] uppercase">Dates / Nights</span>
              <div className="font-semibold text-stone-800 dark:text-stone-200">
                {trip.days} Days • {trip.nights} Nights
              </div>
            </div>
            <div>
              <span className="text-stone-400 dark:text-stone-500 text-[10px] uppercase">Total Cost</span>
              <div className="font-bold text-emerald-700 dark:text-emerald-400">
                {formatINR(trip.selectedHotel.totalStayCost)}
              </div>
            </div>
            <div>
              <span className="text-stone-400 dark:text-stone-500 text-[10px] uppercase">Cancellation</span>
              <div className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                {trip.selectedHotel.cancellationPolicy}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <a
              href={trip.selectedHotel.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300"
            >
              <span>Open Provider Direct Booking Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Emergency & Official Tourism Contacts */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 p-5 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
          <PhoneCall className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          Verified Regional Travel & Emergency Assistance ({trip.destination})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-3">
            <div className="font-bold text-stone-900 dark:text-stone-100">Regional Tourism Helpline</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-semibold mt-1">1800 425 2424</div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Toll-free 24/7 tourist helpline</div>
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-3">
            <div className="font-bold text-stone-900 dark:text-stone-100">Police / Medical Emergency</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-semibold mt-1">112 / Emergency SOS</div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">District GH & Ambulance dispatch</div>
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-3">
            <div className="font-bold text-stone-900 dark:text-stone-100">Forest / Adventure Checkpoint</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-semibold mt-1">08272-228439</div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Trail permits & 4x4 Jeep registration</div>
          </div>
        </div>
      </div>
    </div>
  );
}
