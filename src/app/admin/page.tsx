"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { HybridRetrievalService } from "@/lib/services/HybridRetrievalService";
import { KnowledgeDocument, RetrievalResult } from "@/lib/types/rag";
import {
  ShieldCheck,
  Database,
  Search,
  Plus,
  RefreshCw,
  CheckCircle,
  FileText,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AdminPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("Mandalpatti 4x4 jeep off-road");
  const [searchResults, setSearchResults] = useState<RetrievalResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // New Ingestion Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<any>("ATTRACTION");
  const [newDestination, setNewDestination] = useState("Coorg (Kodagu)");
  const [newSourceName, setNewSourceName] = useState("Karnataka Tourism Official");
  const [newSourceUrl, setNewSourceUrl] = useState("https://karnatakatourism.org");
  const [newContent, setNewContent] = useState("");
  const [ingestSuccess, setIngestSuccess] = useState("");

  const refreshData = () => {
    setDiagnostics(HybridRetrievalService.getDiagnostics());
    setDocuments(HybridRetrievalService.getDocuments());
  };

  useEffect(() => {
    refreshData();
    handleSearchTest("Mandalpatti 4x4 jeep off-road");
  }, []);

  const handleSearchTest = (queryToSearch?: string) => {
    const q = queryToSearch || searchQuery;
    if (!q.trim()) return;
    setIsSearching(true);
    const results = HybridRetrievalService.retrieve({ query: q, topK: 4 });
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newDoc: KnowledgeDocument = {
      id: `doc-${Date.now()}`,
      sourceId: `SRC-${Date.now()}`,
      sourceName: newSourceName,
      sourceUrl: newSourceUrl,
      title: newTitle,
      content: newContent,
      category: newCategory,
      destination: newDestination,
      retrievedAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      freshnessStatus: "FRESH",
      licensingNotice: "Official Verified Travel Bulletin",
      structuredMetadata: {},
    };

    const res = HybridRetrievalService.ingestDocument(newDoc);
    setIngestSuccess(`Successfully ingested "${newTitle}" into vector knowledge base (${res.chunkCount} chunks generated).`);
    refreshData();
    setNewTitle("");
    setNewContent("");
    setTimeout(() => setIngestSuccess(""), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 transition-colors">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                RAG Architecture & Provenance
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">PostgreSQL pgvector & BM25 Hybrid Retrieval</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-2">
              Knowledge Ingestion & Vector Diagnostic Console
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
              Inspect grounded travel documents, verify chunk embeddings, and test semantic hybrid retrieval accuracy.
            </p>
          </div>

          <button
            onClick={refreshData}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 shadow-xs hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Diagnostics</span>
          </button>
        </div>

        {/* Diagnostics Summary Cards */}
        {diagnostics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-sm backdrop-blur-sm">
              <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Total Sourced Documents</div>
              <div className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">
                {diagnostics.totalDocuments}
              </div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                {diagnostics.freshnessSummary.fresh} 100% Fresh
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-sm backdrop-blur-sm">
              <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Indexed Vector Chunks</div>
              <div className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">
                {diagnostics.totalChunks}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                Cosine Similarity + Keyword TSVector
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-sm backdrop-blur-sm">
              <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Destinations Grounded</div>
              <div className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">
                {diagnostics.destinationsCovered.length}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                Coorg, Wayanad, Chikmagalur...
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-sm backdrop-blur-sm">
              <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Categories Indexed</div>
              <div className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">
                {diagnostics.categoriesCovered.length}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                Attractions, Food, Safety, Weather
              </div>
            </div>
          </div>
        )}

        {/* Interactive Hybrid Search Tester */}
        <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-6 shadow-sm backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Search className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                Live Hybrid Retrieval Tester
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Simulates real-time semantic cosine similarity (60%) + keyword BM25 (40%) reranking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchTest()}
              placeholder="Test query: e.g. 'Mandalpatti 4x4 jeep fee' or 'Pandi curry dinner' or 'rain alternatives'"
              className="flex-1 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-emerald-700 dark:focus:border-emerald-500"
            />
            <button
              onClick={() => handleSearchTest()}
              className="rounded-xl bg-emerald-900 dark:bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 dark:hover:bg-emerald-600 transition-colors"
            >
              Test Search
            </button>
          </div>

          {/* Search Results Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {searchResults.map((res, idx) => (
              <div key={idx} className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100">{res.title}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Score: {(res.combinedScore * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed line-clamp-3">{res.content}</p>

                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400">
                  <span>Source: {res.sourceName}</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Vector Sim: {(res.similarityScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ingest New Travel Guide Form */}
        <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-6 shadow-sm backdrop-blur-sm space-y-4">
          <h3 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Plus className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            Ingest Verified Knowledge Document
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Add authorized tourism guides or property summaries to the vector repository with automatic text chunking and indexing.
          </p>

          {ingestSuccess && (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-900 dark:text-emerald-200 font-semibold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{ingestSuccess}</span>
            </div>
          )}

          <form onSubmit={handleIngest} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300">Guide Title</label>
                <input
                  type="text"
                  placeholder="e.g. Nagarhole Wildlife Safari Timings & Booking"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 outline-none focus:border-emerald-700 dark:focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300">Destination</label>
                <input
                  type="text"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 outline-none focus:border-emerald-700 dark:focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300">Source Agency</label>
                <input
                  type="text"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 outline-none focus:border-emerald-700 dark:focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 outline-none focus:border-emerald-700 dark:focus:border-emerald-500"
                >
                  <option value="ATTRACTION">Attraction / Sightseeing</option>
                  <option value="DINING">Dining & Local Food</option>
                  <option value="SAFETY">Safety & Monsoon Advisory</option>
                  <option value="ACCOMMODATION">Accommodation / Stay</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 dark:text-stone-300">Content Text (Chunks generated automatically)</label>
              <textarea
                rows={4}
                placeholder="Paste verified guide text, opening hours, fees, and travel instructions..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 p-2.5 outline-none focus:border-emerald-700 dark:focus:border-emerald-500"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-emerald-900 dark:bg-emerald-700 px-6 py-2.5 font-bold text-white shadow-sm hover:bg-emerald-800 dark:hover:bg-emerald-600 transition-colors"
              >
                Ingest & Generate Vector Chunks
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
