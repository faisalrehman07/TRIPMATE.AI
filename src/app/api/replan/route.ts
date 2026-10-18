import { NextResponse } from "next/server";
import { ReplanningService } from "@/lib/services/ReplanningService";
import { HotelOffer, Trip } from "@/lib/types/trip";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trip, action, payload } = body as {
      trip: Trip;
      action: "REPLACE_HOTEL" | "REMOVE_ACTIVITY" | "INDOOR_ALTERNATIVE" | "NATURAL_LANGUAGE";
      payload: any;
    };

    if (!trip) {
      return NextResponse.json({ success: false, error: "Trip object is required" }, { status: 400 });
    }

    let result;

    switch (action) {
      case "REPLACE_HOTEL":
        result = ReplanningService.replaceHotel(trip, payload as HotelOffer);
        break;
      case "REMOVE_ACTIVITY":
        result = ReplanningService.removeActivity(trip, payload.itemId as string);
        break;
      case "INDOOR_ALTERNATIVE":
        result = ReplanningService.applyIndoorAlternative(trip, payload.itemId as string);
        break;
      case "NATURAL_LANGUAGE":
        result = await ReplanningService.handleNaturalLanguageCommand(trip, payload.command as string);
        break;
      default:
        return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Replanning error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to replan trip" },
      { status: 500 }
    );
  }
}
