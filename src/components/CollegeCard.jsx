"use client";

import React from 'react';
import { MapPin, Clock, ExternalLink, Calendar, GraduationCap, Navigation2 } from 'lucide-react';

export default function CollegeCard({ college, isHighlighted = false, rank = null }) {
  return (
    <div
      className={`glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
        isHighlighted
          ? 'border-blue-300/70 dark:border-blue-600/50 ring-2 ring-blue-500/20'
          : 'border-gray-200/70 dark:border-gray-700/50 ring-1 ring-black/5'
      }`}
    >
      <div className="p-6">
        {rank && (
          <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full mb-3">
            {rank}
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">
          {college.name}
        </h3>

        <div className="space-y-2.5 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {college.city}, {college.state}
            </p>
          </div>

          {college.distance !== undefined && (
            <div className="flex items-center gap-2">
              <Navigation2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {college.distance} km away
              </p>
            </div>
          )}

          {college.travelTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ~{college.travelTime} min travel time
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
            {college.type}
          </span>
          {college.specializations && college.specializations.length > 0 && (
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full">
              {college.specializations.length} Programs
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
