import React, { useState, useEffect } from 'react';
import { MapPin, GraduationCap, AlertCircle, Navigation, Users } from 'lucide-react';
import { governmentColleges } from './data/colleges';
import { getUserLocation } from './utils/location';
import { calculateDistance, estimateTravelTime } from './utils/distance';
import { UserLocation, CollegeWithDistance } from './types/college';
import CollegeCard from './components/CollegeCard';
import LoadingSpinner from './components/LoadingSpinner';
import MapView from './components/MapView';

type AppState = 'initial' | 'loading' | 'loaded' | 'error';

function App() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [collegesWithDistance, setCollegesWithDistance] = useState<CollegeWithDistance[]>([]);
  const [nearestColleges, setNearestColleges] = useState<CollegeWithDistance[]>([]);
  const [error, setError] = useState<string>('');

  const handleFindColleges = async () => {
    setAppState('loading');
    setError('');

    try {
      const location = await getUserLocation();
      setUserLocation(location);

      // Filter colleges by state if available
      let relevantColleges = governmentColleges;
      if (location.state) {
        relevantColleges = governmentColleges.filter(college => 
          college.state === location.state
        );
      }

      // If no colleges in the state, show all colleges
      if (relevantColleges.length === 0) {
        relevantColleges = governmentColleges;
      }

      // Calculate distances and add to colleges
      const collegesWithDist: CollegeWithDistance[] = relevantColleges.map(college => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          college.latitude,
          college.longitude
        );
        const travelTime = estimateTravelTime(distance);

        return {
          ...college,
          distance,
          travelTime
        };
      });

      // Sort by distance
      collegesWithDist.sort((a, b) => a.distance - b.distance);

      setCollegesWithDistance(collegesWithDist);
      setNearestColleges(collegesWithDist.slice(0, 5));
      setAppState('loaded');
    } catch (err) {
      console.error('Error getting location or colleges:', err);
      let errorMessage = 'Unable to access your location. ';
      
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Please enable location access and try again.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
      } else {
        errorMessage += 'Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
      setAppState('error');
    }
  };

  if (appState === 'initial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-xl">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Government College Finder
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Discover government colleges in your state with precise distance calculations and travel times. 
                Get personalized recommendations based on your location.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Location-Based Search</h3>
                <p className="text-gray-600 text-sm">Find colleges in your state with accurate location detection</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Navigation className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Distance & Time</h3>
                <p className="text-gray-600 text-sm">Get precise distance and estimated travel time to each college</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Top 5 Nearest</h3>
                <p className="text-gray-600 text-sm">Highlighted recommendations for the closest colleges to you</p>
              </div>
            </div>

            <button
              onClick={handleFindColleges}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
            >
              <MapPin className="w-5 h-5" />
              Find Government Colleges Near Me
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              We'll request access to your location to show relevant colleges
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-auto">
          <LoadingSpinner />
          <h2 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">
            Finding Colleges Near You
          </h2>
          <p className="text-gray-600">
            Please allow location access when prompted...
          </p>
        </div>
      </div>
    );
  }

  if (appState === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-auto border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Location Access Required
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error}
          </p>
          <button
            onClick={handleFindColleges}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'loaded' && userLocation) {
    const nearestCollege = nearestColleges[0];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Government Colleges in {userLocation.state || 'Your Area'}
            </h1>
            <p className="text-gray-600">
              Found {collegesWithDistance.length} government colleges • Nearest: {nearestCollege?.distance} km away
            </p>
          </div>

          {/* Nearest College Highlight */}
          {nearestCollege && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-xl mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">🎯 Nearest College</h2>
                  <p className="text-xl mb-1">{nearestCollege.name}</p>
                  <p className="opacity-90">{nearestCollege.city}, {nearestCollege.state}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{nearestCollege.distance} km</div>
                  <div className="opacity-90">~{nearestCollege.travelTime} min drive</div>
                </div>
              </div>
            </div>
          )}

          {/* Map */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              Interactive Map
            </h2>
            <MapView 
              userLocation={userLocation} 
              colleges={collegesWithDistance}
              nearestColleges={nearestColleges}
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              🔵 Your location • 🔴 Colleges • 🟢 Top 5 nearest colleges
            </p>
          </div>

          {/* Top 5 Nearest Colleges */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-green-500" />
              Top 5 Nearest Colleges
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {nearestColleges.map((college, index) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  isHighlighted={true}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>

          {/* All Colleges */}
          {collegesWithDistance.length > 5 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                All Government Colleges ({collegesWithDistance.length})
              </h2>
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {collegesWithDistance.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    isHighlighted={nearestColleges.some(nc => nc.id === college.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Search Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;