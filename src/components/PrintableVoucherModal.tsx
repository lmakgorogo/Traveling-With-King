import React from 'react';
import { Activity } from '../data/activities';
import { ItineraryDay, PricingSummary } from '../utils/itineraryEngine';
import { X, Printer, ShieldCheck, MapPin, Calendar, Users, Car, Check } from 'lucide-react';

interface PrintableVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: ItineraryDay[];
  pricing: PricingSummary;
  startDate?: string;
  endDate?: string;
}

export const PrintableVoucherModal: React.FC<PrintableVoucherModalProps> = ({
  isOpen,
  onClose,
  itinerary,
  pricing,
  startDate,
  endDate,
}) => {
  if (!isOpen) return null;

  const voucherReference = 'TWK-CPT-' + Math.floor(1000 + Math.random() * 9000);
  const issuedDate = new Date().toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Top Floating Action Bar (Hidden when printing) */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-60 flex items-center gap-3 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-95 shadow-xl cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#090A0F]" />
          <span>Print / Save PDF</span>
        </button>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close voucher preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="w-full max-w-3xl bg-[#0C0D14] border border-[#DFB45E]/40 rounded-3xl p-6 sm:p-10 shadow-2xl printable-card my-12 text-white">
        {/* Header with King Logo */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[#DFB45E]/30">
          <div>
            <svg
              className="w-48 sm:w-56 h-auto"
              viewBox="0 0 280 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="voucherGold" x1="0%" y1="0%" x2="100%" y2="100%">
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
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize="48"
                fill="url(#voucherGold)"
              >
                Traveling
              </text>
              <text
                x="10"
                y="104"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize="48"
                fill="url(#voucherGold)"
              >
                with King
              </text>
            </svg>
            <p className="text-xs text-[#E2BD68] tracking-widest uppercase mt-2">
              Official Executive Tour Voucher & Itinerary
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-[#DFB45E] bg-[#DFB45E]/10 border border-[#DFB45E]/30 px-2.5 py-1 rounded-md">
              VOUCHER: {voucherReference}
            </span>
            <div className="text-xs text-neutral-400">
              Date Issued: <span className="text-white font-mono">{issuedDate}</span>
            </div>
            {startDate && endDate && (
              <div className="text-xs text-[#DFB45E]">
                Travel Dates: <span className="text-white font-mono">{startDate} to {endDate}</span>
              </div>
            )}
            <div className="text-xs text-neutral-400">
              Designated Guide: <span className="text-[#FCE9B0] font-medium">King (082 400 7223)</span>
            </div>
            <div className="text-xs text-neutral-400">
              Vehicle: <span className="text-white font-medium">7-Seater Suzuki</span>
            </div>
          </div>
        </div>

        {/* Voyage Overview Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-neutral-800 text-xs">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Duration</span>
            <span className="font-semibold text-white text-sm font-mono">{pricing.totalDays} Days</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Guests</span>
            <span className="font-semibold text-white text-sm font-mono">{pricing.guestsCount} Travelers</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Vehicle</span>
            <span className="font-semibold text-[#DFB45E] text-sm">
              7-Seater Suzuki
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Total Estimate</span>
            <span className="font-semibold text-white text-sm font-mono">
              R{pricing.grandTotal.toLocaleString()} ZAR
            </span>
          </div>
        </div>

        {/* Itinerary Schedule */}
        <div className="py-6 space-y-6">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[#DFB45E]">
            Daily Optimized Route & Timetable
          </h4>

          {itinerary.map((day) => (
            <div key={day.dayNumber} className="border-l-2 border-[#DFB45E]/50 pl-4 py-1 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="text-base font-serif-luxury font-medium text-white">
                  {day.title}
                </h5>
                <span className="text-[11px] text-[#DFB45E] font-mono">
                  {day.zone.approxDistance}
                </span>
              </div>
              <p className="text-xs text-neutral-400 italic">
                King’s Dispatch: {day.kingNotes}
              </p>
              <div className="space-y-1.5 pt-1">
                {day.activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-neutral-900/60 border border-neutral-800/80"
                  >
                    <span className="font-medium text-neutral-200">
                      • {act.name} <span className="text-neutral-400 text-[11px]">({act.recommendedSlot} · {act.duration})</span>
                    </span>
                    <span className="font-mono text-neutral-300">
                      R{act.priceZAR.toLocaleString()} pp
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown Sheet */}
        <div className="pt-4 pb-6 border-t border-neutral-800 text-xs space-y-2.5">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[#DFB45E] mb-2">
            Statement of Costs
          </h4>
          <div className="flex justify-between text-neutral-300">
            <span>Activity Entrance & Tasting Fees ({pricing.guestsCount} Guests)</span>
            <span className="font-mono">R{pricing.activitiesTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>King’s 7-Seater Suzuki Dedicated Transport ({pricing.totalDays} Days @ R{pricing.transportDayRate}/day)</span>
            <span className="font-mono">R{pricing.transportTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Itinerary Curation & Concierge Fee (12%)</span>
            <span className="font-mono">R{pricing.curationFeeTotal.toLocaleString()}</span>
          </div>
          {pricing.isVip && (
            <div className="flex justify-between text-[#FCE9B0]">
              <span>VIP Executive In-Car Package (Priority reservations & fast-track)</span>
              <span className="font-mono">+R{pricing.vipTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-neutral-800 text-sm font-semibold text-white">
            <span>Total Estimated Cost</span>
            <span className="font-mono text-base text-[#DFB45E]">
              R{pricing.grandTotal.toLocaleString()} ZAR
            </span>
          </div>
        </div>

        {/* Footer & Signature */}
        <div className="pt-6 border-t border-[#DFB45E]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DFB45E]" />
            <span>Authorized by Traveling with King Private Transfers</span>
          </div>
          <div className="text-right">
            <span>WhatsApp / Direct Line: <strong className="text-white">082 400 7223</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
