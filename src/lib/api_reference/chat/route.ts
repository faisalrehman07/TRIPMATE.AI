import { NextResponse } from "next/server";
import { HybridRetrievalService } from "@/lib/services/HybridRetrievalService";
import { ReplanningService } from "@/lib/services/ReplanningService";
import { Trip } from "@/lib/types/trip";

export async function POST(request: Request) {
  try {
    const { message, trip } = (await request.json()) as { message: string; trip: Trip };

    if (!message || !trip) {
      return NextResponse.json(
        { success: false, error: "Message and trip are required" },
        { status: 400 }
      );
    }

    const lower = message.toLowerCase();

    // Check for actionable replanning intents
    const isActionable =
      lower.includes("cheaper") ||
      lower.includes("hotel") ||
      lower.includes("resort") ||
      lower.includes("remove") ||
      lower.includes("waterfall") ||
      lower.includes("rain") ||
      lower.includes("indoor") ||
      lower.includes("cut budget");

    if (isActionable) {
      const replanResult = await ReplanningService.handleNaturalLanguageCommand(trip, message);
      return NextResponse.json({
        success: true,
        reply: replanResult.explanation,
        updatedTrip: replanResult.updatedTrip,
        actionTaken: replanResult.actionTaken,
        costDelta: replanResult.costDelta,
      });
    }

    // Contextual travel query using RAG hybrid search
    const retrieved = HybridRetrievalService.retrieve({
      query: message,
      destination: trip.destination,
      topK: 2,
    });

    if (retrieved.length > 0) {
      const topEvidence = retrieved[0];
      const reply = `According to verified travel data from **${topEvidence.sourceName}**:\n\n${topEvidence.content}\n\n*Source citation:* [Official Guide](${topEvidence.sourceUrl}) (Verified ${new Date(topEvidence.verifiedAt).toLocaleDateString("en-IN")}).`;

      return NextResponse.json({
        success: true,
        reply,
        citations: retrieved,
      });
    }

    // General helpful response grounded in the active trip
    return NextResponse.json({
      success: true,
      reply: `Your trip to **${trip.destination}** is currently scheduled for **${trip.days} days** with **${trip.preferences.groupSize} travelers**. Total estimated budget is **₹${trip.budget.totalTripCost.toLocaleString("en-IN")}** (limit: ₹${trip.budget.budgetLimit.toLocaleString("en-IN")}). Let me know if you would like to swap hotels, find cheaper alternatives, remove an activity, or prepare for weather changes!`,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process message" },
      { status: 500 }
    );
  }
}
