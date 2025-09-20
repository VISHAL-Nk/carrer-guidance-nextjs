import React from 'react';
import { CollegeWithDistance } from '../types/college';
import { MapPin, Clock, ExternalLink, Calendar, GraduationCap } from 'lucide-react';

interface CollegeCardProps {
  college: CollegeWithDistance;
  isHighlighted?: boolean;
  rank?: number;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college, isHighlighted, rank }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md border-2 transition-all duration-300 hover:shadow-lg ${
      isHighlighted 
        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isHighlighted && rank && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  #{rank}
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {college.name}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{college.type}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{college.city}, {college.state}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-green-500" />
            <span>Established {college.established}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="font-medium text-gray-900">
                {college.distance} km away
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-900">
                ~{college.travelTime} min
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Popular Courses:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {college.courses.slice(0, 3).map((course, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {course}
              </span>
            ))}
            {college.courses.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                +{college.courses.length - 3} more
              </span>
            )}
          </div>
        </div>

        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
};

export default CollegeCard;