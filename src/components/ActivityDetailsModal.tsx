import React from 'react';
import { Activity } from '../data/activities';
import { X, MapPin, Clock, Check, Plus, Sparkles, Shield, Compass } from 'lucide-react';
import { CurrencyCode, formatCurrencyRange } from '../utils/currency';

interface ActivityDetailsModalProps {
  activity: Activity | null;
  onClose: () => void;
  isSelected: boolean;
  onToggle: (id: string) => void;
  currency?: CurrencyCode;
}

export const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  activity,
  onClose,
  isSelected,
  onToggle,
  currency = 'ZAR',
}) => {
  if (!activity) return null;

  const isFrom = Boolean(activity.priceNote?.startsWith('From'));
  const minVal = activity.priceMin ?? activity.priceZAR;
  const maxVal = activity.priceMax ?? activity.priceZAR;
  const priceDisplay = formatCurrencyRange(minVal, maxVal, currency, isFrom);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-xl bg-[#0F101A] border border-[#DFB45E]/40 rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
          <img
            src={activity.image}
            alt={activity.name}
            className="w-full h-full object-cover object-center filter brightness-[0.9]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F101A] via-transparent to-black/30" />
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white">
            <span className="flex items-center gap-1 font-medium bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-[#DFB45E]" />
              {activity.region}
            </span>
            <span className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#DFB45E]" />
              {activity.duration}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#DFB45E] font-medium block">
              {activity.category} · {activity.recommendedSlot} Recommended
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury text-white mt-1">
              {activity.name}
            </h3>
            <p className="text-xs text-neutral-400 font-light italic mt-0.5">
              {activity.subtitle}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            {activity.description}
          </p>

          {/* Highlights */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#DFB45E] font-mono mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Experience Highlights</span>
            </h4>
            <div className="space-y-1.5">
              {activity.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                  <span className="text-[#DFB45E] mt-0.5">›</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price & Action Row */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                {activity.priceMax === 0 ? 'Birthday Special' : 'Estimated Price'}
              </span>
              <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-white font-mono">
                {activity.priceMax === 0 ? 'FREE' : priceDisplay}
                {activity.priceMax !== 0 && <span className="text-xs font-sans text-neutral-400 font-normal"> / person</span>}
              </span>
              {activity.birthdayNote && (
                <span className="text-xs text-[#FCE9B0] block mt-0.5 font-medium flex items-center gap-1">
                  🎂 {activity.birthdayNote}
                </span>
              )}
              {activity.priceNote && !activity.birthdayNote && (
                <span className="text-xs text-[#DFB45E] block mt-0.5 font-medium">
                  {activity.priceNote}
                </span>
              )}
              <span className="text-[10px] text-neutral-500 block mt-0.5">* Non-standard rates: Prices may change due to peak time season</span>
            </div>

            <button
              onClick={() => {
                onToggle(activity.id);
                onClose();
              }}
              className={`px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-neutral-800 text-[#FCE9B0] border border-[#DFB45E]/50 hover:bg-neutral-700'
                  : 'bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] text-[#090A0F] hover:brightness-110 active:scale-95 shadow-md gold-glow'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4 text-[#DFB45E]" />
                  <span>Remove from Itinerary</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#090A0F]" />
                  <span>Add to Itinerary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
