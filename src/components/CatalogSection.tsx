import React, { useState, useMemo } from 'react';
import { Activity, ACTIVITIES_DATA, REGIONAL_ZONES } from '../data/activities';
import { ActivityCard } from './ActivityCard';
import { Search, SlidersHorizontal, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

import { CurrencyCode } from '../utils/currency';

interface CatalogSectionProps {
  selectedActivityIds: string[];
  onToggleActivity: (id: string) => void;
  onViewDetails: (activity: Activity) => void;
  currency?: CurrencyCode;
}

const CATEGORIES = [
  'All Experiences',
  'Free Birthday Treats 🎂',
  'Wine & Culinary',
  'Iconic Scenic',
  'Adrenaline & Air',
  'Wildlife & Safari',
  'Ocean & Coastal',
];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  selectedActivityIds,
  onToggleActivity,
  onViewDetails,
  currency = 'ZAR',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Experiences');
  const [activeZone, setActiveZone] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredActivities = useMemo(() => {
    return ACTIVITIES_DATA.filter((act) => {
      const matchesCategory =
        activeCategory === 'All Experiences'
          ? true
          : activeCategory === 'Free Birthday Treats 🎂'
          ? act.category === 'Free Birthday Treats' || act.isBirthdaySpecial === true
          : act.category === activeCategory;
      const matchesZone = activeZone === 'ALL' || act.zoneId === activeZone;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        act.name.toLowerCase().includes(query) ||
        act.region.toLowerCase().includes(query) ||
        act.description.toLowerCase().includes(query) ||
        act.subtitle.toLowerCase().includes(query);

      return matchesCategory && matchesZone && matchesQuery;
    });
  }, [activeCategory, activeZone, searchQuery]);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-neutral-800">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#DFB45E] font-medium mb-2">
            Curated Western Cape Experiences
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-normal text-white">
            Choose What You Want to Experience
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-xl">
            Select any destinations, birthday treats, or thrills below. King’s smart scheduling engine will automatically group them into cohesive days with private round-trip transfers. <span className="text-neutral-500 text-xs block sm:inline sm:ml-1 font-sans">*Prices may change due to peak time season.</span>
          </p>
        </div>

        {/* Selected Count Indicator */}
        <div className="flex items-center gap-3 bg-[#12141F] px-4 py-2.5 rounded-2xl border border-[#DFB45E]/30 shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#DFB45E] to-[#BA8936] text-[#090A0F] font-mono font-bold flex items-center justify-center text-sm">
            {selectedActivityIds.length}
          </div>
          <div className="text-xs">
            <span className="font-semibold text-white block">
              {selectedActivityIds.length === 1 ? '1 Activity Selected' : `${selectedActivityIds.length} Activities Selected`}
            </span>
            <span className="text-neutral-400">Ready to organize into days</span>
          </div>
        </div>
      </div>

      {/* Birthday Banner Spotlight */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1B160C] via-[#15141D] to-[#12141F] border border-[#DFB45E]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#DFB45E]/20 border border-[#DFB45E]/50 flex items-center justify-center text-2xl shrink-0">
            🎂
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#FCE9B0]">Celebrating Your Birthday in Cape Town?</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DFB45E] text-[#090A0F] uppercase">R0 Free Perks</span>
            </div>
            <p className="text-xs text-neutral-300 mt-0.5">
              Enjoy complimentary entry to Table Mountain, Two Oceans Aquarium, The Cape Wheel, Robben Island, Galileo Cinema & more with valid SA ID. King provides your private 7-seater chauffeured transfers!
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveCategory('Free Birthday Treats 🎂')}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] to-[#BA8936] hover:brightness-110 transition-all shrink-0 cursor-pointer shadow-sm"
        >
          View Free Birthday Treats
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by activity, town (e.g. Stellenbosch, Langebaan)..."
              className="w-full bg-[#12141F] border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#DFB45E]/70 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Dropdown Filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#DFB45E] shrink-0" />
            <select
              value={activeZone}
              onChange={(e) => setActiveZone(e.target.value)}
              aria-label="Filter by geographic region"
              className="bg-[#12141F] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#DFB45E]/70 transition-colors cursor-pointer"
            >
              <option value="ALL">All Regional Zones</option>
              {Object.values(REGIONAL_ZONES).map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs (Segmented Controls) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DFB45E] to-[#BA8936] text-[#090A0F] font-semibold shadow-sm'
                    : 'bg-[#12141F] text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isSelected={selectedActivityIds.includes(activity.id)}
              onToggle={onToggleActivity}
              onViewDetails={onViewDetails}
              currency={currency}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#12141F]/40 border border-neutral-800/70 rounded-2xl p-8">
          <Filter className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
          <h3 className="text-lg font-serif-luxury text-white mb-1">No activities found</h3>
          <p className="text-xs text-neutral-400 mb-4">
            Try adjusting your search query or selecting a different region or category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All Experiences');
              setActiveZone('ALL');
            }}
            className="px-4 py-2 text-xs font-semibold text-[#090A0F] bg-[#DFB45E] rounded-xl hover:bg-[#FCE9B0] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
