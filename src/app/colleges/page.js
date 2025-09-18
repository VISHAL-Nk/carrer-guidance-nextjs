"use client";
import { useEffect, useState } from 'react';
import RequireCompleteProfile from '@/components/RequireCompleteProfile';
import { 
  GraduationCap, 
  MapPin, 
  Search, 
  Filter, 
  Building2,
  Users,
  BookOpen
} from 'lucide-react';

export default function CollegesPage() {
  return (
    <RequireCompleteProfile>
      <CollegesInner />
    </RequireCompleteProfile>
  );
}

function CollegesInner() {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: ''
  });
  const [meta, setMeta] = useState(null);
  const [availableFilters, setAvailableFilters] = useState({
    locations: [],
    types: []
  });

  useEffect(() => {
    loadColleges();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [colleges, filters]);

  async function loadColleges() {
    setLoading(true);
    try {
      const res = await fetch('/api/colleges');
      const data = await res.json();
      
      if (res.ok) {
        setColleges(data.data.colleges || []);
        setMeta(data.data);
        setAvailableFilters({
          locations: data.data.filters?.locations || [],
          types: data.data.filters?.types || []
        });
      } else {
        console.error('Failed to load colleges:', data.message);
      }
    } catch (error) {
      console.error('Error loading colleges:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...colleges];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(college =>
        college.collegeName.toLowerCase().includes(searchTerm) ||
        college.location.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.location) {
      filtered = filtered.filter(college =>
        college.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(college =>
        college.CollegeType.toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    setFilteredColleges(filtered);
  }

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({ search: '', location: '', type: '' });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 loading-pulse">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            College Explorer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the perfect educational institutions for your career goals
          </p>
          {meta && (
            <div className="mt-6 inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              <span>Showing colleges for {meta.userClass} students</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search colleges or locations..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Locations</option>
                {availableFilters.locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Types</option>
                {availableFilters.types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(filters.search || filters.location || filters.type) && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing {filteredColleges.length} of {colleges.length} colleges
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{filteredColleges.length}</div>
            <div className="text-gray-600">Available Colleges</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{availableFilters.locations.length}</div>
            <div className="text-gray-600">Locations</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{availableFilters.types.length}</div>
            <div className="text-gray-600">College Types</div>
          </div>
        </div>

        {/* Colleges Grid */}
        {filteredColleges.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or clearing the filters.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium btn-hover transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredColleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CollegeCard({ college }) {
  const getTypeColor = (type) => {
    const colors = {
      'Degree College': 'bg-blue-100 text-blue-800',
      'Medical College': 'bg-red-100 text-red-800',
      'Engineering College': 'bg-green-100 text-green-800',
      'Nursing College': 'bg-pink-100 text-pink-800',
      'Dental College': 'bg-purple-100 text-purple-800',
      'Teacher Education College': 'bg-yellow-100 text-yellow-800',
      'Polytechnic': 'bg-indigo-100 text-indigo-800',
      'ITI': 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 card-hover transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {college.collegeName}
          </h3>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{college.location}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(college.CollegeType)}`}>
          {college.CollegeType}
        </span>
      </div>
      
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Government Institution</span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}