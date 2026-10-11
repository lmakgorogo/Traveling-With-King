import React from 'react';
import { Calendar, Compass, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  selectedCount: number;
  onOpenItinerary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ selectedCount, onOpenItinerary }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090A0F]/90 backdrop-blur-md border-b border-[#DFB45E]/20 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Brand Wordmark (Exact SVG provided by client) */}
        <a href="#" className="flex items-center shrink-0 group py-1" aria-label="Traveling with King Home">
          <svg
            className="w-44 sm:w-56 h-auto transition-transform duration-300 group-hover:scale-[1.02]"
            viewBox="0 0 280 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="goldWordmark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFB45E" />
                <stop offset="25%" stopColor="#FCE9B0" />
                <stop offset="50%" stopColor="#E2BD68" />
                <stop offset="80%" stopColor="#D4A74E" />
                <stop offset="100%" stopColor="#BA8936" />
              </linearGradient>
            </defs>
            <text
              x="10"
              y="52"
              fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
              fontSize="48"
              fill="url(#goldWordmark)"
              fontWeight="normal"
              letterSpacing="-1"
            >
              Traveling
            </text>
            <text
              x="10"
              y="104"
              fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
              fontSize="48"
              fill="url(#goldWordmark)"
              fontWeight="normal"
              letterSpacing="-1"
            >
              with King
            </text>
          </svg>
        </a>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <a
            href="#catalog"
            className="hover:text-[#FCE9B0] transition-colors whitespace-nowrap shrink-0"
          >
            Activity Catalog
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#FCE9B0] transition-colors whitespace-nowrap shrink-0"
          >
            Smart Itinerary
          </a>
          <a
            href="#meet-king"
            className="hover:text-[#FCE9B0] transition-colors whitespace-nowrap shrink-0"
          >
            Meet King
          </a>
          <a
            href="#pricing"
            className="hover:text-[#FCE9B0] transition-colors whitespace-nowrap shrink-0"
          >
            Pricing & VIP
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenItinerary}
            className="relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-95 transition-all shadow-md gold-subtle-glow whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#090A0F]" />
            <span>View Itinerary</span>
            {selectedCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#090A0F] text-[#FCE9B0] text-[11px] font-bold font-mono">
                {selectedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
