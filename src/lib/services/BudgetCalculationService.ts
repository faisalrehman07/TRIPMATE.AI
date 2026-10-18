import { BudgetSummary, HotelOffer, ItineraryDay, TripPreferences } from "../types/trip";

export class BudgetCalculationService {
  /**
   * Calculate required room count based on group size, occupancy, and room preference.
   * Example: 6 guests requiring private double rooms = 3 rooms.
   */
  static calculateRequiredRooms(
    groupSize: number,
    maxOccupancyPerRoom: number = 2,
    roomPreference: string = "PRIVATE_DOUBLE"
  ): number {
    if (groupSize <= 0) return 1;
    if (roomPreference === "WHOLE_VILLA") return 1;
    if (roomPreference === "SHARED_DORM") {
      // In a dorm, each person books a bed, but for whole room calculation:
      return Math.ceil(groupSize / Math.max(1, maxOccupancyPerRoom));
    }
    // Default private double rooms:
    const occupancy = Math.max(1, maxOccupancyPerRoom);
    return Math.ceil(groupSize / occupancy);
  }

  /**
   * Calculate deterministic total stay cost for an accommodation offer.
   */
  static calculateStayCost(
    hotel: { pricePerNight: number; maxOccupancyPerRoom?: number },
    totalNights: number,
    groupSize: number,
    roomPreference: string = "PRIVATE_DOUBLE"
  ): {
    requiredRooms: number;
    totalStayCost: number;
    perPersonStayCost: number;
  } {
    const requiredRooms = this.calculateRequiredRooms(
      groupSize,
      hotel.maxOccupancyPerRoom || 2,
      roomPreference
    );
    const totalStayCost = hotel.pricePerNight * requiredRooms * Math.max(1, totalNights);
    const perPersonStayCost = Math.round(totalStayCost / Math.max(1, groupSize));

    return {
      requiredRooms,
      totalStayCost,
      perPersonStayCost,
    };
  }

  /**
   * Deterministically calculate the full trip budget from days itinerary, selected stay, and travel preferences.
   * Zero LLM math — exact arithmetic.
   */
  static calculateTripBudget(
    days: ItineraryDay[],
    selectedHotel: HotelOffer | null,
    preferences: TripPreferences,
    contingencyReserve: number = 1500
  ): BudgetSummary {
    let intercityTransport = 0;
    let localTransport = 0;
    let food = 0;
    let activities = 0;
    let tickets = 0;
    let misc = 0;

    // Sum costs from itinerary items
    days.forEach((day) => {
      const hasTransportItem = day.items.some((i) => i.category === "TRANSPORT");
      if (!hasTransportItem && day.transportLegs) {
        day.transportLegs.forEach((leg) => {
          if (leg.from.toLowerCase().includes(preferences.originCity.toLowerCase()) ||
              leg.to.toLowerCase().includes(preferences.originCity.toLowerCase())) {
            intercityTransport += leg.cost;
          } else {
            localTransport += leg.cost;
          }
        });
      }

      // Items
      day.items.forEach((item) => {
        const cost = item.groupCost;
        switch (item.category) {
          case "TRANSPORT":
            if (item.name.toLowerCase().includes("highway") || item.name.toLowerCase().includes("expressway") || item.name.toLowerCase().includes("drive to") || item.name.toLowerCase().includes("return")) {
              intercityTransport += cost;
            } else {
              localTransport += cost;
            }
            break;
          case "MEAL":
            food += cost;
            break;
          case "ACTIVITY":
            activities += cost;
            break;
          case "SIGHTSEEING":
            tickets += cost;
            break;
          case "CHECK_IN":
          case "CHECK_OUT":
          case "REST":
            // Usually stay costs are tracked via selectedHotel
            break;
          default:
            misc += cost;
        }
      });
    });

    // Stay cost
    let accommodation = 0;
    if (selectedHotel) {
      const stayCalc = this.calculateStayCost(
        selectedHotel,
        preferences.nights,
        preferences.groupSize,
        preferences.roomPreference
      );
      accommodation = stayCalc.totalStayCost;
    }

    const totalTripCost =
      intercityTransport +
      localTransport +
      accommodation +
      food +
      activities +
      tickets +
      contingencyReserve +
      misc;

    const groupSize = Math.max(1, preferences.groupSize);
    const perPersonCost = Math.round(totalTripCost / groupSize);
    const budgetLimit = preferences.totalBudget;
    const remainingBudget = budgetLimit - totalTripCost;
    const utilizationPercent = Number(((totalTripCost / Math.max(1, budgetLimit)) * 100).toFixed(1));

    const warnings: string[] = [];
    if (totalTripCost > budgetLimit) {
      const deficit = totalTripCost - budgetLimit;
      const perPersonDeficit = Math.round(deficit / groupSize);
      warnings.push(
        `Trip budget exceeded by ₹${deficit.toLocaleString("en-IN")} (₹${perPersonDeficit.toLocaleString("en-IN")}/person). Consider switching to a budget hotel or removing premium activities.`
      );
    } else if (utilizationPercent > 90) {
      warnings.push("Budget utilization is above 90%. Tight margin for unexpected expenses.");
    }

    const costSavingTips: string[] = [];
    if (accommodation > totalTripCost * 0.45) {
      costSavingTips.push("Accommodation accounts for >45% of total budget. Choosing a homestay or hostel could save up to 40% on stays.");
    }
    if (intercityTransport > totalTripCost * 0.3) {
      costSavingTips.push("Car rental & tolls are a major portion. Carpooling or booking a group traveler bus can lower per-person transit cost.");
    }

    return {
      totalTripCost,
      perPersonCost,
      budgetLimit,
      remainingBudget,
      utilizationPercent,
      contingencyReserve,
      categories: {
        intercityTransport,
        localTransport,
        accommodation,
        food,
        activities,
        tickets,
        contingency: contingencyReserve,
        misc,
      },
      warnings,
      costSavingTips,
    };
  }
}
