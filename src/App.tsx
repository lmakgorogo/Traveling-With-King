import React, { useState, useMemo } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ACTIVITIES_DATA, Activity } from './data/activities';
import { buildOptimizedItinerary, calculatePricing, resolveDepartureOrHotel } from './utils/itineraryEngine';
import { CurrencyCode } from './utils/currency';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CatalogSection } from './components/CatalogSection';
import { ItinerarySection } from './components/ItinerarySection';
import { MeetKingSection } from './components/MeetKingSection';
import { Footer } from './components/Footer';
import { StickyItineraryBar } from './components/StickyItineraryBar';
import { BookingModal } from './components/BookingModal';
import { PrintableVoucherModal } from './components/PrintableVoucherModal';
import { ActivityDetailsModal } from './components/ActivityDetailsModal';
import { LatLngLiteral } from './components/MapsAddressInput';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function App() {
  // Start with a cleared itinerary so clients can build their trip from scratch
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);

  // Guest count options
  const [guestsCount, setGuestsCount] = useState<number>(2);

  // Multi-Currency Selection (ZAR default, USD, EUR, GBP, AUD supported)
  const [currency, setCurrency] = useState<CurrencyCode>('ZAR');

  // Place of departure state (Calculates transport per km after client enters place of departure)
  const [departureId, setDepartureId] = useState<string>('');
  const [customDepartureAddress, setCustomDepartureAddress] = useState<string>('');
  const [customCoordinates, setCustomCoordinates] = useState<LatLngLiteral | null>(null);

  // Calendar dates state
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });

  // Modals state
  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isPrintVoucherOpen, setIsPrintVoucherOpen] = useState<boolean>(false);

  // Derived selected activities objects
  const selectedActivities = useMemo(() => {
    return ACTIVITIES_DATA.filter((act) => selectedActivityIds.includes(act.id));
  }, [selectedActivityIds]);

  // Derived geographically optimized multi-day itinerary based on hotel or Google Maps address where fetched
  const itinerary = useMemo(() => {
    return buildOptimizedItinerary(selectedActivities, departureId, customDepartureAddress, customCoordinates);
  }, [selectedActivities, departureId, customDepartureAddress, customCoordinates]);

  // Derived pricing breakdown calculated per km from fetched hotel/address to destination and back
  const pricing = useMemo(() => {
    return calculatePricing(selectedActivities, itinerary, guestsCount, false, departureId, customDepartureAddress, customCoordinates);
  }, [selectedActivities, itinerary, guestsCount, departureId, customDepartureAddress, customCoordinates]);

  // Effective departure hotel/address label for vouchers and WhatsApp
  const effectiveDepartureLabel = useMemo(() => {
    const resolved = resolveDepartureOrHotel(departureId, customDepartureAddress, customCoordinates);
    return resolved ? resolved.name : 'Not yet specified';
  }, [departureId, customDepartureAddress, customCoordinates]);

  // Handlers
  const handleToggleActivity = (id: string) => {
    setSelectedActivityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRemoveActivity = (id: string) => {
    setSelectedActivityIds((prev) => prev.filter((item) => item !== id));
  };

  const handleClearAll = () => {
    setSelectedActivityIds([]);
  };

  const handleSelectDates = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleUpdateCustomDeparture = (addr: string, coords?: LatLngLiteral | null) => {
    setCustomDepartureAddress(addr);
    if (coords !== undefined) {
      setCustomCoordinates(coords);
    }
  };

  const handleUpdateAddressFromBookingModal = (addr: string, coords?: LatLngLiteral | null) => {
    setDepartureId('CUSTOM');
    setCustomDepartureAddress(addr);
    if (coords !== undefined) {
      setCustomCoordinates(coords);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <APIProvider apiKey={MAPS_API_KEY} language="en" region="ZA">
      <div className="min-h-screen bg-[#08090D] text-[#F3F4F6] flex flex-col selection:bg-[#DFB45E]/30 selection:text-[#FCE9B0]">
        {/* Top Bar with SVG Logo, Currency Switcher & Navigation */}
        <Navbar
          selectedCount={selectedActivityIds.length}
          onOpenItinerary={() => scrollToSection('how-it-works')}
          currency={currency}
          onSelectCurrency={setCurrency}
        />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onExploreCatalog={() => scrollToSection('catalog')}
            onOpenItinerary={() => scrollToSection('how-it-works')}
            selectedCount={selectedActivityIds.length}
          />

          {/* Catalog of 22+ Activities */}
          <CatalogSection
            selectedActivityIds={selectedActivityIds}
            onToggleActivity={handleToggleActivity}
            onViewDetails={(act) => setDetailActivity(act)}
            currency={currency}
          />

          {/* Smart Geographic Itinerary & Price Breakdown with Departure Hub & Calendar */}
          <ItinerarySection
            itinerary={itinerary}
            pricing={pricing}
            selectedActivities={selectedActivities}
            onRemoveActivity={handleRemoveActivity}
            onClearAll={handleClearAll}
            onUpdateGuests={setGuestsCount}
            onOpenBookingModal={() => setIsBookingModalOpen(true)}
            onOpenPrintVoucher={() => setIsPrintVoucherOpen(true)}
            startDate={startDate}
            endDate={endDate}
            onSelectDates={handleSelectDates}
            currency={currency}
            onSelectCurrency={setCurrency}
            departureId={departureId}
            onSelectDeparture={(id) => {
              setDepartureId(id);
              if (id !== 'CUSTOM') {
                setCustomCoordinates(null);
              }
            }}
            customDepartureAddress={customDepartureAddress}
            onUpdateCustomDeparture={handleUpdateCustomDeparture}
            customCoordinates={customCoordinates}
          />

          {/* Meet King (Personal Chauffeur & Guide) */}
          <MeetKingSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Sticky Bottom Bar for Mobile & Desktop */}
        <StickyItineraryBar
          selectedCount={selectedActivityIds.length}
          pricing={pricing}
          onOpenItinerary={() => scrollToSection('how-it-works')}
          currency={currency}
        />

        {/* Modals */}
        <ActivityDetailsModal
          activity={detailActivity}
          onClose={() => setDetailActivity(null)}
          isSelected={detailActivity ? selectedActivityIds.includes(detailActivity.id) : false}
          onToggle={handleToggleActivity}
          currency={currency}
        />

        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          itinerary={itinerary}
          pricing={pricing}
          onOpenPrintVoucher={() => setIsPrintVoucherOpen(true)}
          startDate={startDate}
          endDate={endDate}
          onSelectDates={handleSelectDates}
          currency={currency}
          departureLocation={effectiveDepartureLabel}
          onUpdateAddressFromMaps={handleUpdateAddressFromBookingModal}
          customCoordinates={customCoordinates}
        />

        <PrintableVoucherModal
          isOpen={isPrintVoucherOpen}
          onClose={() => setIsPrintVoucherOpen(false)}
          itinerary={itinerary}
          pricing={pricing}
          startDate={startDate}
          endDate={endDate}
          currency={currency}
          departureLocation={effectiveDepartureLabel}
        />
      </div>
    </APIProvider>
  );
}
