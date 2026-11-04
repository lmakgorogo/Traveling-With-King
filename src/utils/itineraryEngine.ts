import {
  Activity,
  REGIONAL_ZONES,
  ZoneCluster,
  VisitorType,
  getActivityPricesForVisitor,
} from '../data/activities';
import { findHotelById } from '../data/hotels';

export interface DepartureLocation {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  distancesToOneWay: {
    ZONE_CT_CENTRAL: number;
    ZONE_PENINSULA: number;
    ZONE_WINELANDS: number;
    ZONE_WEST_COAST_ATLANTIS: number;
    ZONE_WEST_COAST_LANGEBAAN: number;
    ZONE_OVERBERG_ELGIN: number;
    ZONE_OVERBERG_GANSBAAI: number;
    ZONE_KAROO: number;
  };
}

export const DEPARTURE_LOCATIONS: Record<string, DepartureLocation> = {
  CT_CBD: {
    id: 'CT_CBD',
    name: 'Cape Town CBD & V&A Waterfront',
    shortLabel: 'Cape Town Central / V&A',
    description: 'City Bowl, V&A Waterfront, Foreshore, Sea Point & Green Point',
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 18,
      ZONE_PENINSULA: 65,
      ZONE_WINELANDS: 70,
      ZONE_WEST_COAST_ATLANTIS: 45,
      ZONE_WEST_COAST_LANGEBAAN: 135,
      ZONE_OVERBERG_ELGIN: 75,
      ZONE_OVERBERG_GANSBAAI: 160,
      ZONE_KAROO: 180,
    },
  },
  CAMPS_BAY: {
    id: 'CAMPS_BAY',
    name: 'Camps Bay & Atlantic Seaboard',
    shortLabel: 'Camps Bay / Clifton',
    description: 'Camps Bay, Clifton, Bantry Bay, Fresnaye & Llandudno',
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 15,
      ZONE_PENINSULA: 60,
      ZONE_WINELANDS: 78,
      ZONE_WEST_COAST_ATLANTIS: 52,
      ZONE_WEST_COAST_LANGEBAAN: 142,
      ZONE_OVERBERG_ELGIN: 82,
      ZONE_OVERBERG_GANSBAAI: 165,
      ZONE_KAROO: 188,
    },
  },
  SOUTHERN_SUBURBS: {
    id: 'SOUTHERN_SUBURBS',
    name: 'Southern Suburbs & Constantia',
    shortLabel: 'Constantia / Newlands',
    description: 'Constantia Wine Valley, Newlands, Bishopscourt & Claremont',
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 22,
      ZONE_PENINSULA: 45,
      ZONE_WINELANDS: 60,
      ZONE_WEST_COAST_ATLANTIS: 55,
      ZONE_WEST_COAST_LANGEBAAN: 145,
      ZONE_OVERBERG_ELGIN: 68,
      ZONE_OVERBERG_GANSBAAI: 150,
      ZONE_KAROO: 180,
    },
  },
  BLOUBERG: {
    id: 'BLOUBERG',
    name: 'Century City & Bloubergstrand',
    shortLabel: 'Century City / Blouberg',
    description: 'Century City, Milnerton, Bloubergstrand & Table View',
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 22,
      ZONE_PENINSULA: 78,
      ZONE_WINELANDS: 55,
      ZONE_WEST_COAST_ATLANTIS: 30,
      ZONE_WEST_COAST_LANGEBAAN: 115,
      ZONE_OVERBERG_ELGIN: 78,
      ZONE_OVERBERG_GANSBAAI: 162,
      ZONE_KAROO: 172,
    },
  },
  STELLENBOSCH: {
    id: 'STELLENBOSCH',
    name: 'Stellenbosch & Cape Winelands',
    shortLabel: 'Stellenbosch / Franschhoek',
    description: 'Stellenbosch Town, Franschhoek, Paarl & Winelands Estates',
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 55,
      ZONE_PENINSULA: 85,
      ZONE_WINELANDS: 18,
      ZONE_WEST_COAST_ATLANTIS: 70,
      ZONE_WEST_COAST_LANGEBAAN: 148,
      ZONE_OVERBERG_ELGIN: 55,
      ZONE_OVERBERG_GANSBAAI: 135,
      ZONE_KAROO: 148,
    },
  },
  CPT_AIRPORT: {
    id: 'CPT_AIRPORT',
    name: 'Cape Town International Airport (CPT)',
    shortLabel: 'Airport & Transit Hub',
    description: 'Airport precinct, Hotel Verde & transit accommodations',
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 22,
      ZONE_PENINSULA: 55,
      ZONE_WINELANDS: 42,
      ZONE_WEST_COAST_ATLANTIS: 48,
      ZONE_WEST_COAST_LANGEBAAN: 138,
      ZONE_OVERBERG_ELGIN: 68,
      ZONE_OVERBERG_GANSBAAI: 145,
      ZONE_KAROO: 168,
    },
  },
  CUSTOM: {
    id: 'CUSTOM',
    name: 'Custom Hotel / Private Villa',
    shortLabel: 'Custom Hotel / Villa',
    description: 'Enter your specific Cape Town hotel or private accommodation',
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 18,
      ZONE_PENINSULA: 65,
      ZONE_WINELANDS: 70,
      ZONE_WEST_COAST_ATLANTIS: 45,
      ZONE_WEST_COAST_LANGEBAAN: 135,
      ZONE_OVERBERG_ELGIN: 75,
      ZONE_OVERBERG_GANSBAAI: 160,
      ZONE_KAROO: 180,
    },
  },
};

export const PER_KM_RATE = 11; // ZAR per km for King's private executive chauffeured transport (King pays the road tolls)

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  zone: ZoneCluster;
  activities: Activity[];
  dayCost: number;
  dayCostMin: number;
  dayCostMax: number;
  pace: 'Relaxed' | 'Balanced' | 'Full Day Adventure';
  kingNotes: string;
  oneWayKm: number;
  roundTripKm: number;
  transportCost: number;
  kmExplanation: string;
  routePath: string;
  fetchedHotelName: string;
  transportCalculated: boolean;
}

export interface DayTransportBreakdown {
  dayNumber: number;
  title: string;
  roundTripKm: number;
  transportCost: number;
  routeLabel: string;
  routePath: string;
}

export interface PricingSummary {
  guestsCount: number;
  visitorType: VisitorType;
  differentialActivitiesCount: number;
  totalDays: number;
  totalDistanceKm: number;
  departureLocationId: string;
  departureLocationName: string;
  fetchedHotelName: string;
  isTransportCalculated: boolean;
  activitiesTotal: number;
  activitiesTotalMin: number;
  activitiesTotalMax: number;
  saActivitiesTotalMin: number;
  saActivitiesTotalMax: number;
  intlActivitiesTotalMin: number;
  intlActivitiesTotalMax: number;
  baseCharterRate: number;
  ratePerKm: number;
  transportTotal: number;
  daysTransportBreakdown: DayTransportBreakdown[];
  curationFeeRate: number;
  curationFeeLabel: string;
  curationFeeTotal: number;
  curationFeeTotalMin: number;
  curationFeeTotalMax: number;
  isVip: boolean;
  vipRatePerDay: number;
  vipTotal: number;
  grandTotal: number;
  grandTotalMin: number;
  grandTotalMax: number;
}

const TIME_ORDER: Record<string, number> = {
  'Morning': 1,
  'Midday': 2,
  'Afternoon': 3,
  'Sunset / Evening': 4,
};

// Coordinates for Western Cape regional tour hubs used to compute road distance from Google Maps pickup coordinates
const ZONE_HUB_COORDINATES: Record<keyof DepartureLocation['distancesToOneWay'], { lat: number; lng: number }> = {
  ZONE_CT_CENTRAL: { lat: -33.9249, lng: 18.4241 }, // Cape Town City Bowl / Table Mountain
  ZONE_PENINSULA: { lat: -34.1952, lng: 18.4514 }, // Boulders Beach / Cape Point circuit
  ZONE_WINELANDS: { lat: -33.9321, lng: 18.8602 }, // Stellenbosch & Franschhoek
  ZONE_WEST_COAST_ATLANTIS: { lat: -33.5667, lng: 18.4833 }, // Atlantis Dunes
  ZONE_WEST_COAST_LANGEBAAN: { lat: -33.0975, lng: 18.0265 }, // Langebaan Lagoon
  ZONE_OVERBERG_ELGIN: { lat: -34.1486, lng: 19.0428 }, // Elgin Valley
  ZONE_OVERBERG_GANSBAAI: { lat: -34.5805, lng: 19.3518 }, // Gansbaai Marine Sanctuary
  ZONE_KAROO: { lat: -33.3547, lng: 19.9355 }, // Aquila Private Game Reserve (Touws River)
};

function haversineRoadKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  // Apply 1.32 Western Cape mountain/coastal road winding factor, minimum 12 km local transfer
  return Math.max(12, Math.round(straightKm * 1.32));
}

/**
 * Computes one-way road distances in km from exact Google Maps coordinates to each regional tour zone
 */
export function computeDistancesFromCoordinates(coords: {
  lat: number;
  lng: number;
}): DepartureLocation['distancesToOneWay'] {
  return {
    ZONE_CT_CENTRAL: haversineRoadKm(coords.lat, coords.lng, ZONE_HUB_COORDINATES.ZONE_CT_CENTRAL.lat, ZONE_HUB_COORDINATES.ZONE_CT_CENTRAL.lng),
    ZONE_PENINSULA: haversineRoadKm(coords.lat, coords.lng, ZONE_HUB_COORDINATES.ZONE_PENINSULA.lat, ZONE_HUB_COORDINATES.ZONE_PENINSULA.lng),
    ZONE_WINELANDS: haversineRoadKm(coords.lat, coords.lng, ZONE_HUB_COORDINATES.ZONE_WINELANDS.lat, ZONE_HUB_COORDINATES.ZONE_WINELANDS.lng),
    ZONE_WEST_COAST_ATLANTIS: haversineRoadKm(coords.lat, coords.lng, ZONE_HUB_COORDINATES.ZONE_WEST_COAST_ATLANTIS.lat, ZONE_HUB_COORDINATES.ZONE_WEST_COAST_ATLANTIS.lng),
    ZONE_WEST_COAST_LANGEBAAN: haversineRoadKm(coords.lat, coords.lng, ZONE_HUB_COORDINATES.ZONE_WEST_COAST_LANGEBAAN.lat, ZONE_HUB_COORDINATES.ZONE_WEST_COAST_LANGEBAAN.lng),
    ZONE_OVERBERG_ELGIN: haversineRoadKm(coords.lat, coords.lng, ZONE_HUB_COORDINATES.ZONE_OVERBERG_ELGIN.lat, ZONE_HUB_COORDINATES.ZONE_OVERBERG_ELGIN.lng),
    ZONE_OVERBERG_GANSBAAI: haversineRoadKm(coords.lat, coords.lng, ZONE_HUB_COORDINATES.ZONE_OVERBERG_GANSBAAI.lat, ZONE_HUB_COORDINATES.ZONE_OVERBERG_GANSBAAI.lng),
    ZONE_KAROO: haversineRoadKm(coords.lat, coords.lng, ZONE_HUB_COORDINATES.ZONE_KAROO.lat, ZONE_HUB_COORDINATES.ZONE_KAROO.lng),
  };
}

/**
 * Infers one-way zone distances from a free-text Airbnb or street address in Cape Town
 */
export function inferDistancesFromAddress(address: string): DepartureLocation['distancesToOneWay'] {
  const lower = address.toLowerCase();

  if (
    lower.includes('camps bay') ||
    lower.includes('clifton') ||
    lower.includes('bantry bay') ||
    lower.includes('fresnaye') ||
    lower.includes('llandudno') ||
    lower.includes('bakoven')
  ) {
    return DEPARTURE_LOCATIONS.CAMPS_BAY.distancesToOneWay;
  }

  if (
    lower.includes('constantia') ||
    lower.includes('newlands') ||
    lower.includes('claremont') ||
    lower.includes('bishopscourt') ||
    lower.includes('rondebosch') ||
    lower.includes('wynberg') ||
    lower.includes('tokai') ||
    lower.includes('hout bay') ||
    lower.includes('noordhoek') ||
    lower.includes('muizenberg') ||
    lower.includes('kalk bay') ||
    lower.includes('simon')
  ) {
    return DEPARTURE_LOCATIONS.SOUTHERN_SUBURBS.distancesToOneWay;
  }

  if (
    lower.includes('blouberg') ||
    lower.includes('table view') ||
    lower.includes('century city') ||
    lower.includes('milnerton') ||
    lower.includes('sunset beach') ||
    lower.includes('big bay') ||
    lower.includes('melkbos')
  ) {
    return DEPARTURE_LOCATIONS.BLOUBERG.distancesToOneWay;
  }

  if (
    lower.includes('stellenbosch') ||
    lower.includes('franschhoek') ||
    lower.includes('paarl') ||
    lower.includes('somerset west') ||
    lower.includes('durbanville')
  ) {
    return DEPARTURE_LOCATIONS.STELLENBOSCH.distancesToOneWay;
  }

  if (lower.includes('airport') || lower.includes('bellville') || lower.includes('parow')) {
    return DEPARTURE_LOCATIONS.CPT_AIRPORT.distancesToOneWay;
  }

  return DEPARTURE_LOCATIONS.CT_CBD.distancesToOneWay;
}

/**
 * Resolves hotel, Airbnb address (with optional Google Maps coordinates), or departure location
 */
export function resolveDepartureOrHotel(
  departureId: string,
  customHotelAddress: string = '',
  customCoordinates?: { lat: number; lng: number } | null
): {
  id: string;
  name: string;
  shortLabel: string;
  distances: DepartureLocation['distancesToOneWay'];
  isHotelPreset: boolean;
} | null {
  if (!departureId || !departureId.trim()) return null;

  // 1. Check if it's a hotel preset
  const hotel = findHotelById(departureId);
  if (hotel) {
    return {
      id: hotel.id,
      name: hotel.name,
      shortLabel: hotel.name,
      distances: hotel.distancesToOneWay,
      isHotelPreset: true,
    };
  }

  // 2. If Airbnb / Custom address mode, require the user to enter an address
  if (departureId === 'CUSTOM') {
    const trimmed = customHotelAddress.trim();
    if (!trimmed) return null;
    const distances = customCoordinates
      ? computeDistancesFromCoordinates(customCoordinates)
      : inferDistancesFromAddress(trimmed);
    return {
      id: 'CUSTOM',
      name: trimmed,
      shortLabel: trimmed,
      distances,
      isHotelPreset: false,
    };
  }

  // 3. Check if it's an existing regional hub
  const hub = DEPARTURE_LOCATIONS[departureId];
  if (hub) {
    return {
      id: hub.id,
      name: hub.name,
      shortLabel: hub.shortLabel,
      distances: hub.distancesToOneWay,
      isHotelPreset: false,
    };
  }

  return null;
}

/**
 * Calculates transport per km from the hotel or Airbnb where the client is fetched to destinations and back.
 * Road tolls along the route are paid by King.
 */
export function calculateDayDistanceAndTransport(
  zoneId: string,
  activities: Activity[],
  departureId: string = '',
  customHotelAddress: string = '',
  customCoordinates?: { lat: number; lng: number } | null
): {
  oneWayKm: number;
  roundTripKm: number;
  transportCost: number;
  kmExplanation: string;
  routeLabel: string;
  routePath: string;
  fetchedHotelName: string;
  transportCalculated: boolean;
} {
  const resolved = resolveDepartureOrHotel(departureId, customHotelAddress, customCoordinates);
  if (!resolved) {
    return {
      oneWayKm: 0,
      roundTripKm: 0,
      transportCost: 0,
      kmExplanation: 'Enter hotel or pickup point to calculate km',
      routeLabel: 'Scenic Tour',
      routePath: 'Hotel ➔ Destinations ➔ Hotel',
      fetchedHotelName: 'Hotel Pending',
      transportCalculated: false,
    };
  }

  const perKmRate = PER_KM_RATE;
  const hotelName = resolved.shortLabel;

  let oneWayKm = 20;
  let intraZoneKm = 10;
  let destinationName = 'Cape Town Scenic Highlights';

  switch (zoneId) {
    case 'ZONE_CT_CENTRAL':
      oneWayKm = resolved.distances.ZONE_CT_CENTRAL;
      intraZoneKm = 8;
      destinationName = 'Cape Town Central & Table Mountain';
      break;

    case 'ZONE_PENINSULA':
      oneWayKm = resolved.distances.ZONE_PENINSULA;
      intraZoneKm = 15;
      destinationName = 'Cape Peninsula, Boulders Beach & Cape Point';
      break;

    case 'ZONE_WINELANDS':
      oneWayKm = resolved.distances.ZONE_WINELANDS;
      intraZoneKm = 20;
      destinationName = 'Cape Winelands (Stellenbosch & Franschhoek)';
      break;

    case 'ZONE_WEST_COAST': {
      const hasLangebaan = activities.some((a) => a.id === 'die-strandloper');
      if (hasLangebaan) {
        oneWayKm = resolved.distances.ZONE_WEST_COAST_LANGEBAAN;
        intraZoneKm = 6;
        destinationName = 'West Coast & Langebaan Lagoon';
      } else {
        oneWayKm = resolved.distances.ZONE_WEST_COAST_ATLANTIS;
        intraZoneKm = 14;
        destinationName = 'West Coast & Atlantis Dunes';
      }
      break;
    }

    case 'ZONE_OVERBERG': {
      const hasGansbaai = activities.some((a) => a.id === 'shark-cage-diving');
      if (hasGansbaai) {
        oneWayKm = resolved.distances.ZONE_OVERBERG_GANSBAAI;
        intraZoneKm = 5;
        destinationName = 'Gansbaai Marine Sanctuary';
      } else {
        oneWayKm = resolved.distances.ZONE_OVERBERG_ELGIN;
        intraZoneKm = 10;
        destinationName = 'Elgin Valley Apple Orchards';
      }
      break;
    }

    case 'ZONE_KAROO':
      oneWayKm = resolved.distances.ZONE_KAROO;
      intraZoneKm = 5;
      destinationName = 'Aquila Private Game Reserve (Karoo)';
      break;

    default:
      oneWayKm = 25;
      intraZoneKm = 10;
      destinationName = 'Western Cape Scenic Route';
  }

  // Transport is calculated at R11/km; King pays the road tolls along the route
  const roundTripKm = Math.round(oneWayKm * 2 + intraZoneKm);
  const transportCost = Math.round((roundTripKm * perKmRate) / 10) * 10;
  const kmExplanation = `${roundTripKm} km round trip from ${hotelName} (King pays tolls)`;

  const activityNames = activities.map((a) => a.name);
  const routePath = activityNames.length > 0
    ? `${hotelName} ➔ ${activityNames.join(' ➔ ')} ➔ ${hotelName}`
    : `${hotelName} ➔ ${destinationName} ➔ ${hotelName}`;

  const routeLabel = `${hotelName} to ${destinationName} (Round Trip)`;

  return {
    oneWayKm,
    roundTripKm,
    transportCost,
    kmExplanation,
    routeLabel,
    routePath,
    fetchedHotelName: resolved.name,
    transportCalculated: true,
  };
}

/**
 * Groups selected activities into geographically sensible days
 */
export function buildOptimizedItinerary(
  selectedActivities: Activity[],
  departureId: string = 'CT_CBD',
  customHotelAddress: string = '',
  customCoordinates?: { lat: number; lng: number } | null,
  visitorType: VisitorType = 'INTERNATIONAL'
): ItineraryDay[] {
  if (selectedActivities.length === 0) return [];

  const zoneGroups: Record<string, Activity[]> = {};
  selectedActivities.forEach((act) => {
    if (!zoneGroups[act.zoneId]) {
      zoneGroups[act.zoneId] = [];
    }
    zoneGroups[act.zoneId].push(act);
  });

  Object.keys(zoneGroups).forEach((zoneKey) => {
    zoneGroups[zoneKey].sort((a, b) => {
      const orderA = TIME_ORDER[a.recommendedSlot] || 2;
      const orderB = TIME_ORDER[b.recommendedSlot] || 2;
      return orderA - orderB;
    });
  });

  const zoneOrderPreference = [
    'ZONE_CT_CENTRAL',
    'ZONE_PENINSULA',
    'ZONE_WINELANDS',
    'ZONE_WEST_COAST',
    'ZONE_OVERBERG',
    'ZONE_KAROO',
  ];

  const days: ItineraryDay[] = [];
  let currentDayNum = 1;

  zoneOrderPreference.forEach((zoneKey) => {
    const activitiesInZone = zoneGroups[zoneKey];
    if (!activitiesInZone || activitiesInZone.length === 0) return;

    const zoneInfo = REGIONAL_ZONES[zoneKey] || {
      id: zoneKey,
      name: 'Western Cape Region',
      description: 'Scenic regional tour',
      approxDistance: 'Variable',
    };

    if (activitiesInZone.length > 3) {
      const chunk1 = activitiesInZone.slice(0, 3);
      const chunk2 = activitiesInZone.slice(3);

      const trans1 = calculateDayDistanceAndTransport(zoneKey, chunk1, departureId, customHotelAddress, customCoordinates);
      days.push({
        dayNumber: currentDayNum++,
        title: `Day ${currentDayNum - 1}: ${zoneInfo.name} (Part 1)`,
        zone: zoneInfo,
        activities: chunk1,
        dayCost: chunk1.reduce((sum, item) => sum + getActivityPricesForVisitor(item, visitorType).priceZAR, 0),
        dayCostMin: chunk1.reduce((sum, item) => sum + getActivityPricesForVisitor(item, visitorType).priceMin, 0),
        dayCostMax: chunk1.reduce((sum, item) => sum + getActivityPricesForVisitor(item, visitorType).priceMax, 0),
        pace: 'Balanced',
        kingNotes: getKingNotes(zoneKey, chunk1.length),
        oneWayKm: trans1.oneWayKm,
        roundTripKm: trans1.roundTripKm,
        transportCost: trans1.transportCost,
        kmExplanation: trans1.kmExplanation,
        routePath: trans1.routePath,
        fetchedHotelName: trans1.fetchedHotelName,
        transportCalculated: trans1.transportCalculated,
      });

      const trans2 = calculateDayDistanceAndTransport(zoneKey, chunk2, departureId, customHotelAddress, customCoordinates);
      days.push({
        dayNumber: currentDayNum++,
        title: `Day ${currentDayNum - 1}: ${zoneInfo.name} (Part 2)`,
        zone: zoneInfo,
        activities: chunk2,
        dayCost: chunk2.reduce((sum, item) => sum + getActivityPricesForVisitor(item, visitorType).priceZAR, 0),
        dayCostMin: chunk2.reduce((sum, item) => sum + getActivityPricesForVisitor(item, visitorType).priceMin, 0),
        dayCostMax: chunk2.reduce((sum, item) => sum + getActivityPricesForVisitor(item, visitorType).priceMax, 0),
        pace: chunk2.length > 2 ? 'Balanced' : 'Relaxed',
        kingNotes: getKingNotes(zoneKey, chunk2.length),
        oneWayKm: trans2.oneWayKm,
        roundTripKm: trans2.roundTripKm,
        transportCost: trans2.transportCost,
        kmExplanation: trans2.kmExplanation,
        routePath: trans2.routePath,
        fetchedHotelName: trans2.fetchedHotelName,
        transportCalculated: trans2.transportCalculated,
      });
    } else {
      const trans = calculateDayDistanceAndTransport(zoneKey, activitiesInZone, departureId, customHotelAddress, customCoordinates);
      days.push({
        dayNumber: currentDayNum++,
        title: `Day ${currentDayNum - 1}: ${zoneInfo.name}`,
        zone: zoneInfo,
        activities: activitiesInZone,
        dayCost: activitiesInZone.reduce((sum, item) => sum + getActivityPricesForVisitor(item, visitorType).priceZAR, 0),
        dayCostMin: activitiesInZone.reduce((sum, item) => sum + getActivityPricesForVisitor(item, visitorType).priceMin, 0),
        dayCostMax: activitiesInZone.reduce((sum, item) => sum + getActivityPricesForVisitor(item, visitorType).priceMax, 0),
        pace: activitiesInZone.length === 1 ? 'Relaxed' : activitiesInZone.length === 2 ? 'Balanced' : 'Full Day Adventure',
        kingNotes: getKingNotes(zoneKey, activitiesInZone.length),
        oneWayKm: trans.oneWayKm,
        roundTripKm: trans.roundTripKm,
        transportCost: trans.transportCost,
        kmExplanation: trans.kmExplanation,
        routePath: trans.routePath,
        fetchedHotelName: trans.fetchedHotelName,
        transportCalculated: trans.transportCalculated,
      });
    }
  });

  return days;
}

function getKingNotes(zoneKey: string, _count: number): string {
  switch (zoneKey) {
    case 'ZONE_WINELANDS':
      return 'King recommends an 08:30 departure from your hotel to beat the N1 traffic and enjoy unhurried vineyard visits across Stellenbosch & Franschhoek. King covers any road tolls; food & meals are for the guest’s own account.';
    case 'ZONE_WEST_COAST':
      return 'Bring sunscreen, sunglasses, and a windbreaker. King will have bottled water in the vehicle for the Atlantis sands and coastal drive. (Food & meals are for the guest’s own account.)';
    case 'ZONE_PENINSULA':
      return "Spectacular coastal drive along Chapman's Peak Drive — King pays the Chapman's Peak road toll and times the penguin visit at Boulders Beach before midday crowds arrive. (Food & meals are for the guest's own account.)";
    case 'ZONE_CT_CENTRAL':
      return 'King monitors Table Mountain wind and cableway queues in real-time, coordinating departure to match the clearest sky conditions.';
    case 'ZONE_KAROO':
      return 'Early 06:15 executive pickup for the scenic route into the Karoo. King pays the Huguenot Tunnel road tolls on your behalf (food & meals outside safari inclusions are for the guest’s own account).';
    case 'ZONE_OVERBERG':
      return 'Scenic coastal route past Gordon’s Bay and Hermanus cliff paths. King covers road tolls along the route; food & meals are for the guest’s own account.';
    default:
      return 'King handles private chauffeured transport, route timing coordination, and pays all road tolls along the route. (Food & meals are for the guest’s own account.)';
  }
}

export const CONCIERGE_THRESHOLD = 10000;

/**
 * Computes Concierge Fee:
 * - For subtotals > R10,000: calculated at 8%
 * - For subtotals <= R10,000: calculated at 10% (max R1,000)
 */
export function calculateConciergeFee(subtotal: number): {
  fee: number;
  rate: number;
} {
  if (subtotal > CONCIERGE_THRESHOLD) {
    return {
      fee: Math.round(subtotal * 0.08),
      rate: 0.08,
    };
  }
  return {
    fee: Math.min(1000, Math.round(subtotal * 0.10)),
    rate: 0.10,
  };
}

/**
 * Calculates financial breakdown with:
 * - SA Resident vs International Tourist tiered activity pricing
 * - Transport calculated at R11/km round-trip (King pays road tolls)
 * - Concierge Fee: 10% up to R10,000, and 8% for totals over R10,000
 */
export function calculatePricing(
  activities: Activity[],
  daysOrCount: number | ItineraryDay[],
  guestsCount: number = 1,
  isVip: boolean = false,
  departureId: string = '',
  customHotelAddress: string = '',
  customCoordinates?: { lat: number; lng: number } | null,
  visitorType: VisitorType = 'INTERNATIONAL'
): PricingSummary {
  const safeGuests = Math.max(1, guestsCount);
  const resolved = resolveDepartureOrHotel(departureId, customHotelAddress, customCoordinates);
  const isTransportCalculated = Boolean(resolved !== null);

  const itineraryDays = Array.isArray(daysOrCount)
    ? daysOrCount
    : buildOptimizedItinerary(activities, departureId, customHotelAddress, customCoordinates, visitorType);

  const totalDays = Math.max(1, itineraryDays.length);

  let activitiesTotalMin = 0;
  let activitiesTotalMax = 0;
  let activitiesTotal = 0;
  let saActivitiesTotalMin = 0;
  let saActivitiesTotalMax = 0;
  let intlActivitiesTotalMin = 0;
  let intlActivitiesTotalMax = 0;
  let differentialActivitiesCount = 0;

  activities.forEach((act) => {
    const resolvedPrices = getActivityPricesForVisitor(act, visitorType);
    activitiesTotalMin += resolvedPrices.priceMin * safeGuests;
    activitiesTotalMax += resolvedPrices.priceMax * safeGuests;
    activitiesTotal += resolvedPrices.priceZAR * safeGuests;

    saActivitiesTotalMin += resolvedPrices.saMin * safeGuests;
    saActivitiesTotalMax += resolvedPrices.saMax * safeGuests;
    intlActivitiesTotalMin += resolvedPrices.intlMin * safeGuests;
    intlActivitiesTotalMax += resolvedPrices.intlMax * safeGuests;

    if (resolvedPrices.isDifferential) {
      differentialActivitiesCount++;
    }
  });

  const daysTransportBreakdown: DayTransportBreakdown[] = itineraryDays.map((d) => ({
    dayNumber: d.dayNumber,
    title: d.title,
    roundTripKm: d.roundTripKm,
    transportCost: d.transportCost,
    routeLabel: d.kmExplanation,
    routePath: d.routePath,
  }));

  const totalDistanceKm = isTransportCalculated
    ? daysTransportBreakdown.reduce((sum, item) => sum + item.roundTripKm, 0)
    : 0;
  const transportTotal = isTransportCalculated
    ? daysTransportBreakdown.reduce((sum, item) => sum + item.transportCost, 0)
    : 0;

  // Concierge Fee: 10% up to R10,000, or 8% when subtotal > R10,000
  const subtotalAvg = activitiesTotal + transportTotal;
  const subtotalMin = activitiesTotalMin + transportTotal;
  const subtotalMax = activitiesTotalMax + transportTotal;

  const avgConcierge = calculateConciergeFee(subtotalAvg);
  const minConcierge = calculateConciergeFee(subtotalMin);
  const maxConcierge = calculateConciergeFee(subtotalMax);

  const curationFeeRate = subtotalMax > CONCIERGE_THRESHOLD ? 0.08 : avgConcierge.rate;
  const curationFeeLabel =
    subtotalMin > CONCIERGE_THRESHOLD
      ? '8% (Over R10,000)'
      : subtotalMax > CONCIERGE_THRESHOLD
      ? '10% (≤ R10k) · 8% (> R10k)'
      : '10% (Up to R10k · 8% over R10k)';

  const curationFeeTotal = avgConcierge.fee;
  const curationFeeTotalMin = Math.min(minConcierge.fee, maxConcierge.fee);
  const curationFeeTotalMax = Math.max(minConcierge.fee, maxConcierge.fee);

  const vipRatePerDay = 450;
  const vipTotal = isVip ? totalDays * vipRatePerDay : 0;

  const grandTotal = activitiesTotal + transportTotal + curationFeeTotal + vipTotal;
  const grandTotalMin = activitiesTotalMin + transportTotal + minConcierge.fee + vipTotal;
  const grandTotalMax = activitiesTotalMax + transportTotal + maxConcierge.fee + vipTotal;

  return {
    guestsCount: safeGuests,
    visitorType,
    differentialActivitiesCount,
    totalDays,
    totalDistanceKm,
    departureLocationId: resolved ? resolved.id : '',
    departureLocationName: resolved ? resolved.name : 'Pending Hotel / Pickup Location',
    fetchedHotelName: resolved ? resolved.name : 'Hotel Pending',
    isTransportCalculated,
    activitiesTotal,
    activitiesTotalMin,
    activitiesTotalMax,
    saActivitiesTotalMin,
    saActivitiesTotalMax,
    intlActivitiesTotalMin,
    intlActivitiesTotalMax,
    baseCharterRate: 0,
    ratePerKm: PER_KM_RATE,
    transportTotal,
    daysTransportBreakdown,
    curationFeeRate,
    curationFeeLabel,
    curationFeeTotal,
    curationFeeTotalMin,
    curationFeeTotalMax,
    isVip,
    vipRatePerDay,
    vipTotal,
    grandTotal,
    grandTotalMin,
    grandTotalMax,
  };
}

/**
 * Formats WhatsApp message for direct submission to King
 */
export function formatWhatsAppMessage(
  clientName: string,
  clientPhone: string,
  clientEmail: string,
  travelDates: string,
  pickupLocation: string,
  itinerary: ItineraryDay[],
  pricing: PricingSummary
): string {
  const visitorLabel =
    pricing.visitorType === 'SA_RESIDENT'
      ? 'South African Resident (with SA ID)'
      : 'International Tourist';

  let message = `*TRAVELING WITH KING - TOUR BOOKING INQUIRY*\n`;
  message += `*STATUS: AWAITING KING'S CONFIRMATION*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  message += `*CLIENT & TRIP DETAILS*\n`;
  message += `• Name: ${clientName || 'Valued Guest'}\n`;
  if (clientPhone) message += `• Phone: ${clientPhone}\n`;
  if (clientEmail) message += `• Client Email: ${clientEmail} (Confirmation email sent automatically)\n`;
  if (travelDates) message += `• Travel Dates: ${travelDates}\n`;
  message += `• Pickup Location: ${pickupLocation || pricing.fetchedHotelName || pricing.departureLocationName || 'Cape Town Hotel / Airbnb'}\n`;
  message += `• Guests: ${pricing.guestsCount} travelers (${visitorLabel})\n`;
  if (pricing.isTransportCalculated) {
    message += `• Total Round-Trip Distance: ${pricing.totalDistanceKm} km across ${pricing.totalDays} touring days\n`;
  }
  message += `\n`;

  message += `*OPTIMIZED ITINERARY (${pricing.totalDays} DAYS)*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  itinerary.forEach((day) => {
    message += `*Day ${day.dayNumber}: ${day.title}*\n`;
    message += `• Region: ${day.zone.name}\n`;
    if (day.transportCalculated) {
      message += `• Route: ${day.routePath || day.kmExplanation}\n`;
      message += `• Daily Distance: ${day.roundTripKm} km round trip (R${day.transportCost.toLocaleString()} chauffeured transfer · King pays road tolls)\n`;
    }
    message += `• Experiences:\n`;
    day.activities.forEach((act) => {
      const resolved = getActivityPricesForVisitor(act, pricing.visitorType);
      const priceText =
        resolved.priceMin !== resolved.priceMax
          ? `R${resolved.priceMin.toLocaleString()} - R${resolved.priceMax.toLocaleString()}`
          : `R${resolved.priceZAR.toLocaleString()}`;
      message += `   - ${act.name} (${act.recommendedSlot} · ${priceText} pp)\n`;
    });
    message += `\n`;
  });

  message += `*FINANCIAL SUMMARY*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `• Activity Entry & Conservation Fees (${visitorLabel}): R${pricing.activitiesTotalMin.toLocaleString()} - R${pricing.activitiesTotalMax.toLocaleString()}\n`;
  message += `• Private Chauffeured Transport (${pricing.totalDays} Days): R${pricing.transportTotal.toLocaleString()} (${pricing.totalDistanceKm} km @ R${pricing.ratePerKm}/km · King pays tolls)\n`;
  message += `• Concierge Fee (${pricing.curationFeeLabel}): R${pricing.curationFeeTotalMin.toLocaleString()} - R${pricing.curationFeeTotalMax.toLocaleString()}\n`;
  message += `• *TOTAL ESTIMATED COST*: *R${pricing.grandTotalMin.toLocaleString()} - R${pricing.grandTotalMax.toLocaleString()}*\n\n`;

  message += `_Note: King pays all road tolls along your route. Food/meals are not arranged by King and are for the guest's own account. Prices may vary according to peak season rates._\n\n`;
  message += `Please confirm vehicle availability for these dates. Thank you!`;

  return message;
}

/**
 * Formats Confirmation Email subject & body for the client awaiting King's confirmation
 */
export function formatConfirmationEmail(
  bookingReference: string,
  clientName: string,
  clientPhone: string,
  clientEmail: string,
  travelDates: string,
  pickupLocation: string,
  itinerary: ItineraryDay[],
  pricing: PricingSummary
): {
  fromEmail: string;
  fromName: string;
  toEmail: string;
  subject: string;
  body: string;
} {
  const fromEmail = 'lerato@marubcreations.co.za';
  const fromName = 'Traveling with King';
  const toEmail = clientEmail ? clientEmail.trim() : '';

  const visitorLabel =
    pricing.visitorType === 'SA_RESIDENT'
      ? 'South African Resident (with SA ID)'
      : 'International Tourist';

  const subject = `Booking Confirmation (${bookingReference}) - Traveling with King [Awaiting King's Confirmation]`;

  let body = `Dear ${clientName || 'Valued Guest'},\n\n`;
  body += `Thank you for booking your bespoke Cape Town & Western Cape private tour with Traveling with King.\n\n`;
  body += `BOOKING STATUS: AWAITING KING'S CONFIRMATION\n`;
  body += `• Reference: ${bookingReference}\n`;
  body += `• Direct Contact / WhatsApp: 060 648 7486\n`;
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  body += `RESERVATION & PICKUP DETAILS\n`;
  body += `• Guest Name: ${clientName || 'Valued Guest'}\n`;
  body += `• Contact Number: ${clientPhone || 'Provided'}\n`;
  body += `• Email Address: ${toEmail || 'Provided'}\n`;
  body += `• Travel Dates: ${travelDates}\n`;
  body += `• Pickup Location (Hotel / Airbnb): ${pickupLocation || pricing.fetchedHotelName || pricing.departureLocationName}\n`;
  body += `• Party Size: ${pricing.guestsCount} ${pricing.guestsCount === 1 ? 'Traveler' : 'Travelers'} (${visitorLabel})\n`;
  if (pricing.isTransportCalculated) {
    body += `• Total Calculated Route Distance: ${pricing.totalDistanceKm} km round trip across ${pricing.totalDays} ${pricing.totalDays === 1 ? 'day' : 'days'}\n`;
  }
  body += `\n`;

  body += `YOUR DAILY ITINERARY & ROUTE BREAKDOWN\n`;
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  itinerary.forEach((day) => {
    body += `\n${day.title} (${day.zone.name})\n`;
    if (day.transportCalculated) {
      body += `Route: ${day.routePath || day.kmExplanation}\n`;
      body += `Distance: ${day.roundTripKm} km round trip (R${day.transportCost.toLocaleString()} · King pays road tolls)\n`;
    }
    day.activities.forEach((act) => {
      const resolved = getActivityPricesForVisitor(act, pricing.visitorType);
      const priceText =
        resolved.priceMin !== resolved.priceMax
          ? `R${resolved.priceMin.toLocaleString()} - R${resolved.priceMax.toLocaleString()}`
          : `R${resolved.priceZAR.toLocaleString()}`;
      body += `  • ${act.name} (${act.recommendedSlot} · ${act.duration} · ${priceText} pp)\n`;
    });
  });

  body += `\nESTIMATED COST BREAKDOWN\n`;
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `• Activity Entrance & Conservation Fees (${visitorLabel}): R${pricing.activitiesTotalMin.toLocaleString()} - R${pricing.activitiesTotalMax.toLocaleString()}\n`;
  body += `• Dedicated Private Transport (${pricing.totalDistanceKm} km round trip @ R${pricing.ratePerKm}/km · King pays road tolls): R${pricing.transportTotal.toLocaleString()}\n`;
  body += `• Concierge Fee (${pricing.curationFeeLabel}): R${pricing.curationFeeTotalMin.toLocaleString()} - R${pricing.curationFeeTotalMax.toLocaleString()}\n`;
  body += `• ESTIMATED COST: R${pricing.grandTotalMin.toLocaleString()} - R${pricing.grandTotalMax.toLocaleString()}\n\n`;
  body += `IMPORTANT NOTE: King pays all road tolls along your route. Food/meals are not arranged by King and are for the guest's own account.\n\n`;

  body += `NEXT STEPS:\n`;
  body += `Your booking details have been saved and dispatched to King and are currently awaiting final schedule confirmation. We will reach out to you directly via WhatsApp/Phone (060 648 7486) or email to finalize your pickup time.\n\n`;
  body += `Warm regards,\n\n`;
  body += `Traveling with King Private Chauffeur & Tours\n`;
  body += `Direct / WhatsApp: 060 648 7486\n`;
  body += `Cape Town, South Africa`;

  return { fromEmail, fromName, toEmail, subject, body };
}


