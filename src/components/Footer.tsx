import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Car } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-800/80 bg-[#07080C] text-neutral-400 text-xs py-12 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-neutral-800/60">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <img
              src="/images/traveling_with_king_logo.png"
              alt="Traveling with King"
              className="w-48 sm:w-56 h-auto object-contain"
            />
            <p className="text-neutral-400 text-xs max-w-sm text-center md:text-left">
              Tailored multi-day private journeys, wine tours, and outdoor adventures across Cape Town and the Western Cape chauffeured in King's 7-seater Suzuki.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-center md:text-right">
            <div className="text-white font-medium">Traveling with King Private Tours</div>
            <div className="text-neutral-400">Cape Town & Western Cape, South Africa</div>
            <div className="text-neutral-400">
              WhatsApp / Call:{' '}
              <a
                href="https://wa.me/27824007223"
                className="text-[#FCE9B0] hover:underline font-mono"
              >
                082 400 7223
              </a>
            </div>
            <div className="text-[#DFB45E] font-mono text-[11px]">Private 7-Seater Suzuki Fleet & Concierge</div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <p>© {new Date().getFullYear()} Traveling with King. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#catalog" className="hover:text-neutral-300 transition-colors">Catalog</a>
            <a href="#how-it-works" className="hover:text-neutral-300 transition-colors">Itinerary Builder</a>
            <a href="#meet-king" className="hover:text-neutral-300 transition-colors">About King</a>
            <a href="https://wa.me/27824007223" className="hover:text-[#FCE9B0] transition-colors">WhatsApp 082 400 7223</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
