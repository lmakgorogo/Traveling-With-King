import React, { useState } from 'react';
import { ItineraryDay, PricingSummary, formatWhatsAppMessage } from '../utils/itineraryEngine';
import { CalendarPicker } from './CalendarPicker';
import {
  X,
  MessageSquare,
  FileText,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
  Car,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: ItineraryDay[];
  pricing: PricingSummary;
  onOpenPrintVoucher: () => void;
  startDate: string;
  endDate: string;
  onSelectDates: (start: string, end: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  itinerary,
  pricing,
  onOpenPrintVoucher,
  startDate,
  endDate,
  onSelectDates,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showCalendar, setShowCalendar] = useState(true);
  const [pickup, setPickup] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  // King's direct phone number: 0824007223 (WhatsApp: +27824007223)
  const kingWhatsAppNumber = '27824007223';

  const formattedTravelDates = startDate && endDate
    ? `${startDate} to ${endDate}`
    : startDate
    ? `From ${startDate}`
    : 'To be confirmed with King';

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedMessage = formatWhatsAppMessage(
      name,
      phone,
      email,
      formattedTravelDates,
      pickup,
      itinerary,
      pricing
    );

    const encoded = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/${kingWhatsAppNumber}?text=${encoded}`;

    // Open WhatsApp in a clean tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-2xl bg-[#0F101A] border border-[#DFB45E]/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 gold-glow">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-6">
              <span className="text-[11px] uppercase tracking-widest text-[#DFB45E] font-medium block">
                Direct Chauffeur & Guide Booking
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury text-white mt-1">
                Submit Your Itinerary to King
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Review your {pricing.totalDays}-day Western Cape experience. Select your travel dates on the calendar and dispatch your booking directly to King (082 400 7223) on WhatsApp.
              </p>
            </div>

            {/* Quick Itinerary Summary Box */}
            <div className="bg-[#151726] border border-neutral-800 rounded-2xl p-4 mb-6 text-xs text-neutral-300">
              <div className="flex items-center justify-between font-mono text-[#FCE9B0] pb-2 border-b border-neutral-800/80 mb-2">
                <span>{pricing.totalDays} Days · {pricing.guestsCount} Guests</span>
                <span className="font-bold text-sm">R{pricing.grandTotal.toLocaleString()} ZAR</span>
              </div>
              <p className="text-neutral-400 text-[11px] flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#DFB45E]" />
                <span>King's 7-Seater Suzuki Dedicated Transport (R{pricing.transportDayRate}/day) · 12% curation fee {pricing.isVip && '· VIP In-Vehicle Experience'}</span>
              </p>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alexander Vance"
                      className="w-full bg-[#161826] border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#DFB45E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    WhatsApp / Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+27 (0) ... or +1 ..."
                      className="w-full bg-[#161826] border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#DFB45E]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alexander@example.com"
                    className="w-full bg-[#161826] border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#DFB45E]"
                  />
                </div>
              </div>

              {/* Interactive Calendar Date Picker Section */}
              <div className="border border-neutral-800 rounded-2xl p-4 bg-[#141624]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#DFB45E]" />
                    <span className="text-xs font-semibold text-white">
                      Select Travel Dates on Calendar
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="text-xs text-[#DFB45E] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{showCalendar ? 'Hide Calendar' : 'Show Calendar'}</span>
                    {showCalendar ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showCalendar && (
                  <CalendarPicker
                    startDate={startDate}
                    endDate={endDate}
                    totalDaysNeeded={pricing.totalDays}
                    onSelectRange={onSelectDates}
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Cape Town Pickup Address / Hotel
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="e.g. The Silo Hotel, V&A Waterfront / Villa in Camps Bay"
                    className="w-full bg-[#161826] border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#DFB45E]"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl text-sm font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-95 transition-all shadow-lg gold-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#090A0F]" />
                  <span>Send Direct WhatsApp to King (082 400 7223)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPrintVoucher();
                  }}
                  className="w-full sm:w-auto py-3.5 px-4 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#DFB45E]" />
                  <span>Print Voucher</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-neutral-500 pt-1">
                King (082 400 7223) will reply directly on WhatsApp with availability and pickup coordination.
              </p>
            </form>
          </div>
        ) : (
          /* Submission Confirmation View */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#DFB45E]/10 border border-[#DFB45E] text-[#DFB45E] flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif-luxury text-white mb-2">
              WhatsApp Booking Dispatched to King!
            </h3>
            <p className="text-xs text-neutral-300 max-w-md mx-auto mb-6">
              Your customized itinerary for <strong className="text-white">{formattedTravelDates}</strong> was sent to King at <strong className="text-[#FCE9B0]">082 400 7223</strong>. You can also generate and download your luxury travel voucher.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenPrintVoucher();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-[#090A0F] bg-[#DFB45E] hover:bg-[#FCE9B0] transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#090A0F]" />
                <span>Open Printable Luxury Travel Pass</span>
              </button>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800"
              >
                Back to Itinerary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
