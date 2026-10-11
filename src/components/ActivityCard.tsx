import React from 'react';
import { Activity } from '../data/activities';
import { Check, Plus, Clock, MapPin, Sparkles, ChevronRight } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  isSelected: boolean;
  onToggle: (activityId: string) => void;
  onViewDetails: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isSelected,
  onToggle,
  onViewDetails,
}) => {
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
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-[0.9]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Elegant fallback if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F17] via-transparent to-black/30" />

        {/* Region & Timing Info (Clean unboxed text over image) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 drop-shadow-md">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#DFB45E]" />
            {activity.region}
          </span>
          <span className="flex items-center gap-1 text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-[#DFB45E]" />
            {activity.duration}
          </span>
        </div>

        {/* Selected Badge Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 bg-[#DFB45E] text-[#090A0F] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Selected</span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Category kicker */}
          <div className="text-[11px] uppercase tracking-wider text-[#DFB45E]/80 font-medium mb-1">
            {activity.category}
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
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Estimated Entry</div>
            <div className="text-base font-semibold font-mono tabular-nums text-white">
              R{activity.priceZAR.toLocaleString()}{' '}
              <span className="text-[11px] font-sans font-normal text-neutral-400">/ person</span>
            </div>
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
