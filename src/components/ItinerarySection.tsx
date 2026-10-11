import React, { useState } from 'react';
import { Activity } from '../data/activities';
import { ItineraryDay, PricingSummary } from '../utils/itineraryEngine';
import { CalendarPicker } from './CalendarPicker';
import {
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Sparkles,
  Car,
  ShieldCheck,
  UserCheck,
  CheckCircle,
  HelpCircle,
  FileText,
  MessageSquare,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ItinerarySectionProps {
  itinerary: ItineraryDay[];
  pricing: PricingSummary;
  selectedActivities: Activity[];
  onRemoveActivity: (id: string) => void;
  onClearAll: () => void;
  onUpdateGuests: (count: number) => void;
  onToggleVip: (val: boolean) => void;
  onOpenBookingModal: () => void;
  onOpenPrintVoucher: () => void;
  startDate: string;
  endDate: string;
  onSelectDates: (start: string, end: string) => void;
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  itinerary,
  pricing,
  selectedActivities,
  onRemoveActivity,
  onClearAll,
  onUpdateGuests,
  onToggleVip,
  onOpenBookingModal,
  onOpenPrintVoucher,
  startDate,
  endDate,
  onSelectDates,
}) => {
  const hasItems = selectedActivities.length > 0;
  const [showCalendarInOverview, setShowCalendarInOverview] = useState(false);

  const getDayDateString = (dayIndex: number) => {
    if (!startDate) return null;
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayIndex);
    return d.toLocaleDateString('en-ZA', {
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
          <div className="text-xs uppercase tracking-widest text-[#DFB45E] font-medium mb-2">
            Smart Geographic Route Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-normal text-white">
            Your Tailored Multi-Day Itinerary
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
            Activities are automatically grouped into cohesive days by geographical zone to eliminate criss-crossing highway travel and guarantee an effortless luxury experience.
          </p>
        </div>

        {hasItems && (
          <button
            onClick={onClearAll}
            className="text-xs text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1.5 self-start md:self-end cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Selections</span>
          </button>
        )}
      </div>

      {!hasItems ? (
        /* Empty State */
        <div className="bg-[#12141F]/60 border border-neutral-800 rounded-3xl p-8 sm:p-14 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#181B2A] border border-[#DFB45E]/30 text-[#DFB45E] flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-serif-luxury text-white mb-2">
            Your itinerary is currently empty
          </h3>
          <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto">
            Browse the activity catalog above and select items to see our smart engine cluster your destinations into optimized travel days.
          </p>
          <a
            href="#catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] to-[#BA8936] hover:brightness-110 transition-all shadow-md"
          >
            Browse Experiences
          </a>
        </div>
      ) : (
        /* Main Layout: Left Itinerary Timeline + Right Financial & Booking Summary */
        <div className="space-y-6">
          {/* Travel Dates Calendar Banner */}
          <div className="bg-[#10121F] border border-[#DFB45E]/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1D30] border border-[#DFB45E]/40 text-[#DFB45E] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#DFB45E] font-medium block">
                  Trip Dates Calendar
                </span>
                <span className="text-sm font-semibold text-white">
                  {startDate && endDate ? `${startDate} to ${endDate}` : startDate ? `From ${startDate}` : 'Choose your travel dates'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCalendarInOverview(!showCalendarInOverview)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] to-[#BA8936] hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{showCalendarInOverview ? 'Close Calendar' : 'Change Dates on Calendar'}</span>
                {showCalendarInOverview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Expanded Calendar in Overview */}
          {showCalendarInOverview && (
            <div className="max-w-xl mx-auto">
              <CalendarPicker
                startDate={startDate}
                endDate={endDate}
                totalDaysNeeded={pricing.totalDays}
                onSelectRange={onSelectDates}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Day-by-Day Timeline (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-800">
                <span>
                  Calculated Schedule: <strong className="text-white">{pricing.totalDays} Total Days</strong>
                </span>
                <span>
                  <strong className="text-[#DFB45E]">{selectedActivities.length}</strong> Activities Included
                </span>
              </div>

              {itinerary.map((day, idx) => {
                const dateLabel = getDayDateString(idx);
                return (
                  <div
                    key={day.dayNumber}
                    className="bg-[#0E0F17] border border-neutral-800/90 rounded-2xl p-5 sm:p-6 shadow-md transition-all hover:border-[#DFB45E]/30"
                  >
                    {/* Day Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800/80 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-6 h-6 rounded-full bg-[#DFB45E] text-[#090A0F] font-mono text-xs font-bold flex items-center justify-center">
                            {day.dayNumber}
                          </span>
                          <h4 className="text-xl font-serif-luxury text-white font-medium">
                            {day.title}
                          </h4>
                          {dateLabel && (
                            <span className="text-[11px] font-mono text-[#FCE9B0] bg-[#DFB45E]/10 px-2 py-0.5 rounded border border-[#DFB45E]/20">
                              {dateLabel}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                          <span className="text-[#DFB45E]">{day.zone.approxDistance}</span>
                          <span aria-hidden="true">·</span>
                          <span>{day.activities.length} Destinations</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-neutral-300 font-medium">{day.pace} Pace</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase text-neutral-400 block">Day Activities</span>
                        <span className="text-sm font-mono font-semibold text-white">
                          R{day.dayCost.toLocaleString()} <span className="text-[10px] text-neutral-400 font-sans">pp</span>
                        </span>
                      </div>
                    </div>

                    {/* King's Insider Logistics Note */}
                    <div className="bg-[#141624] border border-[#DFB45E]/20 rounded-xl p-3 mb-5 flex items-start gap-3 text-xs text-[#FCE9B0]">
                      <Car className="w-4 h-4 text-[#DFB45E] shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong className="text-white">King's Logistical Tip:</strong> {day.kingNotes}
                      </p>
                    </div>

                    {/* Day Activities List */}
                    <div className="space-y-3">
                      {day.activities.map((act) => (
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
                              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                                <span className="text-[#DFB45E]">{act.recommendedSlot}</span>
                                <span aria-hidden="true">·</span>
                                <span>{act.region}</span>
                                <span aria-hidden="true">·</span>
                                <span>{act.duration}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-mono tabular-nums text-neutral-200">
                              R{act.priceZAR.toLocaleString()}
                            </span>
                            <button
                              onClick={() => onRemoveActivity(act.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                              title="Remove from itinerary"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Transparent Price Calculator & Monetization Card (5 cols) */}
            <div className="lg:col-span-5 sticky top-28 space-y-6">
              <div className="bg-[#10121C] border border-[#DFB45E]/30 rounded-3xl p-6 sm:p-7 shadow-xl gold-subtle-glow">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#DFB45E] font-medium block">
                      Transparent Financial Breakdown
                    </span>
                    <h3 className="text-2xl font-serif-luxury font-medium text-white">
                      Estimated Cost Summary
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 font-mono">
                      {pricing.totalDays} {pricing.totalDays === 1 ? 'Day' : 'Days'} Total
                    </span>
                  </div>
                </div>

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
                    <span className="font-mono tabular-nums text-sm font-medium text-white">
                      R{pricing.activitiesTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* 2. King's Transport Baseline Rate */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-medium">King's 7-Seater Suzuki Private Transport</span>
                        <span className="text-[10px] text-[#DFB45E] bg-[#DFB45E]/10 px-1.5 py-0.2 rounded font-mono">
                          Fixed
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block">
                        R{pricing.transportDayRate.toLocaleString()} day-rate × {pricing.totalDays} {pricing.totalDays === 1 ? 'day' : 'days'} (7-seater Suzuki & private guide)
                      </span>
                    </div>
                    <span className="font-mono tabular-nums text-sm font-medium text-white">
                      R{pricing.transportTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* 3. Curation Fee */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-medium">Itinerary Curation & Concierge Fee</span>
                        <span className="text-[10px] text-[#DFB45E] font-mono">
                          12%
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block">
                        Logistics optimization, booking reservations & support
                      </span>
                    </div>
                    <span className="font-mono tabular-nums text-sm font-medium text-white">
                      R{pricing.curationFeeTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* 4. VIP Executive Upgrade Toggle */}
                  <div className="p-3.5 rounded-2xl bg-[#151827] border border-[#DFB45E]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#DFB45E]" />
                        <span className="text-xs font-semibold text-white">VIP Executive In-Car Package</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pricing.isVip}
                          onChange={(e) => onToggleVip(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#DFB45E]"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Includes priority booking reservations and VIP fast-track coordination (+R{pricing.vipRatePerDay}/day).
                    </p>
                    {pricing.isVip && (
                      <div className="flex items-center justify-between pt-1 border-t border-neutral-700/60 font-mono text-xs text-[#FCE9B0]">
                        <span>VIP Rate ({pricing.totalDays} Days):</span>
                        <span>+R{pricing.vipTotal.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grand Total */}
                <div className="pt-4 pb-6 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-neutral-400 block">
                      Estimated Total Price
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      All activities + King's transport + fees
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-serif-luxury font-bold text-white tracking-tight">
                      R{pricing.grandTotal.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#DFB45E] font-mono block">ZAR</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={onOpenBookingModal}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-[0.99] transition-all shadow-lg gold-glow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#090A0F]" />
                    <span>Book with King via WhatsApp</span>
                  </button>

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
