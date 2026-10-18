# TRIPMATE AI — Intelligent Travel Planning Platform

> **Tagline:** *Your vibe. Your budget. Your journey.*

TRIPMATE AI is a functional, full-stack travel-tech platform that combines:
1. **Retrieval-Augmented Generation (RAG)** grounded in official regional tourism guides and safety bulletins.
2. **Deterministic Mathematical Budgeting** (zero LLM arithmetic, explicit room occupancy formulas, live rupee-level tracking).
3. **Adaptive Replanning Engine** (hot-swapping hotels, removing activities, rain-sensitive indoor alternatives, undo history).
4. **Group Expense Ledger & Debt Simplification** (Splitwise-style minimal transaction settlement algorithm).
5. **Interactive Route Mapping** (Leaflet OpenStreetMap with day-specific route filters and waypoint popups).
6. **What-If Scenario Simulator** (simulates timeline extensions, headcount changes, and stay upgrades with real-time cost deltas).
7. **Conversational Travel Assistant** with tool calling and grounded source citations.

---

## 🌟 The Benchmark Trip Scenario

TRIPMATE AI natively models and solves complex group travel prompts:

> *"We are six friends travelling from Bengaluru for three days. Our total budget is ₹30,000. We want adventure, scenic places, good food and a little nightlife. We prefer a comfortable resort but don’t want to waste money travelling between attractions."*

The application:
* Identifies **Coorg (Kodagu)** as the top 96% match.
* Calculates room requirements accurately: **6 guests needing private double rooms = 3 double rooms** (not dividing a single room rate by 6).
* Allocates 3 rooms for 2 nights at Woodstock Resort (₹14,400).
* Integrates Mandalpatti 4x4 Jeep trail ascent, Abbey Falls, Raja's Seat sunset, and Namdroling Monastery.
* Accounts for Bengaluru-Coorg SUV transit fuel & expressway tolls (₹6,500 return).
* Computes deterministic total: **₹28,650** (leaving a safe ₹1,350 contingency cushion under ₹30,000).

---

## 🛠️ Technology Stack

* **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
* **Styling:** Tailwind CSS (Luxury editorial travel-tech palette: Deep Forest Green `#12372A`, warm stone cream, ochre accents)
* **Icons:** Lucide React
* **Mapping:** Leaflet & CartoDB Positron / OpenStreetMap Tiles
* **Database & Vector:** Supabase PostgreSQL with `pgvector` extension and GIN `tsvector` keyword search
* **State & Offline:** Persistent browser storage + In-Memory Vector Engine for 100% out-of-the-box zero-config execution
* **Test Runner:** `tsx` Automated Test Runner

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd "TRIPMATE AI"
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(By default, `NEXT_PUBLIC_ENABLE_DEMO_MODE=true` is enabled, meaning the application runs with full verified data, vector embeddings, and zero paid API keys needed).*

### 3. Run Automated Tests
```bash
npm test
```
All 29 tests execute verifying budget formulas, room capacity calculations, Splitwise settlement math, RAG retrieval, and adaptive replanning:
```
========================================================
Test Execution Finished: 29/29 Tests Passed (100%)
========================================================
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
```

---

## 📂 Project Architecture

```
src/
├── app/
│   ├── page.tsx                     # Landing page with interactive natural language prompt box
│   ├── layout.tsx                   # Root luxury editorial layout & metadata
│   ├── globals.css                  # Design tokens, custom scrollbars, Leaflet container styles
│   ├── wizard/page.tsx              # 8-step Trip Creation Wizard with multi-phase generation
│   ├── explore/page.tsx             # Destination discovery engine with vibe & budget filtering
│   ├── compare/page.tsx             # Side-by-side comparison matrix (Coorg vs Chikmagalur vs Wayanad)
│   ├── trips/page.tsx               # Saved trips directory
│   ├── trips/[id]/page.tsx          # Full Itinerary Workspace with tabbed views & streaming Suspense
│   ├── admin/page.tsx               # RAG Vector Ingestion & Live Hybrid Search Console
│   └── api/
│       ├── chat/route.ts            # Conversational assistant with tool calling
│       ├── destinations/route.ts    # Multi-criteria destination discovery API
│       ├── generate/route.ts        # Itinerary generator & constraint optimizer
│       ├── rag/route.ts             # Hybrid retrieval & document ingestion API
│       └── replan/route.ts          # Adaptive replanning engine API
├── components/
│   ├── ui/
│   │   ├── Navbar.tsx               # Navigation with demo indicator
│   │   └── Footer.tsx               # Provenance & verified source credits
│   └── workspace/
│       ├── TimelineView.tsx         # Hour-by-hour day schedule with 1-click actions
│       ├── InteractiveMap.tsx       # Client-side Leaflet map with day filters & polylines
│       ├── AccommodationPicker.tsx  # Hotel comparison with explicit room capacity math
│       ├── BudgetBreakdown.tsx      # Deterministic budget progress bar & category bars
│       ├── GroupExpenses.tsx        # Splitwise-style ledger & minimal debt settlement
│       ├── WhatIfSimulator.tsx      # Interactive slider delta simulator (+days, +friends, +tier)
│       ├── BookingWallet.tsx        # Central voucher wallet, passes, PDF export & sharing
│       ├── WeatherSafetyBanner.tsx  # Live forecast & 1-click rain indoor alternative swap
│       └── AiAssistantDrawer.tsx    # Slide-over AI chat with actionable tool execution
├── lib/
│   ├── types/
│   │   ├── trip.ts                  # Comprehensive data models for trips, hotels, expenses
│   │   └── rag.ts                   # Knowledge documents, chunks, and retrieval types
│   ├── db/
│   │   ├── mockData.ts              # Pre-seeded verified Karnataka & Kerala tourism data
│   │   └── storage.ts               # Browser localStorage persistence & state sync
│   ├── services/
│   │   ├── BudgetCalculationService.ts  # Deterministic math & room occupancy logic
│   │   ├── ExpenseSettlementService.ts  # Splitwise debt simplification algorithm
│   │   ├── HybridRetrievalService.ts    # 60% Vector Cosine + 40% Keyword BM25 RAG
│   │   ├── LiveTravelDataService.ts     # Accommodation, weather & routing adapters
│   │   └── ReplanningService.ts         # Natural language and visual itinerary replanning
│   └── tests/
│       └── runTests.ts              # 29-test automated test suite
supabase/
└── migrations/
    └── 20261018000000_tripmate_schema.sql  # Full PostgreSQL schema with pgvector & RLS
```

---

## 🧮 Mathematical & Algorithmic Rigor

### 1. Room Occupancy Calculation
$$\text{Required Rooms} = \left\lceil \frac{\text{Group Size}}{\text{Max Occupancy Per Room}} \right\rceil$$
For 6 guests in private double rooms: $\lceil 6 / 2 \rceil = 3 \text{ rooms}$.
Total Stay Cost: $3 \text{ rooms} \times \text{Nightly Rate} \times \text{Total Nights}$.

### 2. Debt Simplification Settlement Algorithm
Given $N$ group members and a list of expenses with individual allocations:
1. Compute Net Balance for each member:
   $$\text{Net}_i = \text{Amount Paid}_i - \text{Share Owed}_i$$
2. Segregate members into **Creditors** ($\text{Net} > 0$) and **Debtors** ($\text{Net} < 0$).
3. Greedily match maximum debtor with maximum creditor, minimizing total financial transactions down to at most $N-1$ payments.

### 3. Hybrid RAG Scoring
$$\text{Score} = 0.60 \times \text{CosineSimilarity}(\vec{q}, \vec{d}) + 0.40 \times \text{KeywordScore}(\text{tokens}_q, \text{tokens}_d)$$

---

## 🛡️ Data Provenance & Groundedness

TRIPMATE AI strictly distinguishes between:
* `LIVE_VERIFIED`: Official records from verified government tourism portals (KSTDC, Forest Department, Horticulture Department).
* `ESTIMATED`: Calculated approximations clearly labeled in the UI.
* `DEMO_DATA`: Clearly marked pre-seeded records.

Hallucinations regarding live prices, room availability, and attraction timings are prohibited by architecture.

---

## 📄 License
MIT License. Crafted for Indian travelers and global roadtrippers.
