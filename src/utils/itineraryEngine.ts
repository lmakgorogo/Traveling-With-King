import { Activity, REGIONAL_ZONES, ZoneCluster } from '../data/activities';

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  zone: ZoneCluster;
  activities: Activity[];
  dayCost: number;
  pace: 'Relaxed' | 'Balanced' | 'Full Day Adventure';
  kingNotes: string;
}

export interface PricingSummary {
  guestsCount: number;
  totalDays: number;
  activitiesTotal: number;
  transportDayRate: number;
  transportTotal: number;
  curationFeeRate: number;
  curationFeeTotal: number;
  isVip: boolean;
  vipRatePerDay: number;
  vipTotal: number;
  grandTotal: number;
}

const TIME_ORDER: Record<string, number> = {
  'Morning': 1,
  'Midday': 2,
  'Afternoon': 3,
  'Sunset / Evening': 4,
};

/**
 * Groups selected activities into geographically sensible days
 */
export function buildOptimizedItinerary(selectedActivities: Activity[]): ItineraryDay[] {
  if (selectedActivities.length === 0) return [];

  // Group by zoneId
  const zoneGroups: Record<string, Activity[]> = {};
  selectedActivities.forEach((act) => {
    if (!zoneGroups[act.zoneId]) {
      zoneGroups[act.zoneId] = [];
    }
    zoneGroups[act.zoneId].push(act);
  });

  // Sort activities inside each zone by optimal time slot
  Object.keys(zoneGroups).forEach((zoneKey) => {
    zoneGroups[zoneKey].sort((a, b) => {
      const orderA = TIME_ORDER[a.recommendedSlot] || 2;
      const orderB = TIME_ORDER[b.recommendedSlot] || 2;
      return orderA - orderB;
    });
  });

  // Ideal sequence of zones for multi-day travelers in Western Cape
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

    // If there are more than 3 activities in one zone, split into 2 days to maintain luxury pace
    if (activitiesInZone.length > 3) {
      const chunk1 = activitiesInZone.slice(0, 3);
      const chunk2 = activitiesInZone.slice(3);

      days.push({
        dayNumber: currentDayNum++,
        title: `Day ${currentDayNum - 1}: ${zoneInfo.name} (Part 1)`,
        zone: zoneInfo,
        activities: chunk1,
        dayCost: chunk1.reduce((sum, item) => sum + item.priceZAR, 0),
        pace: 'Balanced',
        kingNotes: getKingNotes(zoneKey, chunk1.length),
      });

      days.push({
        dayNumber: currentDayNum++,
        title: `Day ${currentDayNum - 1}: ${zoneInfo.name} (Part 2)`,
        zone: zoneInfo,
        activities: chunk2,
        dayCost: chunk2.reduce((sum, item) => sum + item.priceZAR, 0),
        pace: chunk2.length > 2 ? 'Balanced' : 'Relaxed',
        kingNotes: getKingNotes(zoneKey, chunk2.length),
      });
    } else {
      days.push({
        dayNumber: currentDayNum++,
        title: `Day ${currentDayNum - 1}: ${zoneInfo.name}`,
        zone: zoneInfo,
        activities: activitiesInZone,
        dayCost: activitiesInZone.reduce((sum, item) => sum + item.priceZAR, 0),
        pace: activitiesInZone.length === 1 ? 'Relaxed' : activitiesInZone.length === 2 ? 'Balanced' : 'Full Day Adventure',
        kingNotes: getKingNotes(zoneKey, activitiesInZone.length),
      });
    }
  });

  return days;
}

function getKingNotes(zoneKey: string, count: number): string {
  switch (zoneKey) {
    case 'ZONE_WINELANDS':
      return 'King recommends an 08:30 departure from your hotel to beat the N1 traffic and savor unhurried tastings across Stellenbosch & Franschhoek valleys.';
    case 'ZONE_WEST_COAST':
      return 'Bring sunscreen, sunglasses, and a windbreaker. King will have fresh water in the vehicle for the Atlantis sands and coastal breeze.';
    case 'ZONE_PENINSULA':
      return "Spectacular coastal drive along Chapman's Peak. King will time the penguin visit at Boulders Beach before midday crowds arrive.";
    case 'ZONE_CT_CENTRAL':
      return 'King monitors Table Mountain wind and cableway queues in real-time, coordinating departure to match the clearest sky conditions.';
    case 'ZONE_KAROO':
      return 'Early 06:15 executive pickup for the scenic Du Toitskloof pass into the Karoo. Breakfast stop en route arranged by King.';
    case 'ZONE_OVERBERG':
      return 'Scenic coastal route past Gordon’s Bay and Hermanus cliff paths. King handles all road tolls and marine transfer check-ins.';
    default:
      return 'King handles all private transport, parking arrangements, and timing coordination so you can simply relax and take in the views.';
  }
}

/**
 * Calculates financial breakdown
 */
export function calculatePricing(
  activities: Activity[],
  daysCount: number,
  guestsCount: number = 1,
  isVip: boolean = false
): PricingSummary {
  const safeGuests = Math.max(1, guestsCount);
  const totalDays = Math.max(1, daysCount);
  
  // Total activities entry / tasting fee multiplied by guests
  const activitiesTotal = activities.reduce((sum, act) => sum + act.priceZAR * safeGuests, 0);

  // Baseline day-rate for King (per vehicle per day, covers up to 6 guests in luxury van)
  const transportDayRate = 1500;
  const transportTotal = totalDays * transportDayRate;

  // 12% Itinerary curation & booking convenience fee
  const curationFeeRate = 0.12;
  const curationFeeTotal = Math.round((activitiesTotal + transportTotal) * curationFeeRate);

  // VIP Package: R450 per day (includes priority booking reservations, fast-track coordination, and executive service)
  const vipRatePerDay = 450;
  const vipTotal = isVip ? totalDays * vipRatePerDay : 0;

  const grandTotal = activitiesTotal + transportTotal + curationFeeTotal + vipTotal;

  return {
    guestsCount: safeGuests,
    totalDays,
    activitiesTotal,
    transportDayRate,
    transportTotal,
    curationFeeRate,
    curationFeeTotal,
    isVip,
    vipRatePerDay,
    vipTotal,
    grandTotal,
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
  const header = `👑 *TRAVELING WITH KING — BESPOKE ITINERARY BOOKING* 👑\n`;
  const clientInfo = `\n📋 *CLIENT DETAILS:*\n• *Name:* ${clientName || 'Private Guest'}\n• *Contact / WhatsApp:* ${clientPhone || 'Not provided'}\n• *Email:* ${clientEmail || 'Not provided'}\n• *Travel Dates:* ${travelDates || 'Flexible / To be confirmed'}\n• *Number of Guests:* ${pricing.guestsCount}\n• *Pickup Location:* ${pickupLocation || 'Cape Town Hotel / Villa'}\n`;

  let schedule = `\n🗓️ *OPTIMIZED ITINERARY (${pricing.totalDays} DAYS):*\n`;
  itinerary.forEach((day) => {
    schedule += `\n*${day.title}* (${day.zone.approxDistance})\n`;
    day.activities.forEach((act) => {
      schedule += `  ▫️ ${act.name} [${act.recommendedSlot}] — R${act.priceZAR.toLocaleString()} pp\n`;
    });
  });

  const costBreakdown = `\n💰 *PRICE BREAKDOWN (ZAR):*\n• Activities & Entries (${pricing.guestsCount} guests): R${pricing.activitiesTotal.toLocaleString()}\n• King's 7-Seater Suzuki Transport (${pricing.totalDays} Days @ R${pricing.transportDayRate}/day): R${pricing.transportTotal.toLocaleString()}\n• Itinerary Curation Fee (12%): R${pricing.curationFeeTotal.toLocaleString()}\n• VIP Executive Package: ${pricing.isVip ? `R${pricing.vipTotal.toLocaleString()} (Included)` : 'Standard Private'}\n----------------------------------\n*ESTIMATED TOTAL: R${pricing.grandTotal.toLocaleString()} ZAR*\n`;

  const closing = `\nHi King, I crafted this multi-day Western Cape journey on your website for your 7-seater Suzuki and would love to confirm your availability for these dates!`;

  return `${header}${clientInfo}${schedule}${costBreakdown}${closing}`;
}
