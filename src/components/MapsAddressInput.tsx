// Source: Google Maps Platform Code Assist
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Map, AdvancedMarker, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useAutocompleteSuggestions } from '../hooks/useAutocompleteSuggestions';
import { MapPin, Loader2, Check, Navigation } from 'lucide-react';

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface MapsAddressInputProps {
  value: string;
  onChange: (address: string, coords?: LatLngLiteral | null) => void;
  placeholder?: string;
  showMapPreview?: boolean;
  coordinates?: LatLngLiteral | null;
}

export const MapsAddressInput: React.FC<MapsAddressInputProps> = ({
  value,
  onChange,
  placeholder = 'Start typing your Cape Town Airbnb or street address...',
  showMapPreview = true,
  coordinates = null,
}) => {
  const placesLib = useMapsLibrary('places');
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [pickedCoords, setPickedCoords] = useState<LatLngLiteral | null>(coordinates);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (coordinates) {
      setPickedCoords(coordinates);
    }
  }, [coordinates]);

  // Close suggestions dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bias autocomplete suggestions toward Cape Town & Western Cape
  const { suggestions, isLoading, resetSession } = useAutocompleteSuggestions(
    isOpen ? query : ''
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setQuery(nextVal);
    setIsOpen(true);
    onChange(nextVal, pickedCoords);
  };

  const handleSelectSuggestion = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!placesLib || !suggestion.placePrediction) return;

      try {
        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({
          fields: ['displayName', 'formattedAddress', 'location'],
        });

        const displayName = place.displayName || '';
        const formattedAddress = place.formattedAddress || suggestion.placePrediction.text?.text || '';
        const fullLabel =
          displayName && !formattedAddress.toLowerCase().includes(displayName.toLowerCase())
            ? `${displayName}, ${formattedAddress}`
            : formattedAddress || displayName;

        let coords: LatLngLiteral | null = null;
        if (place.location) {
          coords = {
            lat: place.location.lat(),
            lng: place.location.lng(),
          };
          setPickedCoords(coords);
        }

        setQuery(fullLabel);
        setIsOpen(false);
        onChange(fullLabel, coords);
        resetSession();
      } catch (err) {
        console.error('Failed to fetch selected place details:', err);
        const fallbackText = suggestion.placePrediction.text?.text || query;
        setQuery(fallbackText);
        setIsOpen(false);
        onChange(fallbackText, null);
        resetSession();
      }
    },
    [placesLib, onChange, query, resetSession]
  );

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DFB45E]" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-[#0B0D17] border border-neutral-700 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#DFB45E]"
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DFB45E] animate-spin" />
        )}
        {!isLoading && query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setPickedCoords(null);
              onChange('', null);
              resetSession();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs cursor-pointer"
            aria-label="Clear address"
          >
            ✕
          </button>
        )}

        {/* Google Maps Autocomplete Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-1.5 bg-[#111320] border border-[#DFB45E]/50 rounded-xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto">
            <div className="px-3 py-1.5 bg-[#16192B] border-b border-neutral-800 flex items-center justify-between text-[10px] text-[#DFB45E] uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3 h-3" />
                <span>Google Maps Suggestions</span>
              </span>
              <span className="text-neutral-400">Select to pin exact location</span>
            </div>
            <ul className="divide-y divide-neutral-800/70">
              {suggestions.map((suggestion, index) => {
                const mainText =
                  suggestion.placePrediction?.mainText?.text ||
                  suggestion.placePrediction?.text?.text ||
                  '';
                const secondaryText =
                  suggestion.placePrediction?.secondaryText?.text || '';

                return (
                  <li key={suggestion.placePrediction?.placeId || index}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#DFB45E]/15 transition-colors flex items-start gap-2.5 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-[#DFB45E] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {mainText}
                        </div>
                        {secondaryText && (
                          <div className="text-[11px] text-neutral-400 truncate">
                            {secondaryText}
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Interactive Google Map Preview when coordinates are selected */}
      {showMapPreview && pickedCoords && (
        <div className="rounded-xl overflow-hidden border border-[#DFB45E]/30 bg-[#0B0D17]">
          <div className="px-3 py-1.5 bg-[#121524] border-b border-neutral-800 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium truncate">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Pinned on Google Maps: {query}</span>
            </span>
            <span className="text-[10px] font-mono text-[#FCE9B0] shrink-0 ml-2">
              {pickedCoords.lat.toFixed(4)}, {pickedCoords.lng.toFixed(4)}
            </span>
          </div>
          <div style={{ height: '160px', width: '100%' }}>
            <Map
              mapId="DEMO_MAP_ID"
              center={pickedCoords}
              zoom={14}
              gestureHandling="cooperative"
              disableDefaultUI={true}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            >
              <AdvancedMarker position={pickedCoords} />
            </Map>
          </div>
        </div>
      )}
    </div>
  );
};
