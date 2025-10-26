// Indian State boundaries (simplified) - updated for Indian context
const stateBoundaries = {
  'Jammu and Kashmir': { minLat: 32.0, maxLat: 37.0, minLng: 73.0, maxLng: 80.0 },
  'Punjab': { minLat: 29.5, maxLat: 32.5, minLng: 73.9, maxLng: 76.9 },
  'Haryana': { minLat: 27.6, maxLat: 30.9, minLng: 74.5, maxLng: 77.6 },
  'Delhi': { minLat: 28.4, maxLat: 28.9, minLng: 76.8, maxLng: 77.3 },
  'Uttar Pradesh': { minLat: 23.9, maxLat: 30.4, minLng: 77.0, maxLng: 84.6 },
  'Maharashtra': { minLat: 15.6, maxLat: 22.0, minLng: 72.6, maxLng: 80.9 },
  'Karnataka': { minLat: 11.5, maxLat: 18.5, minLng: 74.0, maxLng: 78.5 },
  'Tamil Nadu': { minLat: 8.0, maxLat: 13.5, minLng: 76.2, maxLng: 80.3 },
};

export const getStateFromCoordinates = async (latitude, longitude) => {
  console.log('Getting state from coordinates:', { latitude, longitude });
  
  // Check against our simplified state boundaries
  for (const [state, bounds] of Object.entries(stateBoundaries)) {
    if (
      latitude >= bounds.minLat &&
      latitude <= bounds.maxLat &&
      longitude >= bounds.minLng &&
      longitude <= bounds.maxLng
    ) {
      console.log('State found from boundaries:', state);
      return state;
    }
  }
  
  console.log('State not found in boundaries, trying reverse geocoding...');
  
  // Fallback to reverse geocoding with Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
    console.log('Fetching from Nominatim:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CollegeFinder/1.0'
      }
    });
    
    if (!response.ok) {
      console.error('Nominatim API error:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    console.log('Nominatim response:', data);
    
    const state = data.address?.state || null;
    console.log('State from Nominatim:', state);
    return state;
  } catch (error) {
    console.error('Error fetching state from coordinates:', error);
    return null;
  }
};

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    console.log('Requesting geolocation...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('Geolocation success:', position.coords);
        const { latitude, longitude } = position.coords;
        
        try {
          console.log('Fetching state for coordinates:', latitude, longitude);
          const state = await getStateFromCoordinates(latitude, longitude);
          console.log('State detected:', state);
          resolve({ latitude, longitude, state: state || undefined });
        } catch (stateError) {
          console.error('Error getting state:', stateError);
          // Still resolve with coordinates even if state detection fails
          resolve({ latitude, longitude, state: undefined });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout to 15 seconds
        maximumAge: 0
      }
    );
  });
};
