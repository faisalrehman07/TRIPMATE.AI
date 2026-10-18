"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, MapPin, Layers, ShieldCheck, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/wizard", label: "Plan a Trip", icon: Sparkles },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/compare", label: "Compare", icon: Layers },
    { href: "/trips", label: "Saved Trips", icon: MapPin },
    { href: "/admin", label: "RAG & Data", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800/80 bg-stone-50/90 dark:bg-stone-950/85 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-emerald-400 shadow-md shadow-emerald-950/20 transition-transform duration-300 group-hover:scale-105 border border-emerald-700/30">
            <Compass className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                TRIPMATE<span className="text-emerald-700 dark:text-emerald-400 font-sans ml-1 text-xs tracking-widest uppercase font-bold">AI</span>
              </span>
            </div>
            <p className="text-[10px] font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
              Vibe • Budget • Journey
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200",
                  isActive
                    ? "bg-emerald-950/10 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-800/20 dark:border-emerald-500/30 shadow-2xs"
                    : "text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-emerald-700 dark:text-emerald-400" : "text-stone-400")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & Controls */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/80 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Demo Mode Active
          </div>

          <Link
            href="/wizard"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-900 dark:from-emerald-600 dark:to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95"
          >
            <span>Start Planning</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-4 py-4 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold",
                    isActive
                      ? "bg-emerald-900/10 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300"
                      : "text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <Link
                href="/wizard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-900 dark:bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm"
              >
                <span>Start Planning Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
