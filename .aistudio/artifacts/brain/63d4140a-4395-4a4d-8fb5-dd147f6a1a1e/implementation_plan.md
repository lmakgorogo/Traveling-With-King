# Implementation Plan: Hotel-to-Destination Distance Calculation (in km)

Accurately calculate and display road travel distance in kilometers (km) for **Traveling with King**, computed directly from the client's pickup hotel to their daily itinerary destinations and back.

---

## 1. Executive Overview & Clarified Requirements

Based on the user's brief and clarified answers:
1. **Hotel Entry & Presets**: Travelers can quickly select from premier Cape Town luxury hotels and boutique lodges (e.g., The Silo Hotel, One&Only Cape Town, Mount Nelson, Ellerman House, The Twelve Apostles Hotel, Cape Grace, Tintswalo Atlantic, Steenberg Estate, Delaire Graff, Hotel Verde) or type any custom hotel, villa, or Airbnb address with immediate feedback.
2. **Round-Trip Calculation**: Travel distance is calculated in kilometers as a complete round trip:
   $$\text{Daily Round-Trip Distance} = (\text{Hotel} \to \text{Destination(s)}) + \text{Intra-day touring circuit} + (\text{Final Destination} \to \text{Hotel})$$
   Private chauffeured transport cost is calculated dynamically at **R15 per km** (+ scenic road tolls such as Chapman's Peak or Huguenot Tunnel where routed).
3. **Omnipresent Display**:
   - **Daily Itinerary Cards**: Each day displays the exact fetched hotel, total round-trip km, route sequence, and transport cost.
   - **Route Summary & Financial Breakdown**: Interactive breakdown displaying total km across the trip, daily distance breakdown table, and vehicle details (King's 7-seater executive chauffeur vehicle).
   - **Booking Modal & Printable Voucher**: Formal pickup hotel statement, daily distance figures in km, and exact transfer costs.
   - **WhatsApp Inquiry**: Structured message sent to King specifying the fetched hotel and daily round-trip km breakdown.

---

## 2. Technical Architecture & Data Design

### A. Hotel Database & Preset Matrix (`src/data/hotels.ts`)
Create a comprehensive directory of Cape Town hotels with regional coordinates, area clusters, and precomputed one-way base distances to each destination zone:
- **V&A Waterfront & Foreshore**: The Silo Hotel, One&Only Cape Town, Cape Grace, The Westin Cape Town, Radisson Red.
- **Atlantic Seaboard & Camps Bay**: Ellerman House (Bantry Bay), The Twelve Apostles Hotel & Spa (Camps Bay), POD Camps Bay, The Bay Hotel.
- **City Bowl & Gardens**: Mount Nelson (A Belmond Hotel), Taj Cape Town, Gorgeous George, Kensington Place.
- **Southern Suburbs & Constantia**: Steenberg Hotel & Spa, The Cellars-Hohenort, Alphen Boutique Hotel.
- **Hout Bay & Chapman's Peak**: Tintswalo Atlantic, Hout Bay Manor.
- **Cape Winelands**: Delaire Graff Estate (Stellenbosch), Babylonstoren (Simondium), Leeu Estates (Franschhoek), Mont Rochelle.
- **Blouberg & Century City**: Century City Hotel, Blaauwberg Beach Hotel.
- **Airport Hub**: Hotel Verde Cape Town Airport.

Each hotel profile contains:
- `id`: unique identifier
- `name`: official hotel name
- `area`: neighborhood / region
- `zoneClusterId`: regional cluster mapping
- `address`: verified street address
- `distancesToOneWay`: accurate road km to each activity zone (Central, Peninsula, Winelands, West Coast Atlantis, West Coast Langebaan, Overberg Elgin, Overberg Gansbaai, Karoo).

### B. Dynamic Round-Trip Km Engine (`src/utils/itineraryEngine.ts`)
Upgrade `calculateDayDistanceAndTransport`:
1. Resolve the traveler's active pickup hotel (either selected from presets or custom-typed).
2. Look up base one-way distance to the primary activity zone of that day.
3. Calculate intra-zone scenic touring kilometers between individual activities on that day.
4. Calculate return distance back to the fetched hotel.
5. Apply R15/km chauffeured rate + toll passes.
6. Provide human-readable route string: `"[Hotel Name] ➔ [Destination 1] ➔ [Destination 2] ➔ [Hotel Name]"`.

---

## 3. Detailed UI & Component Implementation

### Step 1: Hotel Selection & Input Component (`src/components/HotelSelector.tsx`)
- High-visibility hotel picker banner at the top of the itinerary section.
- **Searchable Quick Filter**: Type hotel name or filter by region (Waterfront, Camps Bay, City Bowl, Constantia, Winelands, Airport).
- **Custom Hotel Input**: Option for guests staying in private villas, guest houses, or Airbnbs with instant area resolution.
- Live distance indicator showing that distance and rates are now tailored to that specific hotel.

### Step 2: Itinerary Day Cards (`src/components/ItinerarySection.tsx`)
- Add a prominent **Route & Distance Badge** to each day card:
  - `🚗 [Round-trip km] km round trip from [Hotel Name]`
  - Route flow pill: `Hotel ➔ Attraction A ➔ Attraction B ➔ Hotel`
  - Transport cost for the day in selected currency (ZAR, USD, EUR, GBP, AUD).
  - Info tooltip explaining that King fetches guests directly at the hotel lobby and returns them after the tour.

### Step 3: Route Summary & Distance Breakdown Component
- Expand the Financial Summary with a dedicated **Chauffeured Distance Summary**:
  - Total Trip Distance in km.
  - Table showing Day 1, Day 2, Day 3 round-trip distances and route paths.
  - Transparent per-km formula (`Distance × R15/km`).

### Step 4: Booking Modal & Printable Voucher Updates
- **Booking Modal**: Pre-fills the fetched hotel into the pickup field; displays total round-trip km and transfer subtotal.
- **Printable Voucher**: Displays "Fetched From Hotel: [Hotel Name]" with a "Distance & Route Breakdown" section showing day-by-day km.
- **WhatsApp Submission**: Directly formats:
  `• Fetched Hotel: The Silo Hotel, V&A Waterfront`
  `• Route Distance: Day 1 (148 km RT), Day 2 (162 km RT) · Total 310 km`
  `• Chauffeured Transport: R4,650`

---

## 4. Verification & Testing Plan

1. **Compilation & Linting**:
   - Run `lint_applet` and `compile_applet` to verify TypeScript types, interfaces, and build validity.
2. **Hotel Preset Testing**:
   - Test picking "The Silo Hotel" (Waterfront) $\to$ Peninsula route calculates ~145 km RT.
   - Test picking "The Twelve Apostles Hotel" (Camps Bay) $\to$ Peninsula route calculates ~125 km RT (shorter Peninsula distance).
   - Test picking "Delaire Graff Estate" (Stellenbosch) $\to$ Winelands route calculates ~40 km RT vs. Peninsula ~170 km RT.
   - Test typing custom hotel/villa address.
3. **Currency Conversion Check**:
   - Verify that transport costs convert cleanly to USD, EUR, GBP, and AUD.
4. **Voucher & WhatsApp Format**:
   - Verify generated voucher prints the fetched hotel and daily km breakdown.
   - Verify WhatsApp URL encodes the hotel name and daily km correctly.
