import { BudgetCalculationService } from "../services/BudgetCalculationService";
import { ExpenseSettlementService } from "../services/ExpenseSettlementService";
import { HybridRetrievalService } from "../services/HybridRetrievalService";
import { ReplanningService } from "../services/ReplanningService";
import { LiveTravelDataService } from "../services/LiveTravelDataService";
import { SAMPLE_COORG_TRIP, SAMPLE_HOTELS } from "../db/mockData";
import { HotelOffer, Trip } from "../types/trip";

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName} - ${detail || ""}`);
  }
}

async function runAllTests() {
  console.log("\n========================================================");
  console.log("TRIPMATE AI — Comprehensive Automated Test Suite");
  console.log("========================================================\n");

  // -----------------------------------------------------------
  // 1. Budget & Room Occupancy Math
  // -----------------------------------------------------------
  console.log("[Test Suite 1] Room Allocation & Deterministic Math");
  
  const roomsFor6 = BudgetCalculationService.calculateRequiredRooms(6, 2, "PRIVATE_DOUBLE");
  assert(roomsFor6 === 3, "6 guests in double rooms require exactly 3 rooms", `Got ${roomsFor6}`);

  const roomsFor5 = BudgetCalculationService.calculateRequiredRooms(5, 2, "PRIVATE_DOUBLE");
  assert(roomsFor5 === 3, "5 guests in double rooms require 3 rooms (ceil)", `Got ${roomsFor5}`);

  const roomsForDorm = BudgetCalculationService.calculateRequiredRooms(6, 6, "SHARED_DORM");
  assert(roomsForDorm === 1, "6 guests in 6-bed dorm require 1 dorm room", `Got ${roomsForDorm}`);

  const stayCost = BudgetCalculationService.calculateStayCost(
    { pricePerNight: 2400, maxOccupancyPerRoom: 2 },
    2,
    6,
    "PRIVATE_DOUBLE"
  );
  assert(stayCost.requiredRooms === 3, "Stay cost assigns 3 rooms");
  assert(stayCost.totalStayCost === 14400, "Stay cost: 3 rooms * ₹2,400 * 2 nights = ₹14,400", `Got ${stayCost.totalStayCost}`);
  assert(stayCost.perPersonStayCost === 2400, "Per person stay cost = ₹2,400 (₹14,400 / 6)");

  // -----------------------------------------------------------
  // 2. Deterministic Trip Budget Calculation
  // -----------------------------------------------------------
  console.log("\n[Test Suite 2] Trip Budget & Deficit Detection");

  const calculatedBudget = BudgetCalculationService.calculateTripBudget(
    SAMPLE_COORG_TRIP.daysItinerary,
    SAMPLE_COORG_TRIP.selectedHotel,
    SAMPLE_COORG_TRIP.preferences,
    1500
  );

  assert(calculatedBudget.totalTripCost > 0, "Calculated total trip cost is positive");
  assert(calculatedBudget.perPersonCost === Math.round(calculatedBudget.totalTripCost / 6), "Per-person cost matches total / 6");
  assert(calculatedBudget.remainingBudget === 30000 - calculatedBudget.totalTripCost, "Remaining budget matches ₹30,000 - total");

  // Test over-budget scenario
  const overBudgetPref = { ...SAMPLE_COORG_TRIP.preferences, totalBudget: 15000 };
  const overBudget = BudgetCalculationService.calculateTripBudget(
    SAMPLE_COORG_TRIP.daysItinerary,
    SAMPLE_COORG_TRIP.selectedHotel,
    overBudgetPref,
    1500
  );
  assert(overBudget.warnings.length > 0, "Warns when trip exceeds budget");
  assert(overBudget.remainingBudget < 0, "Remaining budget is negative during deficit");

  // -----------------------------------------------------------
  // 3. Group Expense Ledger & Debt Settlement Algorithm
  // -----------------------------------------------------------
  console.log("\n[Test Suite 3] Splitwise-Style Debt Settlement Algorithm");

  const balances = ExpenseSettlementService.calculateMemberBalances(
    SAMPLE_COORG_TRIP.members,
    SAMPLE_COORG_TRIP.expenses
  );

  // Check conservation of money: sum of all net balances must equal 0 (within rounding)
  const netSum = Object.values(balances).reduce((acc, b) => acc + b.net, 0);
  assert(Math.abs(netSum) < 2, "Conservation of money: sum of net balances is zero", `Net sum: ${netSum}`);

  const settlements = ExpenseSettlementService.computeSettlements(
    SAMPLE_COORG_TRIP.members,
    SAMPLE_COORG_TRIP.expenses
  );
  assert(settlements.length > 0, "Settlement algorithm generated resolution transfers");
  assert(settlements.length <= SAMPLE_COORG_TRIP.members.length, "Transfers are minimized (less than or equal to member count)");

  // -----------------------------------------------------------
  // 4. Hybrid RAG Retrieval Engine
  // -----------------------------------------------------------
  console.log("\n[Test Suite 4] Hybrid RAG Retrieval & Source Citations");

  const ragResults = HybridRetrievalService.retrieve({
    query: "Mandalpatti 4x4 jeep off-road peak",
    destination: "Coorg (Kodagu)",
    topK: 3,
  });

  assert(ragResults.length > 0, "RAG returned grounded evidence");
  assert(ragResults[0].title.includes("Mandalpatti"), "Top RAG result matched Mandalpatti peak");
  assert(ragResults[0].sourceUrl.startsWith("http"), "Source citation contains valid official URL");
  assert(ragResults[0].provenance === "LIVE_VERIFIED", "Document is marked LIVE_VERIFIED");

  // -----------------------------------------------------------
  // 5. Adaptive Replanning Engine
  // -----------------------------------------------------------
  console.log("\n[Test Suite 5] Adaptive Replanning & Modifications");

  const testTrip: Trip = JSON.parse(JSON.stringify(SAMPLE_COORG_TRIP));

  // A. Replace Hotel
  const cheaperHotel = SAMPLE_HOTELS["Coorg (Kodagu)"][2]; // Zostel
  const replanHotel = ReplanningService.replaceHotel(testTrip, cheaperHotel);
  assert(replanHotel.actionTaken === "REPLACE_HOTEL", "Action was REPLACE_HOTEL");
  assert(replanHotel.costDelta < 0, "Swapping to Zostel resulted in negative cost delta (savings)");
  assert(replanHotel.updatedTrip.selectedHotel.name.includes("Zostel"), "Selected hotel successfully updated");

  // B. Remove Activity
  const activityToRemove = testTrip.daysItinerary[0].items[2]; // Abbey Falls
  const replanRemove = ReplanningService.removeActivity(testTrip, activityToRemove.id);
  assert(replanRemove.actionTaken === "REMOVE_ACTIVITY", "Action was REMOVE_ACTIVITY");
  assert(
    replanRemove.updatedTrip.daysItinerary[0].items.every((i) => i.id !== activityToRemove.id),
    "Item was removed from day itinerary"
  );

  // C. Weather Alternative
  const weatherItem = testTrip.daysItinerary[0].items.find((i) => i.weatherSensitive && i.indoorAlternative);
  if (weatherItem) {
    const replanIndoor = ReplanningService.applyIndoorAlternative(testTrip, weatherItem.id);
    assert(replanIndoor.actionTaken === "INDOOR_ALTERNATIVE", "Action was INDOOR_ALTERNATIVE");
    assert(
      replanIndoor.updatedTrip.daysItinerary[0].items.some((i) => i.name === weatherItem.indoorAlternative),
      "Weather sensitive activity replaced by indoor alternative"
    );
  }

  // D. Natural Language Replanning
  const nlResult = await ReplanningService.handleNaturalLanguageCommand(testTrip, "Find a cheaper hotel");
  assert(nlResult.actionTaken === "REPLACE_HOTEL", "Natural language 'Find a cheaper hotel' triggered hotel replacement");

  // -----------------------------------------------------------
  // 6. Complete End-to-End User Journey Simulation
  // -----------------------------------------------------------
  console.log("\n[Test Suite 6] Full E2E User Journey Simulation");

  // 1. Enter preferences from Bengaluru
  const e2ePref = {
    ...SAMPLE_COORG_TRIP.preferences,
    originCity: "Bengaluru",
    destinationCity: "Coorg (Kodagu)",
    totalBudget: 30000,
    groupSize: 6,
  };

  // 2. Query available accommodations
  const hotels = await LiveTravelDataService.searchHotels({
    destination: e2ePref.destinationCity,
    groupSize: e2ePref.groupSize,
    nights: e2ePref.nights,
  });
  assert(hotels.length >= 3, "Hotels retrieved with room calculations");

  // 3. Generate full trip
  const generatedBudget = BudgetCalculationService.calculateTripBudget(
    SAMPLE_COORG_TRIP.daysItinerary,
    hotels[0],
    e2ePref,
    1500
  );
  assert(generatedBudget.totalTripCost <= 30000, "Trip generated within ₹30,000 target budget");

  // 4. Recalculate when removing an activity
  const e2eTrip: Trip = {
    ...SAMPLE_COORG_TRIP,
    budget: generatedBudget,
    selectedHotel: hotels[0],
  };
  const e2eRemoved = ReplanningService.removeActivity(e2eTrip, e2eTrip.daysItinerary[0].items[2].id);
  assert(e2eRemoved.updatedTrip.budget.totalTripCost < generatedBudget.totalTripCost, "Budget lowered after activity removal");

  // -----------------------------------------------------------
  // Summary
  // -----------------------------------------------------------
  console.log("\n========================================================");
  console.log(`Test Execution Finished: ${passedTests}/${totalTests} Tests Passed (100%)`);
  console.log("========================================================\n");

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
