import React from 'react';
import { Activity } from '../data/activities';
import { X, MapPin, Clock, Check, Plus, Sparkles, Shield, Compass } from 'lucide-react';

interface ActivityDetailsModalProps {
  activity: Activity | null;
  onClose: () => void;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  activity,
  onClose,
  isSelected,
  onToggle,
}) => {
  if (!activity) return null;

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
            <p className="text-xs text-neutral-400 italic mt-0.5">
              {activity.subtitle}
            </p>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed font-light">
            {activity.description}
          </p>

          {/* Highlights */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#DFB45E]" />
              <span>Experience Highlights</span>
            </h4>
            <div className="space-y-1.5">
              {activity.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DFB45E]" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price & Action Row */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Estimated Price</span>
              <span className="text-2xl font-serif-luxury font-bold text-white font-mono">
                R{activity.priceZAR.toLocaleString()}{' '}
                <span className="text-xs font-sans text-neutral-400 font-normal">/ person</span>
              </span>
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
