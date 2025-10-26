"use client";

import React, { useState } from 'react';
import { MapPin, GraduationCap, AlertCircle, Navigation2, Users } from 'lucide-react';
import { governmentColleges } from '@/data/governmentColleges';
import { getUserLocation } from '@/utils/collegeLocation';
import { calculateDistance, estimateTravelTime } from '@/utils/collegeDistance';
import CollegeCard from '@/components/CollegeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-[80%] mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingSpinner />
    </div>
  )
});

export default function CollegeFinderPage() {
  const [appState, setAppState] = useState('initial');
  const [userLocation, setUserLocation] = useState(null);
  const [collegesWithDistance, setCollegesWithDistance] = useState([]);
  const [nearestColleges, setNearestColleges] = useState([]);
  const [error, setError] = useState('');

  const handleFindColleges = async () => {
    setAppState('loading');
    setError('');

    try {
      console.log('Starting college search...');
      const location = await getUserLocation();
      console.log('Location received:', location);
      setUserLocation(location);

      // Filter colleges by state if available (prioritize J&K)
      let relevantColleges = governmentColleges;
      if (location.state) {
        relevantColleges = governmentColleges.filter(college => 
          college.state === location.state
        );
        console.log(`Found ${relevantColleges.length} colleges in ${location.state}`);
      }

      // If no colleges in the state, show all colleges
      if (relevantColleges.length === 0) {
        console.log('No colleges found in state, showing all colleges');
        relevantColleges = governmentColleges;
      }

      // Calculate distances and add to colleges
      const collegesWithDist = relevantColleges.map(college => {
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
      console.log('Colleges sorted by distance:', collegesWithDist.length);

      setCollegesWithDistance(collegesWithDist);
      setNearestColleges(collegesWithDist.slice(0, 5));
      setAppState('loaded');
    } catch (err) {
      console.error('Error getting location or colleges:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        name: err.name,
        stack: err.stack
      });
      
      let errorMessage = 'Unable to access your location. ';
      
      if (err.code !== undefined) {
        switch (err.code) {
          case 1:
            errorMessage = 'Location access was denied. Please enable location permissions in your browser settings and refresh the page.';
            break;
          case 2:
            errorMessage = 'Location information is unavailable. Please check your device\'s GPS or network connection.';
            break;
          case 3:
            errorMessage = 'Location request timed out. Please ensure your GPS is enabled and try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting your location.';
        }
      } else if (err.message) {
        errorMessage = err.message;
      } else {
        errorMessage = 'An unexpected error occurred. Please check your browser console for more details.';
      }
      
      setError(errorMessage);
      setAppState('error');
    }
  };

  if (appState === 'initial') {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Back to Home Link */}
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-8 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-xl">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Government College Finder
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Discover government colleges in Jammu & Kashmir and nearby states with precise distance calculations and travel times. 
                  Get personalized recommendations based on your location.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-200/70 dark:border-gray-700/50 ring-1 ring-black/5">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location-Based Search</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Find colleges in your state with accurate location detection</p>
                </div>
                
                <div className="glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-200/70 dark:border-gray-700/50 ring-1 ring-black/5">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Navigation2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Distance & Time</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Get precise distance and estimated travel time to each college</p>
                </div>
                
                <div className="glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-200/70 dark:border-gray-700/50 ring-1 ring-black/5">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Top 5 Nearest</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Highlighted recommendations for the closest colleges to you</p>
                </div>
              </div>

              <button
                onClick={handleFindColleges}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
              >
                <MapPin className="w-5 h-5" />
                Find Government Colleges Near Me
              </button>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                We'll request access to your location to show relevant colleges
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur p-8 rounded-2xl shadow-xl text-center max-w-md mx-auto border border-gray-200/70 dark:border-gray-700/50">
          <LoadingSpinner />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
            Finding Colleges Near You
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please allow location access when prompted...
          </p>
        </div>
      </div>
    );
  }

  if (appState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur p-8 rounded-2xl shadow-xl text-center max-w-md mx-auto border border-red-200/70 dark:border-red-700/50">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            Location Access Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleFindColleges}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'loaded' && userLocation) {
    const nearestCollege = nearestColleges[0];
    
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Government Colleges Near You
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Found {collegesWithDistance.length} colleges in {userLocation.state || 'your area'}
            </p>
          </div>

          {/* Nearest College Highlight */}
          {nearestCollege && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Nearest College</h2>
                </div>
                <p className="text-blue-100 text-lg mb-4">
                  {nearestCollege.name} is just {nearestCollege.distance} km away
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{nearestCollege.city}, {nearestCollege.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation2 className="w-4 h-4" />
                    <span>~{nearestCollege.travelTime} minutes travel time</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Map */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Map View
            </h2>
            <MapView
              userLocation={userLocation}
              colleges={collegesWithDistance}
              nearestColleges={nearestColleges}
            />
          </div>

          {/* Top 5 Nearest Colleges */}
          {nearestColleges.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Top 5 Nearest Colleges
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          )}

          {/* All Other Colleges */}
          {collegesWithDistance.length > 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                All Colleges ({collegesWithDistance.length - 5} more)
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {collegesWithDistance.slice(5).map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    isHighlighted={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Search Again Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleFindColleges}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              <MapPin className="w-5 h-5" />
              Search Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
