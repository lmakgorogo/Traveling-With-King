import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencyCode, CURRENCIES } from '../utils/currency';

interface CurrencySelectorProps {
  currentCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
  variant?: 'navbar' | 'compact' | 'pills';
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onSelectCurrency,
  variant = 'navbar',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = CURRENCIES[currentCurrency];
  const currencyList = Object.values(CURRENCIES);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'pills') {
    return (
      <div className="flex items-center gap-1.5 bg-[#0D0F19] p-1.5 rounded-xl border border-neutral-800 overflow-x-auto">
        {currencyList.map((c) => {
          const isActive = c.code === currentCurrency;
          return (
            <button
              key={c.code}
              onClick={() => onSelectCurrency(c.code)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-[#DFB45E] to-[#BA8936] text-[#090A0F] font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141624] hover:bg-[#1C1F32] border border-[#DFB45E]/30 text-xs text-neutral-200 transition-all cursor-pointer hover:border-[#DFB45E]/60 shadow-sm"
        aria-label="Select Currency"
      >
        <span className="text-sm leading-none">{selected.flag}</span>
        <span className="font-sans font-medium text-[#FCE9B0]">{selected.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#DFB45E] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#111320] border border-[#DFB45E]/40 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] uppercase tracking-wider text-neutral-400 font-sans border-b border-neutral-800/80 mb-1.5">
            Select Currency
          </div>
          <div className="space-y-1">
            {currencyList.map((c) => {
              const isActive = c.code === currentCurrency;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    onSelectCurrency(c.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#DFB45E]/20 text-[#FCE9B0] font-semibold border border-[#DFB45E]/40'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{c.flag}</span>
                    <span className="font-sans font-medium">{c.name}</span>
                  </div>
                  {isActive && <span className="text-[#DFB45E] text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
