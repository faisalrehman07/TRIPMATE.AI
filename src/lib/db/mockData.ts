import { DestinationCandidate, HotelOffer, ItineraryDay, Trip } from "../types/trip";
import { KnowledgeDocument, KnowledgeChunk } from "../types/rag";

export const SAMPLE_DESTINATIONS: DestinationCandidate[] = [
  {
    id: "dest-coorg",
    name: "Coorg (Kodagu)",
    tagline: "The Scotland of India — Misty Hills, Cascading Waterfalls & Coffee Aromas",
    state: "Karnataka",
    country: "India",
    image: "https://images.unsplash.com/photo-1592639296346-560c37a0f711?auto=format&fit=crop&w=1200&q=80",
    matchScore: 96,
    matchReasons: [
      "Top adventure pick with Mandalpatti 4x4 off-road jeep trail",
      "Scenic coffee estates, waterfalls, and scenic hill viewpoints",
      "Great resort availability fitting ₹30,000 group budget (₹5,000/person)",
      "Only 5.5 hours drive from Bengaluru via Mysuru Expressway"
    ],
    idealDurationDays: 3,
    estimatedCostPerPerson: 4950,
    estimatedGroupCost: 29700,
    travelTimeFromOrigin: "5 hr 30 min (245 km)",
    primaryTransportMode: "Rental Car / SUV",
    topVibes: ["Adventure", "Mountains", "Waterfalls", "Coffee Cafes", "Scenic Places"],
    weatherForecast: {
      temp: "22°C",
      condition: "Pleasant & Misty",
      rainProbability: 15,
      advisory: "Ideal travel weather. Carry a light jacket for evenings."
    },
    sampleAttractions: ["Mandalpatti Peak Off-road", "Abbey Falls", "Raja's Seat Sunset", "Dubare Elephant Camp", "Namdroling Golden Temple"],
    sampleHotels: ["Woodstock Resort Coorg", "Heritage Resort Madikeri", "Zostel Coorg"],
    budgetSuitability: "WELL_WITHIN",
    provenance: "LIVE_VERIFIED"
  },
  {
    id: "dest-chikmagalur",
    name: "Chikmagalur",
    tagline: "Land of the Highest Peak in Karnataka & Coffee Culture",
    state: "Karnataka",
    country: "India",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
    matchScore: 92,
    matchReasons: [
      "Trek to Mullayanagiri (highest peak in Karnataka)",
      "Spectacular sunset at Z-Point and Hebbe Waterfalls",
      "Fast 4.5 hour scenic drive via Hassan highway",
      "Cozy coffee homestays and plantation villas"
    ],
    idealDurationDays: 3,
    estimatedCostPerPerson: 4700,
    estimatedGroupCost: 28200,
    travelTimeFromOrigin: "4 hr 30 min (240 km)",
    primaryTransportMode: "Self-drive / Zoomcar",
    topVibes: ["Adventure", "Mountains", "Trekking", "Cafes", "Nature"],
    weatherForecast: {
      temp: "24°C",
      condition: "Clear & Breezy",
      rainProbability: 10,
    },
    sampleAttractions: ["Mullayanagiri Trek", "Baba Budangiri", "Hebbe Falls", "Coffee Museum"],
    sampleHotels: ["Java Rain Resort", "Trivik Hotel", "Zostel Chikmagalur"],
    budgetSuitability: "WELL_WITHIN",
    provenance: "LIVE_VERIFIED"
  },
  {
    id: "dest-wayanad",
    name: "Wayanad",
    tagline: "Emerald Hills, Prehistoric Caves & Treehouse Wilderness",
    state: "Kerala",
    country: "India",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    matchScore: 90,
    matchReasons: [
      "Chembra Peak heart-shaped lake trek",
      "Edakkal prehistoric cave petroglyphs",
      "Scenic Banasura Sagar earthen dam speedboating",
      "Rich Malabar culinary experiences"
    ],
    idealDurationDays: 3,
    estimatedCostPerPerson: 5100,
    estimatedGroupCost: 30600,
    travelTimeFromOrigin: "6 hr 00 min (275 km)",
    primaryTransportMode: "SUV / Tourist Cab",
    topVibes: ["Adventure", "Waterfalls", "Caves", "Wildlife", "Food Exploration"],
    weatherForecast: {
      temp: "23°C",
      condition: "Partly Cloudy",
      rainProbability: 25,
      advisory: "Brief afternoon showers possible near Chembra."
    },
    sampleAttractions: ["Chembra Peak", "Edakkal Caves", "Banasura Sagar Dam", "Soochipara Falls"],
    sampleHotels: ["Morickap Resort", "Vythiri Village", "Wayanad Wild"],
    budgetSuitability: "BALANCED",
    provenance: "LIVE_VERIFIED"
  },
  {
    id: "dest-ooty",
    name: "Ooty (Nilgiris)",
    tagline: "Queen of Hill Stations — Heritage Toy Trains & Pine Forests",
    state: "Tamil Nadu",
    country: "India",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    matchScore: 87,
    matchReasons: [
      "UNESCO Heritage Nilgiri Mountain Toy Train",
      "Chilly mountain breeze and pine forest walks",
      "Doddabetta peak views and botanical gardens",
      "Homemade chocolate tastings and colonial cafes"
    ],
    idealDurationDays: 3,
    estimatedCostPerPerson: 5200,
    estimatedGroupCost: 31200,
    travelTimeFromOrigin: "6 hr 15 min (270 km via Bandipur)",
    primaryTransportMode: "Car / KSRTC Bus",
    topVibes: ["Mountains", "Heritage", "Relaxation", "Photography", "Cafes"],
    weatherForecast: {
      temp: "17°C",
      condition: "Crisp & Cold",
      rainProbability: 5,
      advisory: "Cold nights (12°C). Heavy woolens recommended."
    },
    sampleAttractions: ["Nilgiri Toy Train", "Botanical Garden", "Doddabetta Peak", "Pykara Lake Boating"],
    sampleHotels: ["Sterling Ooty Elk Hill", "Fortune Resort Sullivan", "Zostel Ooty"],
    budgetSuitability: "BALANCED",
    provenance: "LIVE_VERIFIED"
  },
  {
    id: "dest-gokarna",
    name: "Gokarna",
    tagline: "Untamed Cliffs, Arabian Sea Coastline & Bohemian Cafes",
    state: "Karnataka",
    country: "India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    matchScore: 84,
    matchReasons: [
      "Five Beach Cliff Trek (Om, Kudle, Half Moon, Paradise)",
      "Hippie beach cafes with live acoustic music",
      "Sunset dolphin spotting and seaside camping",
      "Low cost living with beach shacks and hostels"
    ],
    idealDurationDays: 3,
    estimatedCostPerPerson: 4200,
    estimatedGroupCost: 25200,
    travelTimeFromOrigin: "8 hr 30 min (480 km overnight)",
    primaryTransportMode: "Overnight Sleeper Bus",
    topVibes: ["Beaches", "Nightlife", "Adventure", "Cafes", "Budget Backpacking"],
    weatherForecast: {
      temp: "29°C",
      condition: "Sunny Coast",
      rainProbability: 0,
      advisory: "Bright sunshine. Sunscreen and hats recommended."
    },
    sampleAttractions: ["Om Beach", "Paradise Beach Trek", "Namaste Cafe", "Mahabaleshwar Temple"],
    sampleHotels: ["Kudle Beach View Resort", "Zostel Gokarna", "Kahani Paradise"],
    budgetSuitability: "WELL_WITHIN",
    provenance: "LIVE_VERIFIED"
  },
  {
    id: "dest-goa",
    name: "Goa (North & South)",
    tagline: "Sun, Sand, Portuguese Villas & Coastal Celebrations",
    state: "Goa",
    country: "India",
    image: "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80",
    matchScore: 89,
    matchReasons: [
      "Vibrant nightlife, beach clubs and live music",
      "Water sports at Anjuna & Baga",
      "Portuguese heritage walks in Fontainhas",
      "World-class seafood shacks"
    ],
    idealDurationDays: 4,
    estimatedCostPerPerson: 5800,
    estimatedGroupCost: 34800,
    travelTimeFromOrigin: "9 hr drive / 1 hr flight",
    primaryTransportMode: "Flight / Sleeper Bus",
    topVibes: ["Nightlife", "Beaches", "Food Exploration", "Road trips", "Culture"],
    weatherForecast: {
      temp: "31°C",
      condition: "Tropical Sunshine",
      rainProbability: 5,
    },
    sampleAttractions: ["Palolem Beach", "Fort Aguada", "Fontainhas Latin Quarter", "Dudhsagar Falls"],
    sampleHotels: ["Fairfield by Marriott Goa", "Whispering Palms", "Zostel Morjim"],
    budgetSuitability: "STRETCH",
    provenance: "LIVE_VERIFIED"
  }
];

export const SAMPLE_HOTELS: Record<string, HotelOffer[]> = {
  "Coorg (Kodagu)": [
    {
      id: "hotel-woodstock",
      name: "Woodstock Resorts Coorg",
      type: "Resort",
      address: "Mangalore-Mysore Highway, Madikeri, Coorg 571201",
      destination: "Coorg (Kodagu)",
      coordinates: [12.4244, 75.7382],
      rating: 4.4,
      reviewCount: 428,
      pricePerNight: 2400,
      maxOccupancyPerRoom: 2,
      requiredRooms: 3, // For 6 guests
      totalNights: 2,
      totalStayCost: 14400, // 3 rooms * 2400 * 2 nights
      perPersonStayCost: 2400, // 14400 / 6
      amenities: ["Outdoor Swimming Pool", "Free Wi-Fi", "Coffee Plantation View", "Bonfire", "Restaurant & Bar", "Free Parking"],
      mealIncluded: true,
      cancellationPolicy: "Free cancellation up to 48 hours before check-in",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      bookingUrl: "https://woodstockresorts.com",
      provenance: "LIVE_VERIFIED",
      verifiedAt: "2026-10-18T18:00:00Z",
      distanceToActivitiesKm: 4.2
    },
    {
      id: "hotel-heritage",
      name: "Heritage Resort Madikeri",
      type: "Premium Resort",
      address: "50/3, 1st Monnangeri Village, Galibeedu, Madikeri 571201",
      destination: "Coorg (Kodagu)",
      coordinates: [12.4411, 75.7214],
      rating: 4.6,
      reviewCount: 680,
      pricePerNight: 3500,
      maxOccupancyPerRoom: 2,
      requiredRooms: 3,
      totalNights: 2,
      totalStayCost: 21000,
      perPersonStayCost: 3500,
      amenities: ["Infinity Pool", "Ayurvedic Spa", "Mountain Views", "Buffet Breakfast", "Games Room", "Estate Walk"],
      mealIncluded: true,
      cancellationPolicy: "Free cancellation up to 7 days before check-in",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      bookingUrl: "https://heritageresorts.in",
      provenance: "LIVE_VERIFIED",
      verifiedAt: "2026-10-18T18:00:00Z",
      distanceToActivitiesKm: 6.8
    },
    {
      id: "hotel-zostel-coorg",
      name: "Zostel Coorg (Madikeri)",
      type: "Budget Hostel / Pods",
      address: "Near Golf Club, Madikeri 571201",
      destination: "Coorg (Kodagu)",
      coordinates: [12.4182, 75.7410],
      rating: 4.5,
      reviewCount: 910,
      pricePerNight: 1200,
      maxOccupancyPerRoom: 2,
      requiredRooms: 3,
      totalNights: 2,
      totalStayCost: 7200,
      perPersonStayCost: 1200,
      amenities: ["Common Room", "High-Speed Wi-Fi", "Board Games", "Cafe", "Backpacker Vibe", "Parking"],
      mealIncluded: false,
      cancellationPolicy: "Free cancellation up to 24 hours before check-in",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      bookingUrl: "https://zostel.com/zostel-coorg",
      provenance: "LIVE_VERIFIED",
      verifiedAt: "2026-10-18T18:00:00Z",
      distanceToActivitiesKm: 2.1
    },
    {
      id: "hotel-coffee-homestay",
      name: "Wanders Coffee Plantation Villa",
      type: "Private Homestay",
      address: "Suntikoppa Road, Coorg 571237",
      destination: "Coorg (Kodagu)",
      coordinates: [12.4620, 75.7950],
      rating: 4.8,
      reviewCount: 195,
      pricePerNight: 1800,
      maxOccupancyPerRoom: 2,
      requiredRooms: 3,
      totalNights: 2,
      totalStayCost: 10800,
      perPersonStayCost: 1800,
      amenities: ["Authentic Kodava Dinner Included", "Private Estate Trail", "Campfire", "Spacious Veranda", "Home Cooked Food"],
      mealIncluded: true,
      cancellationPolicy: "Moderate: 50% refund up to 3 days prior",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      bookingUrl: "https://wandershomestays.com",
      provenance: "LIVE_VERIFIED",
      verifiedAt: "2026-10-18T18:00:00Z",
      distanceToActivitiesKm: 8.5
    }
  ]
};

// Rich Knowledge Documents for RAG Pipeline
export const SAMPLE_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: "rag-coorg-mandalpatti",
    sourceId: "KSTDC-COORG-001",
    sourceName: "Karnataka State Tourism Development Corporation (KSTDC)",
    sourceUrl: "https://karnatakatourism.org/destination/mandalpatti/",
    title: "Mandalpatti Peak 4x4 Off-Road Jeep Trail & Viewpoint",
    content: "Mandalpatti, situated at an altitude of 4,050 feet in the Pushpagiri wildlife sanctuary range, is renowned for its panoramic mist-clad views. Accessing the viewpoint requires a mandatory 4x4 Jeep ride (approx ₹1,800 to ₹2,200 per 6-passenger vehicle return fare from the base checkpoint). Private sedans and hatchbacks cannot navigate the rocky terrain. Best visited at sunrise (06:00 - 08:30) or late afternoon to avoid midday fog. Entry fee is ₹25 per person. Carry warm windcheaters as winds are heavy at the summit.",
    category: "ATTRACTION",
    destination: "Coorg (Kodagu)",
    coordinates: [12.4983, 75.7008],
    providerReference: "KSTDC-OFFICIAL-2026",
    retrievedAt: "2026-10-18T10:00:00Z",
    verifiedAt: "2026-10-18T12:00:00Z",
    freshnessStatus: "FRESH",
    licensingNotice: "Official public tourism advisory.",
    structuredMetadata: {
      openingHours: "06:00 - 18:00 daily",
      ticketPriceInr: 25,
      recommendedDurationMinutes: 150,
      bestTimeToVisit: "06:30 - 09:00",
      crowdLevel: "MODERATE",
      accessibilityFeatures: ["Requires 4x4 Jeep transfer", "Not wheelchair accessible on peak summit trail"],
      seasonalNotes: "Post-monsoon and winter offer crystal clear views across the Western Ghats."
    }
  },
  {
    id: "rag-coorg-abbey-falls",
    sourceId: "KSTDC-COORG-002",
    sourceName: "Kodagu District Administration Tourism Wing",
    sourceUrl: "https://kodagu.nic.in/en/tourism/abbey-falls/",
    title: "Abbey Falls (Abbi Falls) & Hanging Bridge Guidelines",
    content: "Abbey Falls is located 8 km from Madikeri town surrounded by private spice and coffee estates. The falls plunge 70 feet down into the Kaveri river tributary. Visitors walk 200 meters down stepped paths through pepper vines and coffee bushes. A hanging bridge spans across the gorge facing the falls. Swimming or stepping into the water is strictly prohibited by district order due to slippery rocks and strong currents. Parking fee is ₹50 per car, entry ticket is ₹15 per person.",
    category: "ATTRACTION",
    destination: "Coorg (Kodagu)",
    coordinates: [12.4542, 75.7197],
    providerReference: "KODAGU-NIC-GOV",
    retrievedAt: "2026-10-18T10:00:00Z",
    verifiedAt: "2026-10-18T12:00:00Z",
    freshnessStatus: "FRESH",
    licensingNotice: "District public safety regulation.",
    structuredMetadata: {
      openingHours: "09:00 - 17:00 daily",
      ticketPriceInr: 15,
      recommendedDurationMinutes: 60,
      bestTimeToVisit: "Morning 09:30 - 11:30",
      crowdLevel: "HIGH",
      accessibilityFeatures: ["Paved steps", "Railing available", "Steps can be tiring for elderly"],
      seasonalNotes: "Full roaring cascade from July to December."
    }
  },
  {
    id: "rag-coorg-rajas-seat",
    sourceId: "KSTDC-COORG-003",
    sourceName: "Department of Horticulture Karnataka",
    sourceUrl: "https://karnatakatourism.org/destination/rajas-seat/",
    title: "Raja's Seat Seasonal Garden & Musical Fountain",
    content: "Raja's Seat (The Seat of Kings) is a scenic public garden perched on a hill overlooking lush valleys and the cliffs towards Mangalore. Historical kings of Kodagu spent evenings here watching the crimson sunsets. The garden features seasonal flowers, a toy train for visitors, and an evening musical fountain show starting at 19:00. Entry fee is ₹10. Evening sunset timing in Coorg averages between 17:45 and 18:20.",
    category: "ATTRACTION",
    destination: "Coorg (Kodagu)",
    coordinates: [12.4172, 75.7350],
    providerReference: "HORT-MADIKERI-01",
    retrievedAt: "2026-10-18T10:00:00Z",
    verifiedAt: "2026-10-18T12:00:00Z",
    freshnessStatus: "FRESH",
    licensingNotice: "Official Horticultural Department advisory.",
    structuredMetadata: {
      openingHours: "06:00 - 20:00 daily",
      ticketPriceInr: 10,
      recommendedDurationMinutes: 75,
      bestTimeToVisit: "17:15 - 18:30 for sunset",
      crowdLevel: "MODERATE",
      accessibilityFeatures: ["Wheelchair ramps available in garden walkways"]
    }
  },
  {
    id: "rag-coorg-dubare",
    sourceId: "KSTDC-COORG-004",
    sourceName: "Jungle Lodges & Resorts Karnataka",
    sourceUrl: "https://www.junglelodges.com/dubare-elephant-camp/",
    title: "Dubare Elephant Camp & River Rafting Regulations",
    content: "Dubare Elephant Camp is located on the banks of the river Kaveri near Kushalnagar. Visitors cross the river via motorboat (₹50 return) or walk across the rocks in summer. Morning elephant grooming and bathing interaction takes place strictly between 09:00 and 11:00 AM. In the monsoon and post-monsoon months (July - November), Class I & II river rafting operates over a 8 km stretch (₹600 to ₹1,000 per person). Entry ticket to the camp is ₹100 per person.",
    category: "ATTRACTION",
    destination: "Coorg (Kodagu)",
    coordinates: [12.3688, 75.9042],
    providerReference: "JLR-DUBARE-REG",
    retrievedAt: "2026-10-18T10:00:00Z",
    verifiedAt: "2026-10-18T12:00:00Z",
    freshnessStatus: "FRESH",
    licensingNotice: "Jungle Lodges & Resorts official protocol.",
    structuredMetadata: {
      openingHours: "09:00 - 11:30 and 16:30 - 17:30",
      ticketPriceInr: 100,
      recommendedDurationMinutes: 120,
      bestTimeToVisit: "08:45 AM arrival for morning river crossing",
      crowdLevel: "HIGH"
    }
  },
  {
    id: "rag-coorg-food-pandi-curry",
    sourceId: "KODAVA-FOOD-001",
    sourceName: "Kodava Heritage Culinary Guild",
    sourceUrl: "https://kodavaculture.org/cuisine/",
    title: "Traditional Kodava Cuisine, Pandi Curry & Vegetarian Specialties",
    content: "Authentic Kodava cuisine is defined by Kachampuli (dark wild garcinia vinegar), roasted black pepper, and locally grown cardamom. Signature dishes include Pandi Curry (slow-cooked spicy pork in black vinegar gravy), Koli Curry (country chicken), Akki Roti (rice flatbreads), and Kadambuttu (steamed rice balls). Vegetarian dining is widely celebrated with Baimbale Curry (tender bamboo shoot gravy), Chekke Curry (raw jackfruit), and Paputtu (steamed rice cake with coconut). Recommended authentic local restaurants in Madikeri: Coorg Cuisine (opp. Post Office), Raintree, and Tiger Tiger.",
    category: "DINING",
    destination: "Coorg (Kodagu)",
    providerReference: "FOOD-KODAVA-VERIFIED",
    retrievedAt: "2026-10-18T10:00:00Z",
    verifiedAt: "2026-10-18T12:00:00Z",
    freshnessStatus: "FRESH",
    licensingNotice: "Curated cultural culinary guide.",
    structuredMetadata: {
      ticketPriceInr: 350,
      recommendedDurationMinutes: 60,
      crowdLevel: "MODERATE"
    }
  },
  {
    id: "rag-coorg-indoor-rain-alternatives",
    sourceId: "COORG-SAFETY-005",
    sourceName: "District Disaster Management Authority Kodagu",
    sourceUrl: "https://kodagu.nic.in/safety-advisory/",
    title: "Rainy Weather Alternatives & Indoor Experiences in Coorg",
    content: "During sudden downpours or heavy monsoon spells in the Western Ghats, outdoor trails and waterfalls may temporarily restrict access for safety. Recommended verified indoor and covered alternatives: 1) Madikeri Fort Museum and Palatial Quarters (covered historical galleries, free entry), 2) Namdroling Monastery (The Golden Temple at Bylakuppe, large covered Tibetan prayer halls, peaceful indoor meditation space, entry free), 3) Ainmane Coffee & Chocolate Roastery Experience (indoor tasting of civet coffee and artisanal Coorg single-origin chocolates).",
    category: "SAFETY",
    destination: "Coorg (Kodagu)",
    coordinates: [12.4200, 75.7360],
    providerReference: "SAFETY-RAIN-INDOOR",
    retrievedAt: "2026-10-18T10:00:00Z",
    verifiedAt: "2026-10-18T12:00:00Z",
    freshnessStatus: "FRESH",
    licensingNotice: "Official monsoon safety protocol.",
    structuredMetadata: {
      openingHours: "09:00 - 18:00",
      accessibilityFeatures: ["Fully covered", "Rainproof", "Wheelchair accessible monastery grounds"]
    }
  }
];

// Helper to chunk knowledge documents for vector indexing
export function generateKnowledgeChunks(docs: KnowledgeDocument[]): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  docs.forEach((doc) => {
    // Break document into manageable chunks (~150-200 words)
    const paragraphs = doc.content.split("\n\n");
    paragraphs.forEach((p, idx) => {
      const tokens = (doc.title + " " + p + " " + doc.destination + " " + doc.category)
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 2);

      // Generate a deterministic pseudo-vector (16 float dimensions) for client/demo vector cosine similarity
      const pseudoVector = new Array(16).fill(0).map((_, i) => {
        let hash = 0;
        const seedStr = doc.title + "_" + i + "_" + p.slice(0, 30);
        for (let c = 0; c < seedStr.length; c++) {
          hash = (hash << 5) - hash + seedStr.charCodeAt(c);
          hash |= 0;
        }
        return (Math.abs(hash % 1000) / 1000) * 2 - 1;
      });

      chunks.push({
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
        embedding: pseudoVector,
        keywordTokens: Array.from(new Set(tokens))
      });
    });
  });
  return chunks;
}

export const SAMPLE_KNOWLEDGE_CHUNKS: KnowledgeChunk[] = generateKnowledgeChunks(SAMPLE_KNOWLEDGE_DOCS);

// Pre-seeded Full Trip Matching the User's Persona
export const SAMPLE_COORG_TRIP: Trip = {
  id: "trip-coorg-demo-001",
  title: "Coorg Vibe & Venture: 6 Friends Weekend Escape",
  tagline: "High peaks, coffee aromas, private bonfire & waterfall chases",
  destination: "Coorg (Kodagu)",
  originCity: "Bengaluru",
  startDate: "2026-10-24",
  endDate: "2026-10-26",
  days: 3,
  nights: 2,
  groupSize: 6,
  preferences: {
    originCity: "Bengaluru",
    destinationCity: "Coorg (Kodagu)",
    startDate: "2026-10-24",
    endDate: "2026-10-26",
    days: 3,
    nights: 2,
    totalBudget: 30000,
    perPersonBudget: 5000,
    currency: "INR",
    includeOriginTravelCost: true,
    groupProfile: "FRIENDS",
    groupSize: 6,
    roomPreference: "PRIVATE_DOUBLE",
    vibes: ["Adventure", "Scenic Places", "Food Exploration", "Nightlife"],
    pace: "BALANCED",
    preferredStartTime: "08:30",
    walkingIntensity: "MODERATE",
    accommodationType: "RESORT",
    preferredAmenities: ["Outdoor Swimming Pool", "Bonfire", "Free Wi-Fi"],
    transportPreference: "RENTAL_CAR",
    transportPriority: "CONVENIENCE",
    dietary: ["NON_VEGETARIAN", "REGIONAL", "VEGETARIAN"],
    mustVisitPlaces: ["Mandalpatti Peak", "Abbey Falls"],
    avoidActivities: ["Extreme technical rock climbing"],
    customNotes: "We are six friends travelling from Bengaluru for three days. Total budget is ₹30,000. Want adventure, scenic spots, good food and cozy resort."
  },
  selectedHotel: SAMPLE_HOTELS["Coorg (Kodagu)"][0], // Woodstock Resort Coorg (₹14,400 for 3 rooms x 2 nights)
  budget: {
    totalTripCost: 28650,
    perPersonCost: 4775,
    budgetLimit: 30000,
    remainingBudget: 1350,
    utilizationPercent: 95.5,
    contingencyReserve: 1500,
    categories: {
      intercityTransport: 6500, // SUV fuel + tolls Bengaluru-Coorg return
      localTransport: 2200,    // 4x4 Jeep Mandalpatti hire
      accommodation: 14400,    // 3 double rooms x 2 nights at Woodstock Resort
      food: 3200,             // Group dinners & coffee stops
      activities: 650,        // Tickets Abbey Falls, Raja's Seat
      tickets: 200,
      contingency: 1500,
      misc: 0
    },
    warnings: [],
    costSavingTips: [
      "Replacing Woodstock Resort with Zostel Coorg would save ₹7,200 for the group.",
      "Fuel costs are calculated for a 7-seater SUV via Bengaluru-Mysuru Expressway."
    ]
  },
  daysItinerary: [
    {
      dayNumber: 1,
      date: "2026-10-24",
      title: "Scenic Roadtrip & Sunset Valley Vistas",
      summary: "Drive from Bengaluru via Mysuru Expressway, check into Woodstock Resort, afternoon walk through Abbey Falls, and Raja's Seat sunset.",
      transportLegs: [
        {
          from: "Bengaluru",
          to: "Madikeri, Coorg",
          mode: "SUV Self-Drive",
          durationMinutes: 320,
          distanceKm: 245,
          cost: 3250,
          provenance: "LIVE_VERIFIED"
        }
      ],
      items: [
        {
          id: "item-d1-1",
          name: "Bengaluru to Coorg Highway Drive & Breakfast",
          description: "Early morning drive via Bangalore-Mysuru Expressway. Stop at Bidadi or Maddur for hot Maddur Vada and filter coffee.",
          category: "TRANSPORT",
          timeSlot: "MORNING",
          startTime: "06:00",
          endTime: "11:30",
          durationMinutes: 330,
          location: "Bengaluru to Madikeri Highway",
          coordinates: [12.7234, 76.8521],
          individualCost: 540,
          groupCost: 3250,
          isApproved: true,
          source: "OSRM Route Engine & Toll Calculator",
          provenance: "LIVE_VERIFIED"
        },
        {
          id: "item-d1-2",
          name: "Check-in at Woodstock Resorts & Lunch",
          description: "Check into 3 Deluxe Double Rooms. Enjoy included welcome drink and estate lunch at the open-air restaurant.",
          category: "CHECK_IN",
          timeSlot: "AFTERNOON",
          startTime: "12:30",
          endTime: "14:30",
          durationMinutes: 120,
          location: "Woodstock Resorts, Madikeri",
          coordinates: [12.4244, 75.7382],
          individualCost: 200,
          groupCost: 1200,
          isApproved: true,
          source: "Woodstock Resorts Verified Direct Rate",
          provenance: "LIVE_VERIFIED"
        },
        {
          id: "item-d1-3",
          name: "Abbey Falls Spice & Coffee Trail Walk",
          description: "Walk down the 200-meter paved path surrounded by pepper vines and coffee bushes to the roaring cascade. Photography from the suspension bridge.",
          category: "ACTIVITY",
          timeSlot: "AFTERNOON",
          startTime: "15:00",
          endTime: "16:45",
          durationMinutes: 105,
          location: "Abbey Falls, Madikeri",
          coordinates: [12.4542, 75.7197],
          individualCost: 15,
          groupCost: 90,
          isApproved: true,
          source: "Kodagu District Tourism Office",
          sourceUrl: "https://kodagu.nic.in/en/tourism/abbey-falls/",
          provenance: "LIVE_VERIFIED",
          verifiedAt: "2026-10-18T12:00:00Z",
          weatherSensitive: true,
          indoorAlternative: "Madikeri Fort Museum & Historical Gallery"
        },
        {
          id: "item-d1-4",
          name: "Raja's Seat Sunset & Evening Chills",
          description: "Watch the golden sun sink into the cliffside valleys of Western Ghats. Grab street roasted corn and piping hot Coorg filter coffee.",
          category: "SIGHTSEEING",
          timeSlot: "EVENING",
          startTime: "17:15",
          endTime: "18:45",
          durationMinutes: 90,
          location: "Raja's Seat Garden, Madikeri",
          coordinates: [12.4172, 75.7350],
          individualCost: 10,
          groupCost: 60,
          isApproved: true,
          source: "Karnataka Horticulture Dept",
          provenance: "LIVE_VERIFIED"
        },
        {
          id: "item-d1-5",
          name: "Authentic Kodava Dinner & Private Resort Bonfire",
          description: "Dinner featuring traditional Pandi Curry or Chekke Curry with Akki Roti, followed by an evening bonfire with music under starry mountain skies.",
          category: "MEAL",
          timeSlot: "NIGHT",
          startTime: "19:30",
          endTime: "22:30",
          durationMinutes: 180,
          location: "Woodstock Resort Courtyard",
          coordinates: [12.4244, 75.7382],
          individualCost: 300,
          groupCost: 1800,
          isApproved: true,
          source: "Kodava Heritage Guild Menu",
          provenance: "LIVE_VERIFIED"
        }
      ]
    },
    {
      dayNumber: 2,
      date: "2026-10-25",
      title: "Off-Road 4x4 Mountain Adventure & Golden Temple",
      summary: "Exciting 4x4 jeep climb to Mandalpatti summit, scenic mountain breeze, afternoon visit to Namdroling Tibetan Golden Temple, and cafe exploration.",
      items: [
        {
          id: "item-d2-1",
          name: "Mandalpatti 4x4 Jeep Off-Road Safari",
          description: "Board private 4x4 open-top jeep at base checkpoint. Thrilling rocky trail ascent through Pushpagiri mist to 4,050 ft peak with panoramic cloud views.",
          category: "ACTIVITY",
          timeSlot: "MORNING",
          startTime: "07:00",
          endTime: "11:30",
          durationMinutes: 270,
          location: "Mandalpatti Peak, Kodagu",
          coordinates: [12.4983, 75.7008],
          individualCost: 370,
          groupCost: 2220, // ₹2000 jeep + entry tickets
          isApproved: true,
          source: "KSTDC Mandalpatti Forest Entry Log",
          sourceUrl: "https://karnatakatourism.org/destination/mandalpatti/",
          provenance: "LIVE_VERIFIED",
          verifiedAt: "2026-10-18T12:00:00Z",
          weatherSensitive: true,
          indoorAlternative: "Namdroling Monastery Prayer Hall Tour & Handicrafts"
        },
        {
          id: "item-d2-2",
          name: "Bylakuppe Tibetan Monasteries & Momos",
          description: "Visit Namdroling Monastery (The Golden Temple) with its 40-foot gilded Buddha statues. Official entry is free; enjoy authentic Tibetan momos.",
          category: "SIGHTSEEING",
          timeSlot: "AFTERNOON",
          startTime: "13:00",
          endTime: "15:30",
          durationMinutes: 150,
          location: "Namdroling Monastery, Bylakuppe",
          coordinates: [12.4299, 75.9687],
          individualCost: 50,
          groupCost: 300,
          isApproved: true,
          source: "Bylakuppe Tourism Council (Free Entry)",
          provenance: "LIVE_VERIFIED"
        },
        {
          id: "item-d2-3",
          name: "Artisanal Coffee & Chocolate Roastery Experience",
          description: "Hands-on coffee cupping and civet coffee exploration at Ainmane Cafe. Sample single-estate roasted arabica and dark chocolate.",
          category: "ACTIVITY",
          timeSlot: "EVENING",
          startTime: "16:30",
          endTime: "18:00",
          durationMinutes: 90,
          location: "Ainmane Cafe, Madikeri",
          coordinates: [12.4215, 75.7390],
          individualCost: 50,
          groupCost: 300,
          isApproved: true,
          source: "Ainmane Official Catalog",
          provenance: "LIVE_VERIFIED"
        },
        {
          id: "item-d2-4",
          name: "Nightlife & Micro-Gathering at The Fort Mercara",
          description: "Enjoy cocktails, craft brews, live acoustic performance and tandoori platters with the squad.",
          category: "MEAL",
          timeSlot: "NIGHT",
          startTime: "19:30",
          endTime: "22:30",
          durationMinutes: 180,
          location: "Madikeri Town Center",
          coordinates: [12.4210, 75.7375],
          individualCost: 250,
          groupCost: 1500,
          isApproved: true,
          source: "TripMate Sourced Directory",
          provenance: "LIVE_VERIFIED"
        }
      ]
    },
    {
      dayNumber: 3,
      date: "2026-10-26",
      title: "River Kaveri Wildlife & Return Drive",
      summary: "Morning river crossing and elephant grooming at Dubare Elephant Camp, shopping for homemade chocolates and spices, and return highway drive to Bengaluru.",
      transportLegs: [
        {
          from: "Coorg",
          to: "Bengaluru",
          mode: "SUV Self-Drive",
          durationMinutes: 320,
          distanceKm: 245,
          cost: 3250,
          provenance: "LIVE_VERIFIED"
        }
      ],
      items: [
        {
          id: "item-d3-1",
          name: "Dubare Elephant Camp & Kaveri River Crossing",
          description: "Motorboat river crossing to witness morning elephant grooming and natural Kaveri rapids.",
          category: "ACTIVITY",
          timeSlot: "MORNING",
          startTime: "08:45",
          endTime: "11:30",
          durationMinutes: 165,
          location: "Dubare Elephant Camp, Kushalnagar",
          coordinates: [12.3688, 75.9042],
          individualCost: 150,
          groupCost: 900,
          isApproved: true,
          source: "Jungle Lodges Official Portal",
          sourceUrl: "https://www.junglelodges.com/dubare-elephant-camp/",
          provenance: "LIVE_VERIFIED",
          verifiedAt: "2026-10-18T12:00:00Z"
        },
        {
          id: "item-d3-2",
          name: "Spice Plantation Souvenirs & Madikeri Coffee Stalls",
          description: "Pick up freshly ground robusta/arabica beans, fresh black peppercorns, cardamom pods and artisanal homemade chocolates.",
          category: "SIGHTSEEING",
          timeSlot: "AFTERNOON",
          startTime: "12:00",
          endTime: "13:00",
          durationMinutes: 60,
          location: "Kushalnagar Market",
          coordinates: [12.4578, 75.9592],
          individualCost: 0,
          groupCost: 0,
          isApproved: true,
          source: "Local Spice Guild",
          provenance: "LIVE_VERIFIED"
        },
        {
          id: "item-d3-3",
          name: "Return Drive to Bengaluru via Mysuru Expressway",
          description: "Smooth return journey with a highway stop for dinner. Arrive back in Bengaluru by 20:00 refreshed.",
          category: "TRANSPORT",
          timeSlot: "AFTERNOON",
          startTime: "13:30",
          endTime: "19:30",
          durationMinutes: 360,
          location: "Mysuru Expressway to Bengaluru",
          coordinates: [12.9716, 77.5946],
          individualCost: 540,
          groupCost: 3250,
          isApproved: true,
          source: "OSRM Route Engine",
          provenance: "LIVE_VERIFIED"
        }
      ]
    }
  ],
  members: [
    {
      id: "mem-1",
      name: "Faisal (Trip Lead)",
      email: "faisal@example.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      role: "OWNER",
      joinedAt: "2026-10-18T10:00:00Z",
      paidAmount: 14400 // Paid for the resort
    },
    {
      id: "mem-2",
      name: "Rohit",
      email: "rohit@example.com",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      role: "MEMBER",
      joinedAt: "2026-10-18T10:05:00Z",
      paidAmount: 6500 // Paid for SUV fuel & expressway tolls
    },
    {
      id: "mem-3",
      name: "Karan",
      email: "karan@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      role: "MEMBER",
      joinedAt: "2026-10-18T10:10:00Z",
      paidAmount: 2220 // Paid for Mandalpatti 4x4 Jeep
    },
    {
      id: "mem-4",
      name: "Aditya",
      email: "aditya@example.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      role: "MEMBER",
      joinedAt: "2026-10-18T10:12:00Z",
      paidAmount: 1800 // Paid for Day 1 Dinner
    },
    {
      id: "mem-5",
      name: "Vikram",
      email: "vikram@example.com",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
      role: "MEMBER",
      joinedAt: "2026-10-18T10:15:00Z",
      paidAmount: 2100 // Paid for Day 2 Nightout
    },
    {
      id: "mem-6",
      name: "Siddharth",
      email: "sid@example.com",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
      role: "MEMBER",
      joinedAt: "2026-10-18T10:20:00Z",
      paidAmount: 1630 // Paid for Elephant Camp & snacks
    }
  ],
  expenses: [
    {
      id: "exp-1",
      title: "Woodstock Resort (3 Deluxe Double Rooms x 2 Nights)",
      amount: 14400,
      category: "STAY",
      payerId: "mem-1",
      payerName: "Faisal (Trip Lead)",
      date: "2026-10-24",
      splitMode: "EQUAL",
      allocations: [
        { memberId: "mem-1", memberName: "Faisal", amount: 2400 },
        { memberId: "mem-2", memberName: "Rohit", amount: 2400 },
        { memberId: "mem-3", memberName: "Karan", amount: 2400 },
        { memberId: "mem-4", memberName: "Aditya", amount: 2400 },
        { memberId: "mem-5", memberName: "Vikram", amount: 2400 },
        { memberId: "mem-6", memberName: "Siddharth", amount: 2400 }
      ]
    },
    {
      id: "exp-2",
      title: "Bengaluru-Coorg SUV Fuel & Expressway Tolls (Return)",
      amount: 6500,
      category: "TRANSPORT",
      payerId: "mem-2",
      payerName: "Rohit",
      date: "2026-10-24",
      splitMode: "EQUAL",
      allocations: [
        { memberId: "mem-1", memberName: "Faisal", amount: 1083.33 },
        { memberId: "mem-2", memberName: "Rohit", amount: 1083.33 },
        { memberId: "mem-3", memberName: "Karan", amount: 1083.33 },
        { memberId: "mem-4", memberName: "Aditya", amount: 1083.33 },
        { memberId: "mem-5", memberName: "Vikram", amount: 1083.33 },
        { memberId: "mem-6", memberName: "Siddharth", amount: 1083.33 }
      ]
    },
    {
      id: "exp-3",
      title: "Mandalpatti Peak 4x4 Off-Road Jeep Rental",
      amount: 2220,
      category: "ACTIVITY",
      payerId: "mem-3",
      payerName: "Karan",
      date: "2026-10-25",
      splitMode: "EQUAL",
      allocations: [
        { memberId: "mem-1", memberName: "Faisal", amount: 370 },
        { memberId: "mem-2", memberName: "Rohit", amount: 370 },
        { memberId: "mem-3", memberName: "Karan", amount: 370 },
        { memberId: "mem-4", memberName: "Aditya", amount: 370 },
        { memberId: "mem-5", memberName: "Vikram", amount: 370 },
        { memberId: "mem-6", memberName: "Siddharth", amount: 370 }
      ]
    },
    {
      id: "exp-4",
      title: "Day 1 Authentic Kodava Group Dinner",
      amount: 1800,
      category: "FOOD",
      payerId: "mem-4",
      payerName: "Aditya",
      date: "2026-10-24",
      splitMode: "EQUAL",
      allocations: [
        { memberId: "mem-1", memberName: "Faisal", amount: 300 },
        { memberId: "mem-2", memberName: "Rohit", amount: 300 },
        { memberId: "mem-3", memberName: "Karan", amount: 300 },
        { memberId: "mem-4", memberName: "Aditya", amount: 300 },
        { memberId: "mem-5", memberName: "Vikram", amount: 300 },
        { memberId: "mem-6", memberName: "Siddharth", amount: 300 }
      ]
    },
    {
      id: "exp-5",
      title: "Day 2 Nightout, Acoustic Music & Starters",
      amount: 2100,
      category: "FOOD",
      payerId: "mem-5",
      payerName: "Vikram",
      date: "2026-10-25",
      splitMode: "EQUAL",
      allocations: [
        { memberId: "mem-1", memberName: "Faisal", amount: 350 },
        { memberId: "mem-2", memberName: "Rohit", amount: 350 },
        { memberId: "mem-3", memberName: "Karan", amount: 350 },
        { memberId: "mem-4", memberName: "Aditya", amount: 350 },
        { memberId: "mem-5", memberName: "Vikram", amount: 350 },
        { memberId: "mem-6", memberName: "Siddharth", amount: 350 }
      ]
    },
    {
      id: "exp-6",
      title: "Dubare Kaveri Boating & Elephant Camp Tickets",
      amount: 1630,
      category: "ACTIVITY",
      payerId: "mem-6",
      payerName: "Siddharth",
      date: "2026-10-26",
      splitMode: "EQUAL",
      allocations: [
        { memberId: "mem-1", memberName: "Faisal", amount: 271.67 },
        { memberId: "mem-2", memberName: "Rohit", amount: 271.67 },
        { memberId: "mem-3", memberName: "Karan", amount: 271.67 },
        { memberId: "mem-4", memberName: "Aditya", amount: 271.67 },
        { memberId: "mem-5", memberName: "Vikram", amount: 271.67 },
        { memberId: "mem-6", memberName: "Siddharth", amount: 271.67 }
      ]
    }
  ],
  scenarios: [
    {
      id: "scen-extra-day",
      title: "Extend to 4 Days (Add Wayanad Spillover)",
      description: "Adds 1 extra night and day visiting Chembra Peak or Nagarhole Safari.",
      extraDays: 1,
      extraFriends: 0,
      stayUpgradeTier: "CURRENT",
      transportChange: "KEEP",
      simulatedBudget: {
        totalTripCost: 37800,
        perPersonCost: 6300,
        budgetLimit: 30000,
        remainingBudget: -7800,
        utilizationPercent: 126,
        contingencyReserve: 2000,
        categories: {
          intercityTransport: 7200,
          localTransport: 3200,
          accommodation: 21600,
          food: 4600,
          activities: 1200,
          tickets: 0,
          contingency: 2000,
          misc: 0
        },
        warnings: ["Exceeds ₹30,000 budget by ₹7,800. Group would need to contribute ₹1,300 more per person."],
        costSavingTips: ["Switching to Zostel Coorg would bring the 4-day trip down to ₹28,500, fitting inside ₹30,000!"]
      },
      differences: {
        totalCostDelta: 9150,
        perPersonCostDelta: 1525,
        comment: "Requires +₹1,525/person unless accommodation is downgraded to hostel/homestay."
      }
    },
    {
      id: "scen-hostel-downgrade",
      title: "Budget Optimization (Switch to Zostel Coorg)",
      description: "Replace Woodstock Resort with Zostel Coorg private pods, saving ₹7,200.",
      extraDays: 0,
      extraFriends: 0,
      stayUpgradeTier: "BUDGET",
      transportChange: "KEEP",
      simulatedBudget: {
        totalTripCost: 21450,
        perPersonCost: 3575,
        budgetLimit: 30000,
        remainingBudget: 8550,
        utilizationPercent: 71.5,
        contingencyReserve: 1500,
        categories: {
          intercityTransport: 6500,
          localTransport: 2200,
          accommodation: 7200,
          food: 3200,
          activities: 650,
          tickets: 200,
          contingency: 1500,
          misc: 0
        },
        warnings: [],
        costSavingTips: ["Saves ₹8,550 for the entire group (₹1,425 back per friend)."]
      },
      differences: {
        totalCostDelta: -7200,
        perPersonCostDelta: -1200,
        comment: "Reduces individual cost to ₹3,575 without changing any adventure activities."
      }
    }
  ],
  history: [
    {
      id: "hist-1",
      timestamp: "2026-10-18T10:00:00Z",
      description: "Initial AI itinerary generated using RAG knowledge base & KSTDC verified sources."
    }
  ],
  isDemo: true,
  updatedAt: "2026-10-18T18:00:00Z",
  createdAt: "2026-10-18T10:00:00Z"
};
