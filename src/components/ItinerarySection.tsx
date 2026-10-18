import React, { useState } from 'react';
import { Activity } from '../data/activities';
import { ItineraryDay, PricingSummary, resolveDepartureOrHotel } from '../utils/itineraryEngine';
import { HotelSelector } from './HotelSelector';
import { LatLngLiteral } from './MapsAddressInput';
import { CalendarPicker } from './CalendarPicker';
import { CurrencyCode, formatCurrency, formatCurrencyRange } from '../utils/currency';
import {
  Car,
  Trash2,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  Users,
  Clock,
  ShieldCheck,
  Info,
  MapPin,
  Building2,
  Navigation,
} from 'lucide-react';

interface ItinerarySectionProps {
  itinerary: ItineraryDay[];
  pricing: PricingSummary;
  selectedActivities: Activity[];
  onRemoveActivity: (id: string) => void;
  onClearAll: () => void;
  onUpdateGuests: (count: number) => void;
  onOpenBookingModal: () => void;
  onOpenPrintVoucher: () => void;
  startDate: string;
  endDate: string;
  onSelectDates: (start: string, end: string) => void;
  currency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  departureId: string;
  onSelectDeparture: (id: string) => void;
  customDepartureAddress?: string;
  onUpdateCustomDeparture?: (addr: string, coords?: LatLngLiteral | null) => void;
  customCoordinates?: LatLngLiteral | null;
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  itinerary,
  pricing,
  selectedActivities,
  onRemoveActivity,
  onClearAll,
  onUpdateGuests,
  onOpenBookingModal,
  onOpenPrintVoucher,
  startDate,
  endDate,
  onSelectDates,
  currency,
  departureId,
  onSelectDeparture,
  customDepartureAddress = '',
  onUpdateCustomDeparture,
  customCoordinates = null,
}) => {
  const hasItems = selectedActivities.length > 0;
  const [showCalendarInOverview, setShowCalendarInOverview] = useState(false);
  const [showDistanceBreakdown, setShowDistanceBreakdown] = useState(false);

  // Helper to calculate date string for Day N
  const getDayDateString = (dayIndex: number): string | null => {
    if (!startDate) return null;
    const baseDate = new Date(startDate);
    baseDate.setDate(baseDate.getDate() + dayIndex);
    return baseDate.toLocaleDateString('en-ZA', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-neutral-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest text-[#DFB45E] font-medium">
              Intelligent Route Sequencing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury text-white">
            Your Bespoke Cape Town Schedule
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-2xl font-light">
            Destinations are automatically sequenced into daily return routes. Enter your place of departure to calculate dedicated private chauffeured transfers per km.
          </p>
        </div>

        {hasItems && (
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={onClearAll}
              className="text-xs text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-neutral-800/80 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Itinerary</span>
            </button>
          </div>
        )}
      </div>

      {!hasItems ? (
        /* Empty State */
        <div className="bg-[#0E101A] border border-neutral-800 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#181A2A] border border-[#DFB45E]/30 text-[#DFB45E] flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-serif-luxury text-white">Your Itinerary is Empty</h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Select experiences or free birthday treats from the catalog above. King will organize them into logical daily return journeys with private chauffeured transfers.
          </p>
          <a
            href="#catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 transition-all shadow-md gold-glow"
          >
            <span>Explore 30+ Experiences</span>
          </a>
        </div>
      ) : (
        /* Populated Itinerary Grid */
        <div className="space-y-8">
          {/* Controls Banner: Place of Departure & Travel Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Hotel Where Fetched Selector & Distance Engine */}
            <HotelSelector
              departureId={departureId}
              onSelectDeparture={onSelectDeparture}
              customDepartureAddress={customDepartureAddress}
              onUpdateCustomDeparture={onUpdateCustomDeparture}
              customCoordinates={customCoordinates}
            />

            {/* 2. Scheduled Travel Dates */}
            <div className="bg-[#10121C] border border-[#DFB45E]/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#1C1F32] border border-[#DFB45E]/40 flex items-center justify-center text-[#DFB45E] shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-neutral-400">Scheduled Travel Dates</div>
                    <div className="text-sm font-semibold text-white font-mono truncate">
                      {startDate && endDate ? (
                        <>
                          {new Date(startDate).toLocaleDateString('en-ZA', {
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          to{' '}
                          {new Date(endDate).toLocaleDateString('en-ZA', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </>
                      ) : (
                        <span>Select trip dates</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowCalendarInOverview(!showCalendarInOverview)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-200 bg-neutral-800/80 hover:bg-neutral-700 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>{showCalendarInOverview ? 'Close' : 'Adjust Dates'}</span>
                  {showCalendarInOverview ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#DFB45E]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#DFB45E]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Calendar Date Picker */}
          {showCalendarInOverview && (
            <div className="p-4 sm:p-6 bg-[#0B0D17] border border-[#DFB45E]/30 rounded-2xl animate-in fade-in duration-200">
              <CalendarPicker
                startDate={startDate}
                endDate={endDate}
                onSelectRange={onSelectDates}
                totalDaysNeeded={pricing.totalDays}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Multi-Day Timeline (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {itinerary.map((day, idx) => {
                const dayDateStr = getDayDateString(idx);
                return (
                  <div
                    key={day.dayNumber}
                    className="bg-[#0F101A] border border-neutral-800 rounded-3xl p-5 sm:p-6 transition-all hover:border-[#DFB45E]/40"
                  >
                    {/* Day Header */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800/80 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-mono uppercase tracking-widest text-[#DFB45E] bg-[#DFB45E]/10 px-2.5 py-0.5 rounded-full border border-[#DFB45E]/20">
                            Day {day.dayNumber}
                          </span>
                          <h4 className="text-lg sm:text-xl font-serif-luxury font-semibold text-white">
                            {day.zone.name}
                          </h4>
                          {dayDateStr && (
                            <span className="text-xs font-mono text-[#FCE9B0] bg-[#161826] px-2 py-0.5 rounded border border-neutral-800">
                              {dayDateStr}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2 flex-wrap">
                          <span className="text-[#DFB45E]">{day.zone.approxDistance}</span>
                          <span aria-hidden="true">·</span>
                          <span>{day.activities.length} Destinations</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-neutral-300 font-medium">{day.pace} Pace</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase text-neutral-400 block">Activities (pp)</span>
                        <span className="text-sm font-mono font-semibold text-white">
                          {formatCurrencyRange(day.dayCostMin, day.dayCostMax, currency)}
                        </span>
                      </div>
                    </div>

                    {/* Hotel-to-Destination Distance & Transport Line (Round Trip) */}
                    <div className="py-2.5 px-3.5 bg-[#0B0D17] rounded-xl border border-neutral-800/80 mb-3.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-neutral-200 min-w-0">
                          <Car className="w-3.5 h-3.5 text-[#DFB45E] shrink-0" />
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white">
                              {day.transportCalculated ? `${day.roundTripKm} km Round Trip` : 'Round-trip km pending'}
                            </span>
                            {day.transportCalculated && (
                              <span className="text-[11px] text-[#DFB45E] font-medium font-mono truncate max-w-[200px] sm:max-w-xs">
                                · From {day.fetchedHotelName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {day.transportCalculated ? (
                            <span className="font-mono font-bold text-sm text-[#FCE9B0]">
                              {formatCurrency(day.transportCost, currency)}
                            </span>
                          ) : (
                            <span className="text-amber-400 text-[11px] italic">
                              Select hotel or Airbnb address
                            </span>
                          )}
                        </div>
                      </div>

                      {day.transportCalculated && day.routePath && (
                        <div className="text-[11px] text-neutral-400 font-mono truncate border-t border-neutral-800/60 pt-1.5 flex items-center gap-1.5">
                          <Navigation className="w-3 h-3 text-[#DFB45E] shrink-0" />
                          <span className="truncate">{day.routePath}</span>
                        </div>
                      )}
                    </div>

                    {/* King's Logistical Tip */}
                    <div className="bg-[#141624] border border-[#DFB45E]/20 rounded-xl p-3 mb-5 flex items-start gap-3 text-xs text-[#FCE9B0]">
                      <Car className="w-4 h-4 text-[#DFB45E] shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong className="text-white">King's Logistical Tip:</strong> {day.kingNotes}
                      </p>
                    </div>

                    {/* Day Activities List */}
                    <div className="space-y-3">
                      {day.activities.map((act) => {
                        const isFrom = Boolean(act.priceNote?.startsWith('From'));
                        const actMin = act.priceMin ?? act.priceZAR;
                        const actMax = act.priceMax ?? act.priceZAR;
                        const formattedPrice = formatCurrencyRange(actMin, actMax, currency, isFrom);

                        return (
                          <div
                            key={act.id}
                            className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#12141F] border border-neutral-800/70 hover:border-neutral-700 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={act.image}
                                alt={act.name}
                                className="w-12 h-12 rounded-lg object-cover shrink-0 filter brightness-95"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <h5 className="text-sm font-medium text-white truncate">
                                  {act.name}
                                </h5>
                                <div className="text-[11px] text-neutral-400 flex items-center gap-2 flex-wrap">
                                  <span className="text-[#DFB45E] font-medium">{act.region}</span>
                                  <span aria-hidden="true">·</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{act.duration}</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                              <div className="text-right">
                                <span className="text-sm font-mono text-[#FCE9B0] font-medium block">
                                  {formattedPrice}
                                </span>
                                <span className="text-[10px] text-neutral-500 block">per person</span>
                              </div>

                              <button
                                onClick={() => onRemoveActivity(act.id)}
                                className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800/60 rounded-lg transition-colors cursor-pointer"
                                title="Remove activity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Cost Summary Card (5 cols) */}
            <div className="lg:col-span-5 sticky top-28 space-y-6">
              <div className="bg-[#10121C] border border-[#DFB45E]/30 rounded-3xl p-6 sm:p-7 shadow-xl gold-subtle-glow">
                <div className="pb-4 border-b border-neutral-800">
                  <span className="text-[11px] uppercase tracking-wider text-[#DFB45E] font-medium block">
                    Cost Summary
                  </span>
                  <h3 className="text-2xl font-serif-luxury font-medium text-white">
                    Estimated Cost
                  </h3>
                </div>

                {/* Hotel / Airbnb Where Fetched in Cost Card */}
                <div className="py-3.5 border-b border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Building2 className="w-4 h-4 text-[#DFB45E]" />
                    <span>Hotel / Airbnb:</span>
                  </div>
                  <span className="text-white font-medium font-mono text-right truncate max-w-[190px]">
                    {pricing.isTransportCalculated ? (
                      pricing.fetchedHotelName
                    ) : (
                      <span className="text-amber-400 font-sans italic text-xs">Select hotel or Airbnb address</span>
                    )}
                  </span>
                </div>

                {/* Total Calculated Route Distance */}
                {pricing.isTransportCalculated && (
                  <div className="py-3 border-b border-neutral-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Navigation className="w-4 h-4 text-[#DFB45E]" />
                      <span>Total Route Distance:</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#FCE9B0] font-bold font-mono">
                        {pricing.totalDistanceKm} km round trip
                      </span>
                      <span className="text-[10px] text-neutral-500 block">
                        across {pricing.totalDays} {pricing.totalDays === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Guest Count Stepper */}
                <div className="py-4 border-b border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#DFB45E]" />
                    <div>
                      <span className="text-xs font-medium text-white block">Travelers / Guests</span>
                      <span className="text-[11px] text-neutral-400">Multiplies entry & tasting fees</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#181B2A] rounded-xl p-1 border border-neutral-800">
                    <button
                      onClick={() => onUpdateGuests(Math.max(1, pricing.guestsCount - 1))}
                      className="w-7 h-7 flex items-center justify-center text-sm font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-semibold px-2 text-white">
                      {pricing.guestsCount}
                    </span>
                    <button
                      onClick={() => onUpdateGuests(Math.min(10, pricing.guestsCount + 1))}
                      className="w-7 h-7 flex items-center justify-center text-sm font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Line Items */}
                <div className="py-4 space-y-3.5 text-xs text-neutral-300 border-b border-neutral-800">
                  {/* 1. Activities Entrance Fees */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">Activity Entrance & Tasting Fees</span>
                      <span className="text-[11px] text-neutral-400 block">
                        {selectedActivities.length} activities × {pricing.guestsCount} {pricing.guestsCount === 1 ? 'guest' : 'guests'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono tabular-nums text-sm font-medium text-white block">
                        {formatCurrencyRange(pricing.activitiesTotalMin, pricing.activitiesTotalMax, currency)}
                      </span>
                    </div>
                  </div>

                  {/* 2. Dedicated Private Transport (Calculated from Hotel in km) */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium">Dedicated Private Transport</span>
                        <span className="text-[11px] text-neutral-400 block mt-0.5">
                          {pricing.isTransportCalculated
                            ? `${pricing.totalDistanceKm} km round trip from hotel (R${pricing.ratePerKm}/km)`
                            : 'Calculated in km once your hotel is selected'}
                        </span>
                      </div>
                      <div className="text-right">
                        {pricing.isTransportCalculated ? (
                          <span className="font-mono tabular-nums text-sm font-medium text-white block">
                            {formatCurrency(pricing.transportTotal, currency)}
                          </span>
                        ) : (
                          <span className="text-amber-400 text-xs italic block">
                            Pending hotel selection
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interactive Distance Breakdown Toggle */}
                    {pricing.isTransportCalculated && pricing.daysTransportBreakdown.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-800/60">
                        <button
                          type="button"
                          onClick={() => setShowDistanceBreakdown(!showDistanceBreakdown)}
                          className="text-[11px] text-[#DFB45E] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <span>{showDistanceBreakdown ? 'Hide Route Distance Breakdown' : 'View Day-by-Day Route & Distance in km'}</span>
                          {showDistanceBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {showDistanceBreakdown && (
                          <div className="mt-2 p-2.5 rounded-xl bg-[#0C0E18] border border-neutral-800 space-y-2 text-[11px]">
                            <div className="text-neutral-400 flex items-center justify-between font-mono pb-1 border-b border-neutral-800">
                              <span>Day & Route</span>
                              <span>Round-Trip km</span>
                            </div>
                            {pricing.daysTransportBreakdown.map((b) => (
                              <div key={b.dayNumber} className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <span className="font-medium text-white block">Day {b.dayNumber}: {b.title}</span>
                                  <span className="text-[10px] text-neutral-400 truncate block font-mono">
                                    {b.routePath || b.routeLabel}
                                  </span>
                                </div>
                                <div className="text-right shrink-0 font-mono">
                                  <span className="text-[#FCE9B0] font-bold">{b.roundTripKm} km</span>
                                  <span className="text-[10px] text-neutral-400 block">
                                    {formatCurrency(b.transportCost, currency)}
                                  </span>
                                </div>
                              </div>
                            ))}
                            <div className="pt-1.5 border-t border-neutral-800 text-[10px] text-neutral-400 flex items-center gap-1.5">
                              <Car className="w-3 h-3 text-[#DFB45E] shrink-0" />
                              <span>King's executive 7-seater Suzuki Ertiga · Dual AC, WiFi & bottled water included.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 3. Concierge Fee */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-medium">Concierge Fee</span>
                        <span className="text-[10px] text-[#DFB45E] font-mono">
                          10%
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block">
                        Logistics sequencing, advance tasting desk & full trip care
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono tabular-nums text-sm font-medium text-white block">
                        {formatCurrencyRange(pricing.curationFeeTotalMin, pricing.curationFeeTotalMax, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-neutral-400 block">
                      Estimated Total Price Range
                    </span>
                    <span className="text-[11px] text-neutral-500 block">
                      Standard to peak season rates
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white tracking-tight">
                      {formatCurrencyRange(pricing.grandTotalMin, pricing.grandTotalMax, currency, false, false)}
                    </span>
                    {!pricing.isTransportCalculated && (
                      <span className="text-[11px] text-amber-400 block mt-0.5">
                        + Private transport calculated upon selecting hotel
                      </span>
                    )}
                  </div>
                </div>

                {/* Peak Season Pricing Disclaimer */}
                <div className="mb-6 p-3 rounded-xl bg-[#DFB45E]/10 border border-[#DFB45E]/30 flex items-start gap-2.5 text-xs text-[#FCE9B0]">
                  <Info className="w-4 h-4 text-[#DFB45E] shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="font-semibold text-white">Seasonality Notice:</strong> Please note that prices may change due to peak time season, holiday demand, and seasonal supplier rates.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!pricing.isTransportCalculated ? (
                    <button
                      onClick={() => {
                        const el = document.getElementById('departure-selector-card');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-[0.99] transition-all shadow-lg gold-glow flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-[#090A0F]" />
                      <span>Select Hotel or Enter Airbnb Address</span>
                    </button>
                  ) : (
                    <button
                      onClick={onOpenBookingModal}
                      className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-[0.99] transition-all shadow-lg gold-glow flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#090A0F]" />
                      <span>Book with King via WhatsApp</span>
                    </button>
                  )}

                  <button
                    onClick={onOpenPrintVoucher}
                    className="w-full py-3 px-4 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#DFB45E]" />
                    <span>View & Print Official Travel Pass</span>
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800 text-center">
                  <p className="text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#DFB45E]" />
                    <span>No upfront payment required today. Direct confirmation with King.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
