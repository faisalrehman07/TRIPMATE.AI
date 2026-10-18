import { NextResponse } from "next/server";
import { HybridRetrievalService } from "@/lib/services/HybridRetrievalService";
import { KnowledgeDocument } from "@/lib/types/rag";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "Mandalpatti peak off-road jeep";
  const destination = searchParams.get("destination") || undefined;
  const category = searchParams.get("category") || undefined;

  const results = HybridRetrievalService.retrieve({
    query,
    destination,
    category,
    topK: 5,
  });

  const diagnostics = HybridRetrievalService.getDiagnostics();

  return NextResponse.json({
    success: true,
    query,
    retrievedCount: results.length,
    results,
    diagnostics,
  });
}

export async function POST(request: Request) {
  try {
    const doc: KnowledgeDocument = await request.json();

    if (!doc.title || !doc.content || !doc.destination) {
      return NextResponse.json(
        { success: false, error: "Title, content, and destination are required" },
        { status: 400 }
      );
    }

    const { documentId, chunkCount } = HybridRetrievalService.ingestDocument(doc);

    return NextResponse.json({
      success: true,
      message: `Successfully ingested document with ${chunkCount} chunks into vector knowledge store`,
      documentId,
      chunkCount,
    });
  } catch (error) {
    console.error("RAG Ingestion Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to ingest document" },
      { status: 500 }
    );
  }
}
