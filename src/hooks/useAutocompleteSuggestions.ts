// Source: Google Maps Platform Code Assist
import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

export type UseAutocompleteSuggestionsReturn = {
  suggestions: google.maps.places.AutocompleteSuggestion[];
  isLoading: boolean;
  resetSession: () => void;
};

/**
 * Retrieves autocomplete suggestions from the Google Places API (New)
 * using AutocompleteSuggestion.fetchAutocompleteSuggestions and session tokens.
 */
export function useAutocompleteSuggestions(
  inputString: string,
  requestOptions: Partial<google.maps.places.AutocompleteRequest> = {}
): UseAutocompleteSuggestionsReturn {
  const placesLib = useMapsLibrary('places');

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!placesLib) return;

    const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;

    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    const trimmed = inputString.trim();
    if (trimmed.length < 2) {
      if (suggestions.length > 0) setSuggestions([]);
      return;
    }

    const request: google.maps.places.AutocompleteRequest = {
      ...requestOptions,
      input: trimmed,
      includedRegionCodes: ['za'],
      sessionToken: sessionTokenRef.current,
    };

    setIsLoading(true);

    AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
      .then((res) => {
        setSuggestions(res.suggestions || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching Google Maps autocomplete suggestions:', err);
        setIsLoading(false);
      });
  }, [placesLib, inputString]);

  return {
    suggestions,
    isLoading,
    resetSession: () => {
      sessionTokenRef.current = null;
      setSuggestions([]);
    },
  };
}
