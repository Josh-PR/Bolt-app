/**
 * Location utilities for calculating distances and managing location-based features
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Distance in miles
 */
export function calculateDistance(
  point1: LocationCoordinates,
  point2: LocationCoordinates
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Sort items by distance from user location
 */
export function sortByDistance<T extends { location_latitude?: number | null; location_longitude?: number | null }>(
  items: T[],
  userLocation: LocationCoordinates | null,
  maxRadius?: number
): (T & { distance?: number })[] {
  if (!userLocation) {
    return items.map(item => ({ ...item, distance: undefined }));
  }

  return items
    .map(item => {
      if (!item.location_latitude || !item.location_longitude) {
        return { ...item, distance: undefined };
      }

      const distance = calculateDistance(userLocation, {
        latitude: item.location_latitude,
        longitude: item.location_longitude,
      });

      return { ...item, distance };
    })
    .filter(item => {
      if (maxRadius && item.distance !== undefined) {
        return item.distance <= maxRadius;
      }
      return true;
    })
    .sort((a, b) => {
      // Items with distance come first, sorted by distance
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      // Items without distance come after items with distance
      if (a.distance !== undefined && b.distance === undefined) {
        return -1;
      }
      if (a.distance === undefined && b.distance !== undefined) {
        return 1;
      }
      // Both items have no distance, maintain original order
      return 0;
    });
}

/**
 * Get user's current location using browser geolocation API
 */
export function getCurrentLocation(): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

/**
 * Format distance for display
 */
export function formatDistance(distance: number | undefined): string {
  if (distance === undefined) {
    return 'Distance unknown';
  }
  
  if (distance < 1) {
    return `${(distance * 5280).toFixed(0)} ft away`;
  }
  
  return `${distance} mi away`;
}

/**
 * Common search radius options
 */
export const RADIUS_OPTIONS = [
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
  { value: 15, label: '15 miles' },
  { value: 25, label: '25 miles' },
  { value: 50, label: '50 miles' },
  { value: 100, label: '100 miles' },
  { value: null, label: 'No limit' },
];