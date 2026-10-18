import React from 'react';
import { Calendar } from 'lucide-react';
import { CurrencyCode } from '../utils/currency';
import { CurrencySelector } from './CurrencySelector';

interface NavbarProps {
  selectedCount: number;
  onOpenItinerary: () => void;
  currency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCount,
  onOpenItinerary,
  currency,
  onSelectCurrency,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090A0F]/90 backdrop-blur-md border-b border-[#DFB45E]/20 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: Brand Logo */}
        <a href="#" className="flex items-center shrink-0 group py-1" aria-label="Traveling with King Home">
          <img
            src="/images/traveling_with_king_logo.png"
            alt="Traveling with King"
            className="w-40 sm:w-52 md:w-56 h-auto max-h-16 object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-300">
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
        </nav>


        {/* Zone 3: Currency Switcher & Primary Action */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Multi-Currency Dropdown */}
          <CurrencySelector
            currentCurrency={currency}
            onSelectCurrency={onSelectCurrency}
            variant="navbar"
          />

          <button
            onClick={onOpenItinerary}
            className="relative flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-95 transition-all shadow-md gold-subtle-glow whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#090A0F]" />
            <span className="hidden sm:inline">View Itinerary</span>
            <span className="sm:hidden">Trip</span>
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
