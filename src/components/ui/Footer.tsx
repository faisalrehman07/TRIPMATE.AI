import React from "react";
import Link from "next/link";
import { Compass, ShieldCheck, Database, Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800/80 bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-300 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-900 to-teal-950 text-emerald-400 border border-emerald-700/30">
                <Compass className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-stone-900 dark:text-white">
                TRIPMATE<span className="text-emerald-700 dark:text-emerald-400 font-sans ml-1 text-xs tracking-wider uppercase">AI</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">
              The intelligent travel planning platform combining hybrid RAG retrieval, live provider intelligence, deterministic budgeting, and adaptive replanning.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Grounded data • Zero hallucinated prices</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">Platform</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/wizard" className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">
                  Trip Creation Wizard
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">
                  Destination Discovery
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">
                  Compare Destinations
                </Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">
                  Saved Itineraries
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">AI & Engineering</h4>
            <ul className="mt-3 space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/admin" className="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">
                  RAG Vector Ingestion & Inspection
                </Link>
              </li>
              <li>
                <span>Deterministic Budget Engine</span>
              </li>
              <li>
                <span>Constraint-Aware Optimization</span>
              </li>
              <li>
                <span>Splitwise-Style Debt Settlement</span>
              </li>
            </ul>
          </div>

          {/* Verified Sources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">Verified Sources</h4>
            <p className="mt-3 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Karnataka State Tourism Development Corporation (KSTDC), Kerala Tourism, Jungle Lodges & Resorts, Kodava Heritage Culinary Guild, and OpenStreetMap.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
              <Database className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
              <span>PostgreSQL • pgvector • OSRM Routing</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 dark:border-stone-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <p>© 2026 TRIPMATE AI. All rights reserved. Crafted for Indian travelers and beyond.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Demo Mode: 100% Operational without API keys
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
