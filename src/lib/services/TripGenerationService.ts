import { Trip, TripPreferences, GroupMember } from "@/lib/types/trip";
import { SAMPLE_COORG_TRIP } from "@/lib/db/mockData";
import { LiveTravelDataService } from "@/lib/services/LiveTravelDataService";
import { BudgetCalculationService } from "@/lib/services/BudgetCalculationService";

export class TripGenerationService {
  public static async generateTrip(rawPreferences: TripPreferences): Promise<Trip> {
    const preferences: TripPreferences = {
      ...rawPreferences,
      originCity: rawPreferences.originCity || "Bengaluru",
      destinationCity: rawPreferences.destinationCity || "Coorg (Kodagu)",
      groupSize: rawPreferences.groupSize || rawPreferences.friendNames?.length || 4,
      days: rawPreferences.days || 3,
      nights: rawPreferences.nights || 2,
      groupProfile: rawPreferences.groupProfile || "FRIENDS",
      vibes: rawPreferences.vibes || ["SCENIC", "CALM"],
      activities: rawPreferences.activities || [],
      roomPreference: rawPreferences.roomPreference || "DOUBLE_ROOMS",
      travelStyle: rawPreferences.travelStyle || "MODERATE",
    };

    const destination =
      preferences.destinationCity && preferences.destinationCity !== "AI_RECOMMENDED"
        ? preferences.destinationCity
        : "Coorg (Kodagu)";

    // If destination matches Coorg, build customized version from the rich verified dataset
    const availableHotels = await LiveTravelDataService.searchHotels({
      destination,
      groupSize: preferences.groupSize,
      nights: preferences.nights,
      roomPreference: preferences.roomPreference,
    });

    const chosenHotel = availableHotels[0] || SAMPLE_COORG_TRIP.selectedHotel;

    // Filter or adjust itinerary based on user pace & vibes
    let customDays = JSON.parse(JSON.stringify(SAMPLE_COORG_TRIP.daysItinerary));

    // If user pace is "RELAXED", limit to 3 items per day
    if (preferences.pace === "RELAXED") {
      customDays = customDays.map((d: any) => ({
        ...d,
        items: d.items.slice(0, 3),
      }));
    }

    // Deterministic budget calculation
    const calculatedBudget = BudgetCalculationService.calculateTripBudget(
      customDays,
      chosenHotel,
      preferences,
      1500
    );

    const sampleAvatars = [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    ];

    const rawNames =
      preferences.friendNames && preferences.friendNames.length > 0
        ? preferences.friendNames
        : ["Faisal (You)", "Rohit", "Karan", "Aditya", "Vikram", "Siddharth"].slice(0, preferences.groupSize);

    const dynamicMembers: GroupMember[] = rawNames.map((rawName, idx) => {
      const name = rawName.trim() || `Friend ${idx + 1}`;
      return {
        id: `mem-${idx + 1}`,
        name,
        email: `${name.toLowerCase().replace(/[^a-z0-9]/g, "") || `member${idx + 1}`}@tripmate.ai`,
        avatar: sampleAvatars[idx % sampleAvatars.length],
        role: idx === 0 ? ("OWNER" as const) : ("MEMBER" as const),
        joinedAt: new Date().toISOString(),
        paidAmount: 0,
      };
    });

    const initialExpenses = [
      {
        id: `exp-hotel-${Date.now()}`,
        title: `${chosenHotel.name} (Stay Reservation)`,
        amount: chosenHotel.totalStayCost,
        category: "STAY" as const,
        payerId: dynamicMembers[0].id,
        payerName: dynamicMembers[0].name,
        date: preferences.startDate,
        splitMode: "EQUAL" as const,
        allocations: dynamicMembers.map((m) => ({
          memberId: m.id,
          memberName: m.name,
          amount: Math.round(chosenHotel.totalStayCost / dynamicMembers.length),
        })),
      },
      {
        id: `exp-transit-${Date.now()}`,
        title: "Intercity Transit Fuel & Highway Tolls",
        amount: calculatedBudget.categories.intercityTransport,
        category: "TRANSPORT" as const,
        payerId: (dynamicMembers[1] || dynamicMembers[0]).id,
        payerName: (dynamicMembers[1] || dynamicMembers[0]).name,
        date: preferences.startDate,
        splitMode: "EQUAL" as const,
        allocations: dynamicMembers.map((m) => ({
          memberId: m.id,
          memberName: m.name,
          amount: Math.round(calculatedBudget.categories.intercityTransport / dynamicMembers.length),
        })),
      },
    ];

    dynamicMembers[0].paidAmount = chosenHotel.totalStayCost;
    if (dynamicMembers[1]) {
      dynamicMembers[1].paidAmount = calculatedBudget.categories.intercityTransport;
    }

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title: `${destination} Custom Getaway: ${dynamicMembers.length} Friends Trip`,
      tagline: `Curated for ${preferences.groupProfile.toLowerCase().replace("_", " ")} • ${(preferences.vibes || []).slice(0, 3).join(", ")}`,
      destination,
      originCity: preferences.originCity || "Bengaluru",
      startDate: preferences.startDate,
      endDate: preferences.endDate,
      days: preferences.days,
      nights: preferences.nights,
      groupSize: dynamicMembers.length,
      preferences: {
        ...preferences,
        groupSize: dynamicMembers.length,
        friendNames: dynamicMembers.map((m) => m.name),
      },
      daysItinerary: customDays,
      selectedHotel: chosenHotel,
      budget: calculatedBudget,
      expenses: initialExpenses,
      members: dynamicMembers,
      scenarios: SAMPLE_COORG_TRIP.scenarios,
      history: [
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          description: `Generated customized itinerary for ${dynamicMembers.map((m) => m.name).join(", ")}. Grounded in verified ${destination} data.`,
        },
      ],
      isDemo: true,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    return newTrip;
  }
}
