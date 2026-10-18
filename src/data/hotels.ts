export interface HotelPreset {
  id: string;
  name: string;
  area: string;
  category: 'V&A Waterfront' | 'Atlantic Seaboard' | 'City Bowl' | 'Constantia & South' | 'Winelands' | 'Airport & Transit';
  address: string;
  description: string;
  starRating?: number;
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

export const CAPE_TOWN_HOTELS: HotelPreset[] = [
  // V&A Waterfront & Foreshore
  {
    id: 'silo-hotel',
    name: 'The Silo Hotel',
    area: 'V&A Waterfront / Silo District',
    category: 'V&A Waterfront',
    address: 'Silo Square, V&A Waterfront, Cape Town',
    description: 'Iconic luxury architectural marvel above the Zeitz MOCAA with panoramic harbour views',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 12,
      ZONE_PENINSULA: 62,
      ZONE_WINELANDS: 68,
      ZONE_WEST_COAST_ATLANTIS: 44,
      ZONE_WEST_COAST_LANGEBAAN: 132,
      ZONE_OVERBERG_ELGIN: 74,
      ZONE_OVERBERG_GANSBAAI: 158,
      ZONE_KAROO: 178,
    },
  },
  {
    id: 'one-and-only',
    name: 'One&Only Cape Town',
    area: 'V&A Waterfront Marina',
    category: 'V&A Waterfront',
    address: 'Dock Road, Victoria & Alfred Waterfront, Cape Town',
    description: 'Premier urban island resort overlooking Table Mountain with private marina waterways',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 14,
      ZONE_PENINSULA: 63,
      ZONE_WINELANDS: 69,
      ZONE_WEST_COAST_ATLANTIS: 45,
      ZONE_WEST_COAST_LANGEBAAN: 134,
      ZONE_OVERBERG_ELGIN: 75,
      ZONE_OVERBERG_GANSBAAI: 160,
      ZONE_KAROO: 180,
    },
  },
  {
    id: 'cape-grace',
    name: 'Cape Grace, A Fairmont Managed Hotel',
    area: 'V&A Waterfront Quay',
    category: 'V&A Waterfront',
    address: 'West Quay Road, V&A Waterfront, Cape Town',
    description: 'Classic heritage luxury set on a private quay in the historic working harbour',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 13,
      ZONE_PENINSULA: 62,
      ZONE_WINELANDS: 68,
      ZONE_WEST_COAST_ATLANTIS: 45,
      ZONE_WEST_COAST_LANGEBAAN: 133,
      ZONE_OVERBERG_ELGIN: 74,
      ZONE_OVERBERG_GANSBAAI: 159,
      ZONE_KAROO: 179,
    },
  },
  {
    id: 'radisson-red',
    name: 'Radisson RED Hotel',
    area: 'V&A Waterfront Silo District',
    category: 'V&A Waterfront',
    address: 'Silo 6, Silo Square, V&A Waterfront, Cape Town',
    description: 'Vibrant modern lifestyle hotel with rooftop pool and Table Mountain panorama',
    starRating: 4,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 12,
      ZONE_PENINSULA: 62,
      ZONE_WINELANDS: 68,
      ZONE_WEST_COAST_ATLANTIS: 44,
      ZONE_WEST_COAST_LANGEBAAN: 132,
      ZONE_OVERBERG_ELGIN: 74,
      ZONE_OVERBERG_GANSBAAI: 158,
      ZONE_KAROO: 178,
    },
  },
  {
    id: 'the-westin',
    name: 'The Westin Cape Town',
    area: 'Foreshore & CTICC',
    category: 'V&A Waterfront',
    address: 'Convention Square, 1 Lower Long St, Cape Town',
    description: 'Five-star convention and business luxury hotel at the gateway to the V&A Waterfront',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 10,
      ZONE_PENINSULA: 60,
      ZONE_WINELANDS: 66,
      ZONE_WEST_COAST_ATLANTIS: 42,
      ZONE_WEST_COAST_LANGEBAAN: 130,
      ZONE_OVERBERG_ELGIN: 72,
      ZONE_OVERBERG_GANSBAAI: 156,
      ZONE_KAROO: 175,
    },
  },

  // Atlantic Seaboard & Camps Bay
  {
    id: 'twelve-apostles',
    name: 'The Twelve Apostles Hotel & Spa',
    area: 'Camps Bay / Victoria Road',
    category: 'Atlantic Seaboard',
    address: 'Victoria Road, Camps Bay, Cape Town',
    description: 'Dramatic coastal sanctuary flanked by the Twelve Apostles mountain peaks and Atlantic surf',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 18,
      ZONE_PENINSULA: 48,
      ZONE_WINELANDS: 82,
      ZONE_WEST_COAST_ATLANTIS: 56,
      ZONE_WEST_COAST_LANGEBAAN: 146,
      ZONE_OVERBERG_ELGIN: 86,
      ZONE_OVERBERG_GANSBAAI: 168,
      ZONE_KAROO: 192,
    },
  },
  {
    id: 'ellerman-house',
    name: 'Ellerman House',
    area: 'Bantry Bay',
    category: 'Atlantic Seaboard',
    address: '180 Kloof Road, Bantry Bay, Cape Town',
    description: 'Exclusive private cliffside mansion boasting world-class South African art and private cellars',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 14,
      ZONE_PENINSULA: 56,
      ZONE_WINELANDS: 75,
      ZONE_WEST_COAST_ATLANTIS: 50,
      ZONE_WEST_COAST_LANGEBAAN: 140,
      ZONE_OVERBERG_ELGIN: 80,
      ZONE_OVERBERG_GANSBAAI: 164,
      ZONE_KAROO: 186,
    },
  },
  {
    id: 'the-bay-hotel',
    name: 'The Bay Hotel',
    area: 'Camps Bay Beachfront',
    category: 'Atlantic Seaboard',
    address: '69 Victoria Road, Camps Bay, Cape Town',
    description: 'Prime beachfront luxury steps away from the vibrant Camps Bay palm promenade',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 15,
      ZONE_PENINSULA: 52,
      ZONE_WINELANDS: 78,
      ZONE_WEST_COAST_ATLANTIS: 52,
      ZONE_WEST_COAST_LANGEBAAN: 142,
      ZONE_OVERBERG_ELGIN: 82,
      ZONE_OVERBERG_GANSBAAI: 166,
      ZONE_KAROO: 188,
    },
  },
  {
    id: 'tintswalo-atlantic',
    name: 'Tintswalo Atlantic',
    area: 'Hout Bay / Chapman\'s Peak',
    category: 'Atlantic Seaboard',
    address: 'Chapman\'s Peak Drive, Hout Bay, Cape Town',
    description: 'Secluded seaside boutique lodge tucked on the shores of Table Mountain National Park',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 26,
      ZONE_PENINSULA: 38,
      ZONE_WINELANDS: 78,
      ZONE_WEST_COAST_ATLANTIS: 62,
      ZONE_WEST_COAST_LANGEBAAN: 152,
      ZONE_OVERBERG_ELGIN: 78,
      ZONE_OVERBERG_GANSBAAI: 156,
      ZONE_KAROO: 190,
    },
  },

  // City Bowl & Gardens
  {
    id: 'mount-nelson',
    name: 'Mount Nelson, A Belmond Hotel',
    area: 'Gardens / City Bowl',
    category: 'City Bowl',
    address: '76 Orange Street, Gardens, Cape Town',
    description: 'Storied pink haven set in lush heritage gardens at the foot of Table Mountain',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 8,
      ZONE_PENINSULA: 58,
      ZONE_WINELANDS: 68,
      ZONE_WEST_COAST_ATLANTIS: 46,
      ZONE_WEST_COAST_LANGEBAAN: 135,
      ZONE_OVERBERG_ELGIN: 72,
      ZONE_OVERBERG_GANSBAAI: 156,
      ZONE_KAROO: 176,
    },
  },
  {
    id: 'taj-cape-town',
    name: 'Taj Cape Town',
    area: 'City Bowl Heritage Precinct',
    category: 'City Bowl',
    address: '1 Wale Street, corner St Georges Mall, Cape Town',
    description: 'Grand historic architecture across from St George’s Cathedral and Company’s Garden',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 7,
      ZONE_PENINSULA: 59,
      ZONE_WINELANDS: 66,
      ZONE_WEST_COAST_ATLANTIS: 44,
      ZONE_WEST_COAST_LANGEBAAN: 133,
      ZONE_OVERBERG_ELGIN: 70,
      ZONE_OVERBERG_GANSBAAI: 154,
      ZONE_KAROO: 174,
    },
  },

  // Southern Suburbs & Constantia
  {
    id: 'steenberg-hotel',
    name: 'Steenberg Hotel & Spa',
    area: 'Constantia Wine Valley',
    category: 'Constantia & South',
    address: 'Steenberg Estate, Steenberg Road, Tokai, Cape Town',
    description: 'Heritage estate retreat in South Africa\'s oldest wine region surrounded by vineyards and golf',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 25,
      ZONE_PENINSULA: 38,
      ZONE_WINELANDS: 55,
      ZONE_WEST_COAST_ATLANTIS: 58,
      ZONE_WEST_COAST_LANGEBAAN: 148,
      ZONE_OVERBERG_ELGIN: 64,
      ZONE_OVERBERG_GANSBAAI: 145,
      ZONE_KAROO: 175,
    },
  },
  {
    id: 'the-cellars-hohenort',
    name: 'The Cellars-Hohenort Hotel',
    area: 'Constantia Valley',
    category: 'Constantia & South',
    address: '93 Brommersvlei Road, Constantia, Cape Town',
    description: 'Relais & Châteaux member with centuries-old gardens and historic Cape Dutch elegance',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 20,
      ZONE_PENINSULA: 44,
      ZONE_WINELANDS: 58,
      ZONE_WEST_COAST_ATLANTIS: 54,
      ZONE_WEST_COAST_LANGEBAAN: 144,
      ZONE_OVERBERG_ELGIN: 66,
      ZONE_OVERBERG_GANSBAAI: 148,
      ZONE_KAROO: 176,
    },
  },

  // Cape Winelands
  {
    id: 'delaire-graff',
    name: 'Delaire Graff Estate',
    area: 'Stellenbosch / Helshoogte Pass',
    category: 'Winelands',
    address: 'Helshoogte Pass, Stellenbosch, Cape Winelands',
    description: 'World-renowned vineyard lodges perched atop Helshoogte Pass with monumental sculptures',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 52,
      ZONE_PENINSULA: 82,
      ZONE_WINELANDS: 12,
      ZONE_WEST_COAST_ATLANTIS: 68,
      ZONE_WEST_COAST_LANGEBAAN: 145,
      ZONE_OVERBERG_ELGIN: 48,
      ZONE_OVERBERG_GANSBAAI: 130,
      ZONE_KAROO: 142,
    },
  },
  {
    id: 'babylonstoren',
    name: 'Babylonstoren Farm Hotel',
    area: 'Franschhoek / Simondium',
    category: 'Winelands',
    address: 'Klapmuts - Simondium Road, Simondium, Paarl',
    description: 'Celebrated historic Cape Dutch farm estate with famous botanical fruit and vegetable gardens',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 58,
      ZONE_PENINSULA: 88,
      ZONE_WINELANDS: 14,
      ZONE_WEST_COAST_ATLANTIS: 65,
      ZONE_WEST_COAST_LANGEBAAN: 140,
      ZONE_OVERBERG_ELGIN: 52,
      ZONE_OVERBERG_GANSBAAI: 136,
      ZONE_KAROO: 138,
    },
  },
  {
    id: 'leeu-estates',
    name: 'Leeu Estates',
    area: 'Franschhoek Valley',
    category: 'Winelands',
    address: 'Dassenberg Road, Franschhoek, Cape Winelands',
    description: 'Refined private country retreat set on 100 hectares of vineyards, landscaped gardens and fynbos',
    starRating: 5,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 75,
      ZONE_PENINSULA: 105,
      ZONE_WINELANDS: 16,
      ZONE_WEST_COAST_ATLANTIS: 85,
      ZONE_WEST_COAST_LANGEBAAN: 160,
      ZONE_OVERBERG_ELGIN: 45,
      ZONE_OVERBERG_GANSBAAI: 128,
      ZONE_KAROO: 145,
    },
  },

  // Airport & Transit
  {
    id: 'hotel-verde',
    name: 'Hotel Verde Cape Town Airport',
    area: 'Airport Precinct',
    category: 'Airport & Transit',
    address: '15 Michigan Street, Airport Industria, Cape Town',
    description: 'Africa\'s greenest luxury hotel located 400m from Cape Town International Airport terminal',
    starRating: 4,
    distancesToOneWay: {
      ZONE_CT_CENTRAL: 20,
      ZONE_PENINSULA: 54,
      ZONE_WINELANDS: 40,
      ZONE_WEST_COAST_ATLANTIS: 46,
      ZONE_WEST_COAST_LANGEBAAN: 136,
      ZONE_OVERBERG_ELGIN: 66,
      ZONE_OVERBERG_GANSBAAI: 144,
      ZONE_KAROO: 166,
    },
  },
];

export const HOTEL_CATEGORIES = [
  'All Hotels',
  'V&A Waterfront',
  'Atlantic Seaboard',
  'City Bowl',
  'Constantia & South',
  'Winelands',
  'Airport & Transit',
] as const;

export function findHotelById(id: string): HotelPreset | undefined {
  return CAPE_TOWN_HOTELS.find((h) => h.id === id);
}

export function searchHotels(query: string): HotelPreset[] {
  const q = query.trim().toLowerCase();
  if (!q) return CAPE_TOWN_HOTELS;
  return CAPE_TOWN_HOTELS.filter(
    (h) =>
      h.name.toLowerCase().includes(q) ||
      h.area.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      h.category.toLowerCase().includes(q)
  );
}
