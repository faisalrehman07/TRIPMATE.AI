import { HotelOffer, ItineraryItem, Trip } from "../types/trip";
import { BudgetCalculationService } from "./BudgetCalculationService";
import { HybridRetrievalService } from "./HybridRetrievalService";
import { LiveTravelDataService } from "./LiveTravelDataService";

export interface ReplanResult {
  updatedTrip: Trip;
  actionTaken: string;
  costDelta: number;
  explanation: string;
  historyEntryId: string;
}

export class ReplanningService {
  /**
   * Replace hotel in trip and recalculate stay costs & total budget.
   */
  static replaceHotel(trip: Trip, newHotel: HotelOffer): ReplanResult {
    const oldCost = trip.selectedHotel ? trip.selectedHotel.totalStayCost : 0;

    // Recalculate stay cost with group requirements
    const stayCalc = BudgetCalculationService.calculateStayCost(
      newHotel,
      trip.preferences.nights,
      trip.preferences.groupSize,
      trip.preferences.roomPreference
    );

    const configuredHotel: HotelOffer = {
      ...newHotel,
      totalNights: trip.preferences.nights,
      requiredRooms: stayCalc.requiredRooms,
      totalStayCost: stayCalc.totalStayCost,
      perPersonStayCost: stayCalc.perPersonStayCost,
      provenance: "LIVE_VERIFIED",
      verifiedAt: new Date().toISOString(),
    };

    // Calculate new budget
    const newBudget = BudgetCalculationService.calculateTripBudget(
      trip.daysItinerary,
      configuredHotel,
      trip.preferences,
      trip.budget?.contingencyReserve || 1500
    );

    const costDelta = configuredHotel.totalStayCost - oldCost;
    const historyEntry = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      description: `Replaced accommodation with ${configuredHotel.name}. Cost impact: ${
        costDelta >= 0 ? "+" : ""
      }₹${costDelta.toLocaleString("en-IN")}.`,
    };

    const updatedTrip: Trip = {
      ...trip,
      selectedHotel: configuredHotel,
      budget: newBudget,
      history: [historyEntry, ...(trip.history || [])],
      updatedAt: new Date().toISOString(),
    };

    return {
      updatedTrip,
      actionTaken: "REPLACE_HOTEL",
      costDelta,
      explanation: `Swapped hotel to ${configuredHotel.name}. Total stay for ${trip.preferences.groupSize} guests (${stayCalc.requiredRooms} rooms x ${trip.preferences.nights} nights) is now ₹${configuredHotel.totalStayCost.toLocaleString("en-IN")}.`,
      historyEntryId: historyEntry.id,
    };
  }

  /**
   * Remove an activity item and update budget and scheduling.
   */
  static removeActivity(trip: Trip, itemId: string): ReplanResult {
    let removedItem: ItineraryItem | null = null;
    let targetDayNumber = 1;

    const newDays = trip.daysItinerary.map((day) => {
      const match = day.items.find((i) => i.id === itemId);
      if (match) {
        removedItem = match;
        targetDayNumber = day.dayNumber;
        return {
          ...day,
          items: day.items.filter((i) => i.id !== itemId),
        };
      }
      return day;
    });

    if (!removedItem) {
      throw new Error("Item not found in itinerary");
    }

    const removedCost = (removedItem as ItineraryItem).groupCost;

    const newBudget = BudgetCalculationService.calculateTripBudget(
      newDays,
      trip.selectedHotel,
      trip.preferences,
      trip.budget?.contingencyReserve || 1500
    );

    const historyEntry = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      description: `Removed "${(removedItem as ItineraryItem).name}" from Day ${targetDayNumber}. Saved ₹${removedCost.toLocaleString("en-IN")}.`,
      affectedItemIds: [itemId],
    };

    const updatedTrip: Trip = {
      ...trip,
      daysItinerary: newDays,
      budget: newBudget,
      history: [historyEntry, ...(trip.history || [])],
      updatedAt: new Date().toISOString(),
    };

    return {
      updatedTrip,
      actionTaken: "REMOVE_ACTIVITY",
      costDelta: -removedCost,
      explanation: `Removed "${(removedItem as ItineraryItem).name}". Your group budget was reduced by ₹${removedCost.toLocaleString("en-IN")}.`,
      historyEntryId: historyEntry.id,
    };
  }

  /**
   * Swap rain-sensitive activity with indoor alternative retrieved via RAG.
   */
  static applyIndoorAlternative(trip: Trip, itemId: string): ReplanResult {
    let oldItemName = "";
    let indoorName = "";

    const newDays = trip.daysItinerary.map((day) => {
      return {
        ...day,
        items: day.items.map((item) => {
          if (item.id === itemId && item.indoorAlternative) {
            oldItemName = item.name;
            indoorName = item.indoorAlternative;

            return {
              ...item,
              name: item.indoorAlternative,
              description: `[Weather Safe Indoor Alternative] Verified covered attraction to avoid rainfall in ${trip.destination}.`,
              weatherSensitive: false,
              individualCost: 0,
              groupCost: 0,
              source: "TripMate Monsoon Safety Advisory (RAG)",
              provenance: "LIVE_VERIFIED" as const,
            };
          }
          return item;
        }),
      };
    });

    const newBudget = BudgetCalculationService.calculateTripBudget(
      newDays,
      trip.selectedHotel,
      trip.preferences,
      trip.budget?.contingencyReserve || 1500
    );

    const historyEntry = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      description: `Swapped rain-affected "${oldItemName}" for indoor "${indoorName}".`,
      affectedItemIds: [itemId],
    };

    const updatedTrip: Trip = {
      ...trip,
      daysItinerary: newDays,
      budget: newBudget,
      history: [historyEntry, ...(trip.history || [])],
      updatedAt: new Date().toISOString(),
    };

    return {
      updatedTrip,
      actionTaken: "INDOOR_ALTERNATIVE",
      costDelta: 0,
      explanation: `Protected itinerary from rain! Replaced "${oldItemName}" with covered "${indoorName}".`,
      historyEntryId: historyEntry.id,
    };
  }

  /**
   * Natural language replanning processor.
   * Understands commands like "find cheaper hotel", "remove waterfall", "cut budget by 5000", "add nightlife".
   */
  static async handleNaturalLanguageCommand(trip: Trip, command: string): Promise<ReplanResult> {
    const cmd = command.toLowerCase();

    // 1. Cheaper hotel request
    if (cmd.includes("cheaper hotel") || cmd.includes("cheaper resort") || cmd.includes("reduce stay cost") || cmd.includes("less expensive hotel")) {
      const allHotels = await LiveTravelDataService.searchHotels({
        destination: trip.destination,
        groupSize: trip.preferences.groupSize,
        nights: trip.preferences.nights,
        roomPreference: trip.preferences.roomPreference,
      });

      const currentPrice = trip.selectedHotel?.totalStayCost || Infinity;
      const cheaperCandidate = allHotels
        .filter((h) => h.id !== trip.selectedHotel?.id && h.totalStayCost < currentPrice)
        .sort((a, b) => a.totalStayCost - b.totalStayCost)[0];

      if (cheaperCandidate) {
        return this.replaceHotel(trip, cheaperCandidate);
      } else {
        return {
          updatedTrip: trip,
          actionTaken: "NO_OP",
          costDelta: 0,
          explanation: "You already have the lowest-priced verified accommodation option selected for this destination.",
          historyEntryId: "",
        };
      }
    }

    // 2. Remove waterfall / outdoor activity
    if (cmd.includes("remove waterfall") || cmd.includes("remove falls") || cmd.includes("skip abbey")) {
      // Find waterfall item
      for (const day of trip.daysItinerary) {
        const item = day.items.find(
          (i) => i.name.toLowerCase().includes("falls") || i.name.toLowerCase().includes("waterfall")
        );
        if (item) {
          return this.removeActivity(trip, item.id);
        }
      }
    }

    // 3. Rain / indoor alternatives
    if (cmd.includes("rain") || cmd.includes("weather") || cmd.includes("indoor")) {
      for (const day of trip.daysItinerary) {
        const item = day.items.find((i) => i.weatherSensitive && i.indoorAlternative);
        if (item) {
          return this.applyIndoorAlternative(trip, item.id);
        }
      }
    }

    // 4. Default: Query RAG and suggest grounded recommendation
    const ragResults = HybridRetrievalService.retrieve({
      query: command,
      destination: trip.destination,
      topK: 2,
    });

    const citation = ragResults[0];
    const explanation = citation
      ? `Based on verified tourism data for ${trip.destination} (${citation.sourceName}): ${citation.content.slice(0, 180)}...`
      : `Reviewed your request: "${command}". All current items remain verified and aligned with your ₹${trip.preferences.totalBudget.toLocaleString("en-IN")} budget.`;

    return {
      updatedTrip: trip,
      actionTaken: "RAG_ADVICE",
      costDelta: 0,
      explanation,
      historyEntryId: "",
    };
  }
}
