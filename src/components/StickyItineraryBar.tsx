import React from 'react';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { PricingSummary } from '../utils/itineraryEngine';

interface StickyItineraryBarProps {
  selectedCount: number;
  pricing: PricingSummary;
  onOpenItinerary: () => void;
}

export const StickyItineraryBar: React.FC<StickyItineraryBarProps> = ({
  selectedCount,
  pricing,
  onOpenItinerary,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 p-2 sm:p-4 bg-gradient-to-t from-[#08090D] via-[#08090D]/95 to-transparent no-print pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-[#12141F]/95 backdrop-blur-md border border-[#DFB45E]/40 rounded-2xl p-3 sm:py-3.5 sm:px-5 shadow-2xl flex items-center justify-between gap-3 gold-subtle-glow">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#DFB45E] to-[#BA8936] text-[#090A0F] font-bold font-mono text-sm flex items-center justify-center shrink-0">
              {selectedCount}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                <span>{selectedCount} {selectedCount === 1 ? 'Activity' : 'Activities'} Selected</span>
                <span className="text-[#DFB45E] hidden sm:inline">({pricing.totalDays} {pricing.totalDays === 1 ? 'Day' : 'Days'})</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                Est. Total: <span className="text-[#FCE9B0] font-semibold">R{pricing.grandTotal.toLocaleString()} ZAR</span>
              </div>
            </div>
          </div>

          {/* Right Action */}
          <button
            onClick={onOpenItinerary}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-4 h-4 text-[#090A0F]" />
            <span>Review Itinerary</span>
            <ChevronRight className="w-4 h-4 text-[#090A0F]" />
          </button>
        </div>
      </div>
    </div>
  );
};
