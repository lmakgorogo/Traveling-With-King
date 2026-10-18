import React, { useState } from 'react';
import { CAPE_TOWN_HOTELS, HOTEL_CATEGORIES } from '../data/hotels';
import { resolveDepartureOrHotel } from '../utils/itineraryEngine';
import { MapsAddressInput, LatLngLiteral } from './MapsAddressInput';
import { Search, Check, Building2, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface HotelSelectorProps {
  departureId: string;
  onSelectDeparture: (id: string) => void;
  customDepartureAddress?: string;
  onUpdateCustomDeparture?: (addr: string, coords?: LatLngLiteral | null) => void;
  customCoordinates?: LatLngLiteral | null;
}

const AIRBNB_SUBURB_SUGGESTIONS = [
  'Sea Point',
  'Camps Bay',
  'Green Point',
  'V&A Waterfront',
  'Gardens / City Bowl',
  'Constantia',
  'Hout Bay',
  'Bloubergstrand',
  'Stellenbosch',
];

export const HotelSelector: React.FC<HotelSelectorProps> = ({
  departureId,
  onSelectDeparture,
  customDepartureAddress = '',
  onUpdateCustomDeparture,
  customCoordinates = null,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All Hotels');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAirbnbMode, setIsAirbnbMode] = useState(departureId === 'CUSTOM');

  const resolved = resolveDepartureOrHotel(departureId, customDepartureAddress, customCoordinates);
  const isSelected = Boolean(resolved !== null);

  // Filter hotels based on category and query
  const filteredHotels = CAPE_TOWN_HOTELS.filter((hotel) => {
    const matchesCategory =
      activeCategory === 'All Hotels' || hotel.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      hotel.name.toLowerCase().includes(q) ||
      hotel.area.toLowerCase().includes(q) ||
      hotel.address.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const handleSelectHotel = (hotelId: string) => {
    setIsAirbnbMode(false);
    onSelectDeparture(hotelId);
    setIsExpanded(false);
  };

  const handleOpenHotelList = () => {
    setIsAirbnbMode(false);
    setIsExpanded(!isExpanded || isAirbnbMode);
  };

  const handleOpenAirbnbAddress = () => {
    setIsAirbnbMode(true);
    setIsExpanded(true);
    onSelectDeparture('CUSTOM');
  };

  const handleAppendSuburb = (suburb: string) => {
    if (!onUpdateCustomDeparture) return;
    const current = customDepartureAddress.trim();
    if (!current) {
      onUpdateCustomDeparture(`Airbnb in ${suburb}, Cape Town`, null);
    } else if (!current.toLowerCase().includes(suburb.toLowerCase())) {
      onUpdateCustomDeparture(`${current}, ${suburb}`, customCoordinates);
    }
  };

  return (
    <div
      id="departure-selector-card"
      className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
        !isSelected
          ? 'bg-[#161410] border-2 border-[#DFB45E] shadow-xl shadow-[#DFB45E]/10'
          : 'bg-[#10121C] border border-[#DFB45E]/30'
      }`}
    >
      {/* Header & Accommodation Type Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              !isSelected
                ? 'bg-[#DFB45E] text-[#090A0F]'
                : 'bg-[#1C1F32] border border-[#DFB45E]/40 text-[#DFB45E]'
            }`}
          >
            {departureId === 'CUSTOM' ? (
              <Home className="w-5 h-5" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                {departureId === 'CUSTOM' ? 'Airbnb / Pickup Address' : 'Hotel or Airbnb Where Fetched'}
              </span>
              <span className="text-[10px] text-[#DFB45E] bg-[#DFB45E]/10 px-2 py-0.5 rounded-full border border-[#DFB45E]/20 font-medium">
                Distance Calculated from Here
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white truncate font-mono mt-0.5">
              {isSelected ? (
                resolved?.name
              ) : isAirbnbMode ? (
                <span className="text-[#FCE9B0]">Search your Airbnb address on Google Maps below</span>
              ) : (
                <span className="text-[#FCE9B0]">Select your hotel or enter your Airbnb address</span>
              )}
            </div>
          </div>
        </div>

        {/* Direct Quick-Toggle Buttons: Hotel vs Airbnb */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleOpenHotelList}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              !isAirbnbMode && isExpanded
                ? 'bg-gradient-to-r from-[#DFB45E] to-[#BA8936] text-[#090A0F] shadow-md'
                : !isSelected && !isAirbnbMode
                ? 'bg-gradient-to-r from-[#DFB45E] to-[#BA8936] text-[#090A0F] shadow-md hover:brightness-110'
                : 'text-neutral-200 bg-neutral-800/90 hover:bg-neutral-700 hover:text-white border border-neutral-700/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{isSelected && departureId !== 'CUSTOM' ? 'Change Hotel' : 'Select Hotel'}</span>
            {!isAirbnbMode && isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleOpenAirbnbAddress}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              isAirbnbMode
                ? 'bg-gradient-to-r from-[#DFB45E] to-[#BA8936] text-[#090A0F] shadow-md'
                : 'text-neutral-200 bg-neutral-800/90 hover:bg-neutral-700 hover:text-white border border-neutral-700/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Airbnb / Maps Address</span>
          </button>
        </div>
      </div>

      {/* Verified Pickup Notification when selected */}
      {isSelected && !isExpanded && (
        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>
              King will fetch you from <strong className="text-white font-medium">{resolved?.name}</strong> and calculate round-trip km to each destination.
            </span>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleOpenHotelList}
              className="text-[#DFB45E] hover:underline text-[11px] font-medium cursor-pointer"
            >
              Browse hotels
            </button>
            <span className="text-neutral-700">·</span>
            <button
              type="button"
              onClick={handleOpenAirbnbAddress}
              className="text-[#DFB45E] hover:underline text-[11px] font-medium cursor-pointer"
            >
              Search Airbnb on Maps
            </button>
          </div>
        </div>
      )}

      {/* Expanded Panel: Either Airbnb Google Maps Address Input OR Hotel Presets */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#DFB45E]/20 space-y-4">
          {isAirbnbMode ? (
            /* Airbnb / Private Address Input Mode with Google Maps Autocomplete */
            <div className="p-4 rounded-xl bg-[#141624] border border-[#DFB45E]/40 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Home className="w-4 h-4 text-[#DFB45E]" />
                  <span>Staying at an Airbnb or Private Villa? Search Your Address on Maps</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAirbnbMode(false)}
                  className="text-[11px] text-[#DFB45E] hover:underline cursor-pointer"
                >
                  Switch to Hotel List
                </button>
              </div>

              <p className="text-[11px] text-neutral-400">
                Start typing your Airbnb street address below to pick it directly from Google Maps and calculate your exact round-trip distance in km:
              </p>

              <MapsAddressInput
                value={customDepartureAddress}
                coordinates={customCoordinates}
                onChange={(addr, coords) => {
                  if (departureId !== 'CUSTOM') {
                    onSelectDeparture('CUSTOM');
                  }
                  if (onUpdateCustomDeparture) {
                    onUpdateCustomDeparture(addr, coords);
                  }
                }}
                placeholder="Start typing your Cape Town Airbnb street address (Google Maps Autocomplete)..."
                showMapPreview={true}
              />

              {/* Quick Suburb Tags for Airbnb */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Or quick-add Cape Town suburb:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {AIRBNB_SUBURB_SUGGESTIONS.map((suburb) => (
                    <button
                      key={suburb}
                      type="button"
                      onClick={() => handleAppendSuburb(suburb)}
                      className="px-2.5 py-1 rounded-lg text-[11px] bg-[#1C1F32] hover:bg-[#DFB45E]/20 text-neutral-300 hover:text-[#FCE9B0] border border-neutral-700/80 hover:border-[#DFB45E]/40 transition-colors cursor-pointer"
                    >
                      + {suburb}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                <span className="text-[11px] text-neutral-400">
                  {customDepartureAddress.trim() ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Distance in km calculated from {customDepartureAddress.trim()}
                    </span>
                  ) : (
                    'Select your address from Google Maps suggestions above'
                  )}
                </span>
                <button
                  type="button"
                  disabled={!customDepartureAddress.trim()}
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#DFB45E] text-[#090A0F] hover:brightness-110 disabled:opacity-40 cursor-pointer"
                >
                  Confirm Address
                </button>
              </div>
            </div>
          ) : (
            /* Hotel Presets Mode */
            <>
              {/* Search bar & Airbnb switch */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hotel name (e.g., The Silo, Twelve Apostles, Mount Nelson)..."
                    className="w-full bg-[#141624] border border-neutral-700 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#DFB45E]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleOpenAirbnbAddress}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-neutral-800 text-[#FCE9B0] hover:text-white hover:bg-neutral-700 border border-[#DFB45E]/30"
                >
                  <Home className="w-3.5 h-3.5 text-[#DFB45E]" />
                  <span>Staying at an Airbnb? Search on Maps</span>
                </button>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {HOTEL_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#DFB45E] text-[#090A0F] font-bold shadow-sm'
                          : 'bg-[#181A2A] text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Hotel Presets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredHotels.length === 0 ? (
                  <div className="col-span-full py-6 text-center text-xs text-neutral-400 space-y-2">
                    <p>No preset hotels match "{searchQuery}".</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (onUpdateCustomDeparture && searchQuery.trim()) {
                          onUpdateCustomDeparture(searchQuery.trim(), null);
                        }
                        handleOpenAirbnbAddress();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DFB45E] text-[#090A0F] font-semibold text-xs cursor-pointer"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Search "{searchQuery}" on Google Maps</span>
                    </button>
                  </div>
                ) : (
                  filteredHotels.map((hotel) => {
                    const isHotelActive = departureId === hotel.id;
                    return (
                      <button
                        key={hotel.id}
                        type="button"
                        onClick={() => handleSelectHotel(hotel.id)}
                        className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isHotelActive
                            ? 'bg-[#DFB45E]/15 border-[#DFB45E] shadow-sm'
                            : 'bg-[#121422] border-neutral-800 hover:border-neutral-700 hover:bg-[#181B2E]'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="text-xs font-bold text-white leading-snug line-clamp-1">
                              {hotel.name}
                            </span>
                            {isHotelActive && (
                              <Check className="w-3.5 h-3.5 text-[#DFB45E] shrink-0 mt-0.5" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#DFB45E] block mt-0.5">
                            {hotel.area}
                          </span>
                          <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-normal">
                            {hotel.description}
                          </p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-500">
                          <span className="truncate">{hotel.address}</span>
                          <span className="text-[#DFB45E] font-medium shrink-0 ml-1">
                            {isHotelActive ? 'Selected' : 'Pick'}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
