import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

// Lagos neighborhood coordinates (approximate centers)
export const LAGOS_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  'Lekki': { lat: 6.4698, lng: 3.5852 },
  'Ajah': { lat: 6.4698, lng: 3.6121 },
  'Victoria Island': { lat: 6.4281, lng: 3.4219 },
  'VI': { lat: 6.4281, lng: 3.4219 },
  'Ikoyi': { lat: 6.4511, lng: 3.4382 },
  'Ikeja': { lat: 6.6018, lng: 3.3515 },
  'Surulere': { lat: 6.4969, lng: 3.3481 },
  'Yaba': { lat: 6.5158, lng: 3.3756 },
  'Lagos Island': { lat: 6.4541, lng: 3.3947 },
  'Apapa': { lat: 6.4488, lng: 3.3589 },
  'Festac': { lat: 6.4667, lng: 3.2833 },
  'Ojodu': { lat: 6.6333, lng: 3.3667 },
  'Gbagada': { lat: 6.5500, lng: 3.3833 },
  'Maryland': { lat: 6.5667, lng: 3.3667 },
  'Magodo': { lat: 6.6167, lng: 3.4333 },
  'Ogudu': { lat: 6.5667, lng: 3.4000 },
  'Anthony': { lat: 6.5667, lng: 3.3667 },
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get coordinates for a Lagos location string
 */
export function getLocationCoordinates(location: string): { lat: number; lng: number } | null {
  // Try exact match first
  if (LAGOS_LOCATIONS[location]) {
    return LAGOS_LOCATIONS[location];
  }

  // Try case-insensitive partial match
  const normalizedLocation = location.toLowerCase().trim();
  for (const [key, coords] of Object.entries(LAGOS_LOCATIONS)) {
    if (
      normalizedLocation.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(normalizedLocation)
    ) {
      return coords;
    }
  }

  // Default to Lagos center if location not found
  return { lat: 6.5244, lng: 3.3792 };
}

/**
 * Calculate distance from user location to a Lagos neighborhood
 */
export function getDistanceToLocation(
  userLat: number,
  userLng: number,
  locationName: string
): number {
  const coords = getLocationCoordinates(locationName);
  if (!coords) return Infinity;
  return calculateDistance(userLat, userLng, coords.lat, coords.lng);
}

/**
 * Sort workers/agencies by distance from user
 */
export function sortByDistance<T extends { location?: string; working_areas?: string[] }>(
  items: T[],
  userLat: number,
  userLng: number
): T[] {
  return [...items].sort((a, b) => {
    const locationA = a.working_areas?.[0] || a.location || 'Lagos';
    const locationB = b.working_areas?.[0] || b.location || 'Lagos';
    const distanceA = getDistanceToLocation(userLat, userLng, locationA);
    const distanceB = getDistanceToLocation(userLat, userLng, locationB);
    return distanceA - distanceB;
  });
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m away`;
  }
  return `${km.toFixed(1)}km away`;
}

/**
 * Hook to get user's geolocation
 */
export function useGeolocation(options: UseGeolocationOptions = {}): GeolocationState & {
  requestLocation: () => void;
  sortByProximity: <T extends { location?: string; working_areas?: string[] }>(items: T[]) => T[];
} {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Enable it in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 300000, // 5 minutes cache
      }
    );
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

  const sortByProximity = useCallback(
    <T extends { location?: string; working_areas?: string[] }>(items: T[]): T[] => {
      if (state.latitude === null || state.longitude === null) {
        return items;
      }
      return sortByDistance(items, state.latitude, state.longitude);
    },
    [state.latitude, state.longitude]
  );

  return {
    ...state,
    requestLocation,
    sortByProximity,
  };
}

export default useGeolocation;
