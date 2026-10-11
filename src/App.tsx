import React, { useState, useMemo } from 'react';
import { ACTIVITIES_DATA, Activity } from './data/activities';
import { buildOptimizedItinerary, calculatePricing } from './utils/itineraryEngine';
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

export default function App() {
  // Start with a cleared itinerary so clients can build their trip from scratch
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);

  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [isVip, setIsVip] = useState<boolean>(false);

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

  // Derived geographically optimized multi-day itinerary
  const itinerary = useMemo(() => {
    return buildOptimizedItinerary(selectedActivities);
  }, [selectedActivities]);

  // Derived pricing breakdown
  const pricing = useMemo(() => {
    return calculatePricing(selectedActivities, itinerary.length, guestsCount, isVip);
  }, [selectedActivities, itinerary.length, guestsCount, isVip]);

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F3F4F6] flex flex-col selection:bg-[#DFB45E]/30 selection:text-[#FCE9B0]">
      {/* Top Bar with SVG Logo & Nav Contract */}
      <Navbar
        selectedCount={selectedActivityIds.length}
        onOpenItinerary={() => scrollToSection('how-it-works')}
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
        />

        {/* Smart Geographic Itinerary & Price Breakdown with Calendar */}
        <ItinerarySection
          itinerary={itinerary}
          pricing={pricing}
          selectedActivities={selectedActivities}
          onRemoveActivity={handleRemoveActivity}
          onClearAll={handleClearAll}
          onUpdateGuests={setGuestsCount}
          onToggleVip={setIsVip}
          onOpenBookingModal={() => setIsBookingModalOpen(true)}
          onOpenPrintVoucher={() => setIsPrintVoucherOpen(true)}
          startDate={startDate}
          endDate={endDate}
          onSelectDates={handleSelectDates}
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
      />

      {/* Modals */}
      <ActivityDetailsModal
        activity={detailActivity}
        onClose={() => setDetailActivity(null)}
        isSelected={detailActivity ? selectedActivityIds.includes(detailActivity.id) : false}
        onToggle={handleToggleActivity}
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
      />

      <PrintableVoucherModal
        isOpen={isPrintVoucherOpen}
        onClose={() => setIsPrintVoucherOpen(false)}
        itinerary={itinerary}
        pricing={pricing}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
