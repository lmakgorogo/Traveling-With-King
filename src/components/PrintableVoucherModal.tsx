import React, { useRef, useState } from 'react';
import { ItineraryDay, PricingSummary } from '../utils/itineraryEngine';
import { X, Printer, ShieldCheck, MapPin, Calendar, Users, Car, Check, Info, Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { CurrencyCode, formatCurrencyRange, formatCurrency } from '../utils/currency';

interface PrintableVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: ItineraryDay[];
  pricing: PricingSummary;
  startDate?: string;
  endDate?: string;
  currency?: CurrencyCode;
  departureLocation?: string;
}

export const PrintableVoucherModal: React.FC<PrintableVoucherModalProps> = ({
  isOpen,
  onClose,
  itinerary,
  pricing,
  startDate,
  endDate,
  currency = 'ZAR',
  departureLocation = '',
}) => {
  const voucherRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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

  const handleSavePdf = async () => {
    if (!voucherRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const element = voucherRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0C0D14',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      let heightLeft = scaledHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, scaledHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Subsequent pages if long itinerary
      while (heightLeft > 0) {
        position = heightLeft - scaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, scaledHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`Traveling_With_King_Voucher_${voucherReference}.pdf`);
    } catch (err) {
      console.error('Direct PDF export error, falling back to print dialog:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="voucher-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Top Floating Action Bar (Hidden when printing) */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-60 flex items-center gap-2 sm:gap-3 no-print">
        <button
          onClick={handleSavePdf}
          disabled={isGeneratingPdf}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-95 shadow-xl cursor-pointer disabled:opacity-75"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 text-[#090A0F] animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#090A0F]" />
              <span>Save PDF</span>
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium text-neutral-200 bg-neutral-900 border border-neutral-700 hover:text-white hover:bg-neutral-800 transition-colors shadow-lg cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#DFB45E]" />
          <span className="hidden sm:inline">Print</span>
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
      <div
        ref={voucherRef}
        className="w-full max-w-3xl bg-[#0C0D14] border border-[#DFB45E]/40 rounded-3xl p-6 sm:p-10 shadow-2xl printable-card my-12 text-white"
      >
        {/* Header with King Logo */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[#DFB45E]/30">
          <div>
            <img
              src="/images/traveling_with_king_logo.png"
              alt="Traveling with King"
              className="w-48 sm:w-60 h-auto object-contain"
            />
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
            <div className="text-xs text-neutral-400">
              Hotel Where Fetched: <span className="text-[#FCE9B0] font-medium">{departureLocation || pricing.fetchedHotelName || pricing.departureLocationName || 'Cape Town Hotel'}</span>
            </div>
            {pricing.isTransportCalculated && (
              <div className="text-xs text-neutral-400">
                Total Route Distance: <span className="text-[#DFB45E] font-mono font-semibold">{pricing.totalDistanceKm} km Round Trip</span>
              </div>
            )}
          </div>
        </div>

        {/* Voyage Overview Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-neutral-800 text-xs">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Duration</span>
            <span className="font-semibold text-white text-sm font-mono">{pricing.totalDays} {pricing.totalDays === 1 ? 'Day' : 'Days'}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Guests</span>
            <span className="font-semibold text-white text-sm font-mono">{pricing.guestsCount} Travelers</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Route Distance</span>
            <span className="font-semibold text-[#DFB45E] text-sm font-mono">
              {pricing.isTransportCalculated ? `${pricing.totalDistanceKm} km RT` : 'Pending Hotel'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Total Estimate</span>
            <span className="font-semibold text-white text-sm font-mono">
              {formatCurrencyRange(pricing.grandTotalMin, pricing.grandTotalMax, currency, false, true)}
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
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h5 className="text-base font-serif-luxury font-medium text-white">
                  {day.title}
                </h5>
                <span className="text-[11px] text-[#DFB45E] font-mono font-semibold">
                  {day.transportCalculated
                    ? `${day.roundTripKm} km round trip · ${formatCurrency(day.transportCost, currency)}`
                    : day.zone.approxDistance}
                </span>
              </div>
              {day.transportCalculated && day.routePath && (
                <div className="text-[11px] text-neutral-300 font-mono bg-neutral-900/80 px-2.5 py-1 rounded border border-neutral-800">
                  Route: {day.routePath}
                </div>
              )}
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
                      {act.priceMax === 0 ? (
                        <span className="text-[#FCE9B0] font-semibold">FREE (Birthday Special)</span>
                      ) : act.priceNote?.startsWith('From') ? (
                        <>From R{act.priceMin.toLocaleString()} pp</>
                      ) : act.priceMin && act.priceMax && act.priceMin !== act.priceMax ? (
                        <>R{act.priceMin.toLocaleString()} – R{act.priceMax.toLocaleString()} pp</>
                      ) : (
                        <>R{(act.priceMin || act.priceZAR).toLocaleString()} pp</>
                      )}
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
            <span className="font-mono">
              {pricing.activitiesTotalMin !== pricing.activitiesTotalMax ? (
                <>R{pricing.activitiesTotalMin.toLocaleString()} – R{pricing.activitiesTotalMax.toLocaleString()}</>
              ) : (
                <>R{pricing.activitiesTotal.toLocaleString()}</>
              )}
            </span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>
              King’s Dedicated Private Transport (
              {pricing.isTransportCalculated
                ? `${pricing.totalDistanceKm} km round trip across ${pricing.totalDays} ${pricing.totalDays === 1 ? 'Day' : 'Days'}`
                : `${pricing.totalDays} ${pricing.totalDays === 1 ? 'Day' : 'Days'}`}
              )
            </span>
            <span className="font-mono">
              {pricing.isTransportCalculated
                ? formatCurrency(pricing.transportTotal, currency)
                : 'Select hotel to calculate km'}
            </span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Concierge Fee (10%)</span>
            <span className="font-mono">
              {formatCurrencyRange(pricing.curationFeeTotalMin, pricing.curationFeeTotalMax, currency)}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-neutral-800 text-sm font-semibold text-white">
            <span>Estimated Cost</span>
            <span className="font-mono text-base text-[#DFB45E]">
              {formatCurrencyRange(pricing.grandTotalMin, pricing.grandTotalMax, currency, false, false)}
            </span>
          </div>
          <div className="pt-2 text-[10px] text-neutral-400 flex items-center gap-1.5 italic">
            <Info className="w-3.5 h-3.5 text-[#DFB45E] shrink-0" />
            <span>* Notice: Prices are non-standard and vary between off-peak and peak holiday season supplier rates.</span>
          </div>
        </div>


        {/* Footer & Signature */}
        <div className="pt-6 border-t border-[#DFB45E]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DFB45E]" />
            <span>Authorized by Traveling with King Private Transfers & Tours</span>
          </div>
          <div className="text-right">
            <span>WhatsApp / Chauffeur Line: <strong className="text-white">082 400 7223</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
