import { ProvenanceType } from "./trip";

export interface KnowledgeDocument {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  content: string;
  category: "ATTRACTION" | "ACCOMMODATION" | "DINING" | "PRACTICAL_TIPS" | "SAFETY" | "WEATHER" | "CULTURE";
  destination: string;
  coordinates?: [number, number];
  providerReference?: string;
  retrievedAt: string;
  verifiedAt: string;
  freshnessStatus: "FRESH" | "EXPIRING_SOON" | "STALE";
  licensingNotice: string;
  structuredMetadata: {
    openingHours?: string;
    ticketPriceInr?: number;
    recommendedDurationMinutes?: number;
    bestTimeToVisit?: string;
    crowdLevel?: "LOW" | "MODERATE" | "HIGH";
    accessibilityFeatures?: string[];
    seasonalNotes?: string;
  };
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  title: string;
  category: string;
  destination: string;
  coordinates?: [number, number];
  sourceUrl: string;
  sourceName: string;
  verifiedAt: string;
  embedding?: number[];
  keywordTokens: string[];
}

export interface RetrievalResult {
  chunkId: string;
  documentId: string;
  title: string;
  content: string;
  category: string;
  destination: string;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  similarityScore: number;
  keywordScore: number;
  combinedScore: number;
  provenance: ProvenanceType;
}

export interface RAGEvaluationTest {
  id: string;
  query: string;
  destination: string;
  expectedCategory: string;
  retrievedCount: number;
  topScore: number;
  groundedClaimsValid: boolean;
  latencyMs: number;
  status: "PASSED" | "FAILED" | "WARN";
}
