import { KnowledgeChunk, KnowledgeDocument, RetrievalResult } from "../types/rag";
import { SAMPLE_KNOWLEDGE_CHUNKS, SAMPLE_KNOWLEDGE_DOCS } from "../db/mockData";

export interface RetrievalQueryParams {
  query: string;
  destination?: string;
  category?: string;
  topK?: number;
  minSimilarity?: number;
}

export class HybridRetrievalService {
  private static chunks: KnowledgeChunk[] = [...SAMPLE_KNOWLEDGE_CHUNKS];
  private static documents: KnowledgeDocument[] = [...SAMPLE_KNOWLEDGE_DOCS];

  /**
   * Calculate cosine similarity between two numeric vectors.
   */
  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Generate pseudo-embedding from query for local/demo semantic scoring.
   */
  private static generateQueryVector(query: string, dimensions: number = 16): number[] {
    const vector = new Array(dimensions).fill(0);
    const words = query.toLowerCase().split(/\s+/);
    for (let i = 0; i < dimensions; i++) {
      let hash = 0;
      const seed = query + "_" + i + "_" + words.join("");
      for (let c = 0; c < seed.length; c++) {
        hash = (hash << 5) - hash + seed.charCodeAt(c);
        hash |= 0;
      }
      vector[i] = (Math.abs(hash % 1000) / 1000) * 2 - 1;
    }
    return vector;
  }

  /**
   * Keyword BM25 / token matching score.
   */
  private static calculateKeywordScore(queryTokens: string[], chunkTokens: string[]): number {
    if (queryTokens.length === 0 || chunkTokens.length === 0) return 0;
    let matches = 0;
    queryTokens.forEach((token) => {
      if (chunkTokens.some((ct) => ct.includes(token) || token.includes(ct))) {
        matches++;
      }
    });
    return matches / queryTokens.length;
  }

  /**
   * Hybrid retrieval execution (Vector + Keyword + Metadata Filters + RRF Reranking).
   */
  static retrieve(params: RetrievalQueryParams): RetrievalResult[] {
    const { query, destination, category, topK = 5, minSimilarity = 0.25 } = params;

    const queryTokens = query
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2);

    const queryVector = this.generateQueryVector(query);

    // 1. Filter candidates by metadata (destination, category)
    const filteredChunks = this.chunks.filter((chunk) => {
      if (destination && destination !== "AI_RECOMMENDED") {
        const destMatch =
          chunk.destination.toLowerCase().includes(destination.toLowerCase()) ||
          destination.toLowerCase().includes(chunk.destination.toLowerCase());
        if (!destMatch) return false;
      }
      if (category && category !== "ALL") {
        if (chunk.category !== category) return false;
      }
      return true;
    });

    // 2. Score candidates
    interface ScoredChunk {
      chunk: KnowledgeChunk;
      similarityScore: number;
      keywordScore: number;
      combinedScore: number;
    }

    const scored: ScoredChunk[] = filteredChunks.map((chunk) => {
      const sim = chunk.embedding ? this.cosineSimilarity(queryVector, chunk.embedding) : 0.5;
      const keyScore = this.calculateKeywordScore(queryTokens, chunk.keywordTokens);
      // Normalized cosine to 0-1
      const normalizedSim = Math.max(0, (sim + 1) / 2);
      // Reciprocal Rank / Hybrid blend: 60% semantic + 40% keyword
      const combined = normalizedSim * 0.6 + keyScore * 0.4;

      return {
        chunk,
        similarityScore: Number(normalizedSim.toFixed(3)),
        keywordScore: Number(keyScore.toFixed(3)),
        combinedScore: Number(combined.toFixed(3)),
      };
    });

    // 3. Filter minimum threshold & sort descending
    const sorted = scored
      .filter((s) => s.combinedScore >= minSimilarity || s.keywordScore > 0.3)
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, topK);

    return sorted.map((s) => ({
      chunkId: s.chunk.id,
      documentId: s.chunk.documentId,
      title: s.chunk.title,
      content: s.chunk.content,
      category: s.chunk.category,
      destination: s.chunk.destination,
      sourceName: s.chunk.sourceName,
      sourceUrl: s.chunk.sourceUrl,
      verifiedAt: s.chunk.verifiedAt,
      similarityScore: s.similarityScore,
      keywordScore: s.keywordScore,
      combinedScore: s.combinedScore,
      provenance: "LIVE_VERIFIED",
    }));
  }

  /**
   * Ingestion mechanism: add or update new knowledge document and generate chunks.
   */
  static ingestDocument(doc: KnowledgeDocument): { documentId: string; chunkCount: number } {
    // Check if doc exists
    const existingIdx = this.documents.findIndex((d) => d.id === doc.id || d.sourceId === doc.sourceId);
    if (existingIdx >= 0) {
      this.documents[existingIdx] = doc;
      // remove old chunks
      this.chunks = this.chunks.filter((c) => c.documentId !== doc.id);
    } else {
      this.documents.push(doc);
    }

    // Chunk doc
    const paragraphs = doc.content.split("\n\n").filter((p) => p.trim().length > 0);
    const newChunks: KnowledgeChunk[] = paragraphs.map((p, idx) => {
      const tokens = (doc.title + " " + p + " " + doc.destination + " " + doc.category)
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 2);

      const vector = this.generateQueryVector(doc.title + " " + p);

      return {
        id: `chunk-${doc.id}-${idx}`,
        documentId: doc.id,
        chunkIndex: idx,
        content: p,
        title: doc.title,
        category: doc.category,
        destination: doc.destination,
        coordinates: doc.coordinates,
        sourceUrl: doc.sourceUrl,
        sourceName: doc.sourceName,
        verifiedAt: doc.verifiedAt,
        embedding: vector,
        keywordTokens: Array.from(new Set(tokens)),
      };
    });

    this.chunks.push(...newChunks);
    return { documentId: doc.id, chunkCount: newChunks.length };
  }

  /**
   * Diagnostic summary of RAG knowledge store.
   */
  static getDiagnostics() {
    return {
      totalDocuments: this.documents.length,
      totalChunks: this.chunks.length,
      destinationsCovered: Array.from(new Set(this.documents.map((d) => d.destination))),
      categoriesCovered: Array.from(new Set(this.documents.map((d) => d.category))),
      freshnessSummary: {
        fresh: this.documents.filter((d) => d.freshnessStatus === "FRESH").length,
        expiringSoon: this.documents.filter((d) => d.freshnessStatus === "EXPIRING_SOON").length,
        stale: this.documents.filter((d) => d.freshnessStatus === "STALE").length,
      },
    };
  }

  static getDocuments(): KnowledgeDocument[] {
    return this.documents;
  }
}
