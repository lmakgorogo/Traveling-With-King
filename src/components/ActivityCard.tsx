import React from 'react';
import { Activity } from '../data/activities';
import { Check, Plus, Clock, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { CurrencyCode, formatCurrencyRange, formatCurrency } from '../utils/currency';

interface ActivityCardProps {
  activity: Activity;
  isSelected: boolean;
  onToggle: (activityId: string) => void;
  onViewDetails: (activity: Activity) => void;
  currency?: CurrencyCode;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isSelected,
  onToggle,
  onViewDetails,
  currency = 'ZAR',
}) => {
  const isFrom = Boolean(activity.priceNote?.startsWith('From'));
  const minVal = activity.priceMin ?? activity.priceZAR;
  const maxVal = activity.priceMax ?? activity.priceZAR;

  const isBirthdayFree = activity.priceMax === 0;
  const priceDisplay = isBirthdayFree
    ? 'FREE'
    : formatCurrencyRange(minVal, maxVal, currency, isFrom);

  return (
    <article
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 border ${
        isSelected
          ? 'bg-[#12141F] border-[#DFB45E] shadow-lg shadow-[#DFB45E]/10 ring-1 ring-[#DFB45E]/50'
          : 'bg-[#0E0F17] border-neutral-800/90 hover:border-neutral-700/80 hover:bg-[#12131D]'
      }`}
    >
      {/* Media Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-900">
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F17] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#090A0F]/85 backdrop-blur-md text-[#DFB45E] border border-[#DFB45E]/30 shadow-sm">
              {activity.category}
            </span>
            {activity.isBirthdaySpecial && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DFB45E] text-[#090A0F] shadow-sm flex items-center gap-1">
                🎂 Birthday Treat
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-neutral-300 bg-black/75 backdrop-blur-md border border-neutral-700/60 shadow-sm shrink-0">
            <Clock className="w-3 h-3 text-[#DFB45E]" />
            <span>{activity.duration}</span>
          </span>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute bottom-3 right-3 bg-gradient-to-r from-[#DFB45E] to-[#BA8936] text-[#090A0F] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Added to Trip</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Region and Slot */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#DFB45E]" />
              <span className="truncate max-w-[140px]">{activity.region}</span>
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              {activity.recommendedSlot}
            </span>
          </div>

          <h3 className="text-lg font-serif-luxury font-medium text-white group-hover:text-[#FCE9B0] transition-colors leading-snug mb-1">
            {activity.name}
          </h3>

          <p className="text-xs text-neutral-400 font-light mb-3 italic">
            {activity.subtitle}
          </p>

          <p className="text-xs text-neutral-300 font-normal line-clamp-2 leading-relaxed mb-4">
            {activity.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3 mt-auto">
          <div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
              {isBirthdayFree ? 'Birthday Rate' : 'Estimated Entry'}
            </div>
            <div className={`text-sm sm:text-base font-semibold font-mono tabular-nums ${isBirthdayFree ? 'text-[#FCE9B0]' : 'text-white'}`}>
              {priceDisplay}
              {!isBirthdayFree && <span className="text-[11px] font-sans font-normal text-neutral-400"> / person</span>}
            </div>
            {activity.priceNote && (
              <div className="text-[10px] text-[#DFB45E]/80 truncate max-w-[150px] sm:max-w-[190px]" title={activity.priceNote}>
                {activity.priceNote}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(activity)}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors text-xs flex items-center gap-0.5 cursor-pointer"
              title="View Highlights"
            >
              <span>Info</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onToggle(activity.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-neutral-800 text-[#FCE9B0] hover:bg-neutral-700 border border-[#DFB45E]/40'
                  : 'bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] text-[#090A0F] hover:brightness-110 active:scale-95'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#DFB45E]" />
                  <span>Remove</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-[#090A0F]" />
                  <span>Add to Trip</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
