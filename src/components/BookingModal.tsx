import React, { useState, useEffect, useMemo } from 'react';
import {
  ItineraryDay,
  PricingSummary,
  formatWhatsAppMessage,
  formatConfirmationEmail,
} from '../utils/itineraryEngine';
import { CalendarPicker } from './CalendarPicker';
import { MapsAddressInput, LatLngLiteral } from './MapsAddressInput';
import {
  X,
  MessageSquare,
  FileText,
  Calendar,
  User,
  Phone,
  Mail,
  CheckCircle,
  Car,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import { CurrencyCode, formatCurrencyRange } from '../utils/currency';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: ItineraryDay[];
  pricing: PricingSummary;
  onOpenPrintVoucher: () => void;
  startDate: string;
  endDate: string;
  onSelectDates: (start: string, end: string) => void;
  currency?: CurrencyCode;
  departureLocation?: string;
  onUpdateAddressFromMaps?: (addr: string, coords?: LatLngLiteral | null) => void;
  customCoordinates?: LatLngLiteral | null;
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
  currency = 'ZAR',
  departureLocation = '',
  onUpdateAddressFromMaps,
  customCoordinates = null,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [pickup, setPickup] = useState(
    departureLocation && departureLocation !== 'Not yet specified'
      ? departureLocation
      : pricing.isTransportCalculated
      ? pricing.fetchedHotelName
      : ''
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const bookingReference = useMemo(
    () => 'TWK-CPT-' + Math.floor(1000 + Math.random() * 9000),
    [isOpen]
  );

  useEffect(() => {
    if (departureLocation && departureLocation !== 'Not yet specified') {
      setPickup(departureLocation);
    }
  }, [departureLocation]);

  if (!isOpen) return null;

  // King's direct phone number: 0824007223 (WhatsApp: +27824007223)
  const kingWhatsAppNumber = '27824007223';

  const formattedTravelDates =
    startDate && endDate
      ? `${startDate} to ${endDate}`
      : startDate
      ? `From ${startDate}`
      : 'To be confirmed with King';

  const effectivePickup =
    pickup.trim() ||
    (departureLocation !== 'Not yet specified' ? departureLocation : 'Cape Town Hotel / Airbnb');

  const whatsappMessage = formatWhatsAppMessage(
    name,
    phone,
    email,
    formattedTravelDates,
    effectivePickup,
    itinerary,
    pricing
  );

  const whatsappUrl = `https://wa.me/${kingWhatsAppNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const confirmationEmail = formatConfirmationEmail(
    bookingReference,
    name,
    phone,
    email,
    formattedTravelDates,
    effectivePickup,
    itinerary,
    pricing
  );

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Send confirmation email automatically in the background
    if (email.trim()) {
      fetch('/api/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingReference,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          travelDates: formattedTravelDates,
          pickupLocation: effectivePickup,
          itinerary,
          pricing,
          subject: confirmationEmail.subject,
          body: confirmationEmail.body,
        }),
      }).catch((err) => {
        console.error('Automated email dispatch error:', err);
      });
    }

    // 2. Trigger WhatsApp booking inquiry to King
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsSubmitted(true);
  };

  const handleCopyEmailText = () => {
    navigator.clipboard.writeText(confirmationEmail.body);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
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
                Book Your Tour with King
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Confirm your details below. Clicking Book automatically sends your confirmation email directly to your inbox and dispatches your tour inquiry to King (+27 82 400 7223) on WhatsApp awaiting schedule confirmation.
              </p>
            </div>

            {/* Quick Itinerary Summary Box */}
            <div className="bg-[#151726] border border-neutral-800 rounded-2xl p-4 mb-6 text-xs text-neutral-300">
              <div className="flex items-center justify-between font-mono text-[#FCE9B0] pb-2 border-b border-neutral-800/80 mb-2">
                <span>
                  {pricing.totalDays} {pricing.totalDays === 1 ? 'Day' : 'Days'} ·{' '}
                  {pricing.guestsCount} {pricing.guestsCount === 1 ? 'Guest' : 'Guests'}
                </span>
                <span className="font-bold text-sm">
                  {formatCurrencyRange(
                    pricing.grandTotalMin,
                    pricing.grandTotalMax,
                    currency,
                    false,
                    false
                  )}
                </span>
              </div>
              <p className="text-neutral-400 text-[11px] flex items-center gap-1.5 mb-2">
                <Car className="w-3.5 h-3.5 text-[#DFB45E]" />
                <span>
                  King's Dedicated Transport ({pricing.totalDays}{' '}
                  {pricing.totalDays === 1 ? 'Day' : 'Days'}) · Concierge Fee 10%
                </span>
              </p>
              <div className="pt-2 border-t border-neutral-800/80 flex items-center gap-1.5 text-[11px] text-[#DFB45E]">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Please note: Prices may change due to peak time season and supplier rates.
                </span>
              </div>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4">
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
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span>Your Email Address (for Confirmation Email) *</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alexander@example.com"
                    className="w-full bg-[#161826] border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#DFB45E]"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  A booking confirmation with your complete itinerary will be automatically sent to this email address.
                </p>
              </div>

              {/* Google Maps Pickup Address Input */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span>Hotel or Airbnb Pickup Address (Google Maps) *</span>
                  {pricing.isTransportCalculated && (
                    <span className="text-[11px] text-[#DFB45E] font-mono">
                      {pricing.totalDistanceKm} km round trip total
                    </span>
                  )}
                </label>
                <MapsAddressInput
                  value={pickup}
                  coordinates={customCoordinates}
                  onChange={(addr, coords) => {
                    setPickup(addr);
                    if (onUpdateAddressFromMaps && addr.trim()) {
                      onUpdateAddressFromMaps(addr, coords);
                    }
                  }}
                  placeholder="Type your Cape Town hotel or Airbnb street address to pick from Google Maps..."
                  showMapPreview={true}
                />
                {pricing.isTransportCalculated && (
                  <p className="text-[11px] text-neutral-400 mt-1.5 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#DFB45E] shrink-0" />
                    <span>
                      Distance calculated round trip from your pickup address to destinations and back ({pricing.totalDistanceKm} km).
                    </span>
                  </p>
                )}
              </div>

              {/* Interactive Calendar Date Picker Section */}
              <div className="border border-neutral-800 rounded-2xl p-4 bg-[#141624]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#DFB45E]" />
                    <span className="text-xs font-semibold text-white">
                      Travel Dates: <span className="text-[#FCE9B0] font-mono">{formattedTravelDates}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="text-xs text-[#DFB45E] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{showCalendar ? 'Hide Calendar' : 'Change Dates'}</span>
                    {showCalendar ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {showCalendar && (
                  <div className="mt-3 pt-3 border-t border-neutral-800">
                    <CalendarPicker
                      startDate={startDate}
                      endDate={endDate}
                      totalDaysNeeded={pricing.totalDays}
                      onSelectRange={onSelectDates}
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl text-sm font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-95 transition-all shadow-lg gold-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#090A0F]" />
                  <span>Book Now (Send Confirmation Email & WhatsApp)</span>
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
                Your confirmation email is automatically sent to <strong className="text-neutral-400">{email || 'your email'}</strong> and booking details are dispatched to King (082 400 7223) awaiting schedule confirmation.
              </p>
            </form>
          </div>
        ) : (
          /* Submission Confirmation View: Automatic Email Dispatch + WhatsApp to King */
          <div className="space-y-5 py-2">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#DFB45E]/15 border border-[#DFB45E] text-[#DFB45E] flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-mono uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Status: Awaiting King's Confirmation</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono">
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirmation Email Sent Automatically</span>
                </div>
              </div>

              <h3 className="text-2xl font-serif-luxury text-white">
                Booking Confirmed — Reference {bookingReference}
              </h3>
              <p className="text-xs text-neutral-300 max-w-lg mx-auto mt-1">
                Your official booking confirmation email has been automatically sent to <strong className="text-white">{email}</strong>. Tour details have been forwarded to <strong className="text-[#FCE9B0]">King (082 400 7223)</strong> awaiting schedule confirmation.
              </p>
            </div>

            {/* Confirmed Reservation Summary Card */}
            <div className="bg-[#141624] border border-[#DFB45E]/30 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Mail className="w-4 h-4 text-[#DFB45E]" />
                  <span>Confirmation Dispatched to {email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmailText}
                  className="text-[11px] text-[#DFB45E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied Details</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Booking Summary</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0B0D17] p-3 rounded-xl border border-neutral-800/80 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-mono">
                    Travel Dates & Guests
                  </span>
                  <div className="text-white font-medium">{formattedTravelDates}</div>
                  <div className="text-neutral-400 text-[11px]">
                    {pricing.guestsCount} {pricing.guestsCount === 1 ? 'Guest' : 'Guests'} · {pricing.totalDays} Touring {pricing.totalDays === 1 ? 'Day' : 'Days'}
                  </div>
                </div>

                <div className="bg-[#0B0D17] p-3 rounded-xl border border-neutral-800/80 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-mono">
                    Chauffeur & Pickup
                  </span>
                  <div className="text-[#FCE9B0] font-medium truncate">
                    {effectivePickup}
                  </div>
                  <div className="text-neutral-400 text-[11px]">
                    Guide: King (+27 82 400 7223) · {pricing.totalDistanceKm} km round trip
                  </div>
                </div>
              </div>

              <div className="bg-[#0B0D17] p-3 rounded-xl border border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-300">Total Estimated Cost:</span>
                <span className="text-[#DFB45E] font-bold text-sm">
                  {formatCurrencyRange(pricing.grandTotalMin, pricing.grandTotalMax, currency, false, false)}
                </span>
              </div>
            </div>

            {/* Direct Action Links for WhatsApp & Printable Pass */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl text-xs font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4 text-[#090A0F]" />
                <span>Open WhatsApp with King (082 400 7223)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPrintVoucher();
                }}
                className="px-4 py-3 rounded-xl text-xs font-semibold text-white bg-[#1C1F32] hover:bg-[#252942] border border-[#DFB45E]/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#DFB45E]" />
                <span>View Printable Travel Voucher</span>
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 cursor-pointer"
              >
                Done & Return to Itinerary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
