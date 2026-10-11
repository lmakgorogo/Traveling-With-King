import React from 'react';
import { ArrowDown, Car, Shield, Sparkles, Compass, Users } from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenItinerary: () => void;
  selectedCount: number;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onOpenItinerary, selectedCount }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 sm:pb-24 border-b border-[#DFB45E]/15">
      {/* Background Photography of King's 7-Seater Suzuki on Chapman's Peak */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/suzuki_king_chauffeur_1791729762164.jpg"
          alt="King's 7-seater executive Suzuki touring Chapman's Peak Drive Cape Town"
          className="w-full h-full object-cover object-center filter brightness-[0.5] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/80 to-[#08090D]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(223,180,94,0.12),_transparent_65%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16">
        <div className="max-w-3xl">
          {/* Subtle Editorial Kicker */}
          <div className="flex items-center gap-2 text-xs sm:text-sm tracking-widest text-[#E2BD68] font-medium uppercase mb-4">
            <span>Western Cape & Cape Town</span>
            <span aria-hidden="true">·</span>
            <span>Private Guided Travel</span>
            <span aria-hidden="true">·</span>
            <span>Chauffeured by King</span>
          </div>

          {/* Luxury Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-luxury font-normal text-white tracking-tight leading-[1.08] mb-6 text-balance">
            Bespoke tours, crafted effortlessly. Driven by <span className="gold-gradient-text italic font-medium">King</span>.
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed mb-8 max-w-2xl">
            Select your dream Cape Town activities, wine tastings, and coastal adventures. Our smart engine automatically groups your choices into geographically logical multi-day itineraries with King's comfortable <span className="text-[#FCE9B0] font-medium">7-seater Suzuki</span> private transport.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button
              onClick={onExploreCatalog}
              className="px-6 py-3.5 rounded-full text-sm font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-95 transition-all shadow-lg gold-subtle-glow flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#090A0F]" />
              <span>Select Activities Below</span>
            </button>

            {selectedCount > 0 ? (
              <button
                onClick={onOpenItinerary}
                className="px-6 py-3.5 rounded-full text-sm font-medium text-[#FCE9B0] bg-[#12141F] border border-[#DFB45E]/40 hover:bg-[#1A1D2B] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>View My {selectedCount} Selected Activities</span>
              </button>
            ) : (
              <a
                href="#how-it-works"
                className="px-6 py-3.5 rounded-full text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center gap-2"
              >
                <span>How Geographic Clustering Works</span>
              </a>
            )}
          </div>

          {/* Trust Value Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-neutral-800/80 text-xs text-neutral-300">
            <div className="flex items-center gap-2.5">
              <Car className="w-4 h-4 text-[#DFB45E] shrink-0" />
              <div>
                <p className="font-semibold text-white">7-Seater Suzuki</p>
                <p className="text-[11px] text-neutral-400">R1,500/day dedicated driver</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-[#DFB45E] shrink-0" />
              <div>
                <p className="font-semibold text-white">Zero Criss-Cross Travel</p>
                <p className="text-[11px] text-neutral-400">Geo-sorted daily clusters</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#DFB45E] shrink-0" />
              <div>
                <p className="font-semibold text-white">VIP Executive Upgrades</p>
                <p className="text-[11px] text-neutral-400">Priority reservations</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#DFB45E] shrink-0" />
              <div>
                <p className="font-semibold text-white">WhatsApp 082 400 7223</p>
                <p className="text-[11px] text-neutral-400">Direct booking with King</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
