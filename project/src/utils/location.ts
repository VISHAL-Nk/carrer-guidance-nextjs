import { UserLocation } from '../types/college';

// US State boundaries (simplified)
const stateBoundaries: Record<string, { minLat: number; maxLat: number; minLng: number; maxLng: number }> = {
  'California': { minLat: 32.5, maxLat: 42.0, minLng: -124.5, maxLng: -114.1 },
  'Texas': { minLat: 25.8, maxLat: 36.5, minLng: -106.6, maxLng: -93.5 },
  'New York': { minLat: 40.5, maxLat: 45.0, minLng: -79.8, maxLng: -71.8 },
  'Florida': { minLat: 24.4, maxLat: 31.0, minLng: -87.6, maxLng: -80.0 }
};

export const getStateFromCoordinates = async (latitude: number, longitude: number): Promise<string | null> => {
  // Check against our simplified state boundaries
  for (const [state, bounds] of Object.entries(stateBoundaries)) {
    if (
      latitude >= bounds.minLat &&
      latitude <= bounds.maxLat &&
      longitude >= bounds.minLng &&
      longitude <= bounds.maxLng
    ) {
      return state;
    }
  }
  
  // Fallback to reverse geocoding with Nominatim
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
    );
    const data = await response.json();
    return data.address?.state || null;
  } catch (error) {
    console.error('Error fetching state from coordinates:', error);
    return null;
  }
};

export const getUserLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const state = await getStateFromCoordinates(latitude, longitude);
        resolve({ latitude, longitude, state: state || undefined });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};