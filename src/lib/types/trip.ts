export type ProvenanceType =
  | "LIVE_VERIFIED"
  | "PROVIDER_RETURNED"
  | "CACHED"
  | "ESTIMATED"
  | "DEMO_DATA"
  | "UNAVAILABLE";

export type GroupProfileType =
  | "SOLO"
  | "BOYS_TRIP"
  | "GIRLS_TRIP"
  | "COUPLES"
  | "FAMILY"
  | "FRIENDS"
  | "MIXED"
  | "CORPORATE"
  | "SENIORS"
  | "CUSTOM";

export type TravelPace = "RELAXED" | "BALANCED" | "PACKED";

export type AccommodationType =
  | "HOSTEL"
  | "BUDGET_HOTEL"
  | "STANDARD_HOTEL"
  | "PREMIUM_HOTEL"
  | "RESORT"
  | "HOMESTAY"
  | "VILLA"
  | "CAMPSITE"
  | "ANY";

export type TransportType =
  | "PERSONAL_VEHICLE"
  | "RENTAL_CAR"
  | "BIKE"
  | "BUS"
  | "TRAIN"
  | "FLIGHT"
  | "TAXI"
  | "PUBLIC"
  | "COMBINATION";

export interface TripPreferences {
  originCity: string;
  destinationCity: string; // Specific or "AI_RECOMMENDED"
  startDate: string;
  endDate: string;
  days: number;
  nights: number;
  totalBudget: number;
  perPersonBudget?: number;
  currency: "INR" | "USD" | "EUR";
  includeOriginTravelCost: boolean;
  groupProfile: GroupProfileType;
  groupSize: number;
  roomPreference: "PRIVATE_DOUBLE" | "SHARED_DORM" | "WHOLE_VILLA" | "ANY";
  vibes: string[];
  pace: TravelPace;
  preferredStartTime: string;
  walkingIntensity: "LOW" | "MODERATE" | "HIGH";
  accommodationType: AccommodationType;
  preferredAmenities: string[];
  transportPreference: TransportType;
  transportPriority: "LOWEST_COST" | "COMFORT" | "CONVENIENCE" | "SPEED";
  dietary: string[];
  mustVisitPlaces: string[];
  avoidActivities: string[];
  friendNames?: string[];
  activities?: string[];
  travelStyle?: string;
  departureTime?: string; // e.g. "06:00" or "EARLY_MORNING"
  returnTime?: string; // e.g. "17:00" or "EVENING"
  customNotes?: string;
}

export interface ItineraryItem {
  id: string;
  name: string;
  description: string;
  category: "ACTIVITY" | "MEAL" | "TRANSPORT" | "REST" | "CHECK_IN" | "CHECK_OUT" | "SIGHTSEEING";
  timeSlot: "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";
  startTime: string; // e.g. "09:30"
  endTime: string;   // e.g. "12:00"
  durationMinutes: number;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  individualCost: number;
  groupCost: number;
  isApproved: boolean;
  isLocked?: boolean;
  source: string;
  sourceUrl?: string;
  provenance: ProvenanceType;
  verifiedAt?: string;
  bookingUrl?: string;
  weatherSensitive?: boolean;
  indoorAlternative?: string;
  walkingIntensity?: "LOW" | "MODERATE" | "HIGH";
  wheelchairAccessible?: boolean;
  votesCount?: number;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  summary: string;
  items: ItineraryItem[];
  transportLegs?: {
    from: string;
    to: string;
    mode: string;
    durationMinutes: number;
    distanceKm: number;
    cost: number;
    provenance: ProvenanceType;
  }[];
}

export interface HotelOffer {
  id: string;
  name: string;
  type: string;
  address: string;
  destination: string;
  coordinates: [number, number];
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  maxOccupancyPerRoom: number;
  requiredRooms: number;
  totalNights: number;
  totalStayCost: number;
  perPersonStayCost: number;
  amenities: string[];
  mealIncluded: boolean;
  cancellationPolicy: string;
  image: string;
  bookingUrl: string;
  provenance: ProvenanceType;
  verifiedAt: string;
  distanceToActivitiesKm?: number;
}

export interface BudgetCategoryBreakdown {
  intercityTransport: number;
  localTransport: number;
  accommodation: number;
  food: number;
  activities: number;
  tickets: number;
  contingency: number;
  misc: number;
}

export interface BudgetSummary {
  totalTripCost: number;
  perPersonCost: number;
  budgetLimit: number;
  remainingBudget: number;
  utilizationPercent: number;
  contingencyReserve: number;
  categories: BudgetCategoryBreakdown;
  warnings: string[];
  costSavingTips: string[];
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "OWNER" | "MEMBER";
  joinedAt: string;
  paidAmount: number;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  amount: number;
  category: "TRANSPORT" | "STAY" | "FOOD" | "ACTIVITY" | "MISC";
  payerId: string;
  payerName: string;
  date: string;
  splitMode: "EQUAL" | "CUSTOM";
  allocations: {
    memberId: string;
    memberName: string;
    amount: number;
  }[];
}

export interface ExpenseSettlement {
  debtorId: string;
  debtorName: string;
  creditorId: string;
  creditorName: string;
  amount: number;
}

export interface DestinationCandidate {
  id: string;
  name: string;
  tagline: string;
  state: string;
  country: string;
  image: string;
  matchScore: number;
  matchReasons: string[];
  idealDurationDays: number;
  estimatedCostPerPerson: number;
  estimatedGroupCost: number;
  travelTimeFromOrigin: string;
  primaryTransportMode: string;
  topVibes: string[];
  weatherForecast: {
    temp: string;
    condition: string;
    rainProbability: number;
    advisory?: string;
  };
  sampleAttractions: string[];
  sampleHotels: string[];
  budgetSuitability: "WELL_WITHIN" | "BALANCED" | "STRETCH";
  provenance: ProvenanceType;
}

export interface ScenarioSimulation {
  id: string;
  title: string;
  description: string;
  extraDays: number;
  extraFriends: number;
  stayUpgradeTier: "CURRENT" | "BUDGET" | "RESORT" | "LUXURY";
  transportChange: "KEEP" | "CHEAPEST" | "FASTEST";
  simulatedBudget: BudgetSummary;
  differences: {
    totalCostDelta: number;
    perPersonCostDelta: number;
    comment: string;
  };
}

export interface TripHistoryEntry {
  id: string;
  timestamp: string;
  description: string;
  affectedItemIds?: string[];
}

export interface Trip {
  id: string;
  title: string;
  tagline: string;
  destination: string;
  originCity: string;
  startDate: string;
  endDate: string;
  days: number;
  nights: number;
  groupSize: number;
  preferences: TripPreferences;
  daysItinerary: ItineraryDay[];
  selectedHotel: HotelOffer;
  budget: BudgetSummary;
  expenses: ExpenseRecord[];
  members: GroupMember[];
  scenarios: ScenarioSimulation[];
  history: TripHistoryEntry[];
  isDemo: boolean;
  updatedAt: string;
  createdAt: string;
}
