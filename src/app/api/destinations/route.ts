import { NextResponse } from "next/server";
import { SAMPLE_DESTINATIONS } from "@/lib/db/mockData";
import { TripPreferences } from "@/lib/types/trip";

export async function GET() {
  return NextResponse.json({
    success: true,
    destinations: SAMPLE_DESTINATIONS,
  });
}

export async function POST(request: Request) {
  try {
    let preferences: Partial<TripPreferences> = {};
    try {
      preferences = await request.json();
    } catch {
      preferences = {};
    }

    const origin = preferences.originCity || "Bengaluru";
    const budget = preferences.totalBudget || 30000;
    const groupSize = preferences.groupSize || 6;
    const userVibes = preferences.vibes || ["Adventure", "Scenic Places"];

    // Score destinations against constraints
    const ranked = SAMPLE_DESTINATIONS.map((dest) => {
      let score = 70;

      // Vibe overlap
      const vibeMatches = dest.topVibes.filter((v) =>
        userVibes.some((uv) => uv.toLowerCase() === v.toLowerCase())
      ).length;
      score += vibeMatches * 6;

      // Budget check
      const perPersonBudget = budget / groupSize;
      if (dest.estimatedCostPerPerson <= perPersonBudget) {
        score += 15;
      } else if (dest.estimatedCostPerPerson <= perPersonBudget * 1.15) {
        score += 5;
      } else {
        score -= 20;
      }

      // Distance feasibility
      if (origin.toLowerCase().includes("bengaluru") && dest.state === "Karnataka") {
        score += 5;
      }

      return {
        ...dest,
        matchScore: Math.min(99, Math.max(50, score)),
      };
    });

    ranked.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      destinations: ranked,
      origin,
      budget,
      groupSize,
    });
  } catch (error) {
    console.error("Destination discovery error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate destinations" },
      { status: 500 }
    );
  }
}
