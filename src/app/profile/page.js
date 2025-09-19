"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Calendar, MapPin, GraduationCap, BookOpen } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    dob: '',
    gender: 'Prefer not to say',
    location: '',
    class: '',
    stream: ''
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load existing profile data
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setFormData({
            dob: data.profile.dob ? new Date(data.profile.dob).toISOString().split('T')[0] : '',
            gender: data.profile.gender || 'Prefer not to say',
            location: data.profile.location || '',
            class: data.profile.class || '',
            stream: data.profile.stream || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  function handleChange(field, value) {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // If class is changed to 10th, automatically set stream to "None"
      if (field === 'class' && value === '10th') {
        newData.stream = 'None';
      }
      // If class is changed to 12th and stream was "None", clear it
      else if (field === 'class' && value === '12th' && prev.stream === 'None') {
        newData.stream = '';
      }
      
      return newData;
    });
    if (message) setMessage('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    
    if (!formData.class) {
      setMessage('Please select your class');
      return;
    }
    
    // Prepare data for submission
    const submitData = { ...formData };
    
    // Ensure 10th class students have stream set to "Other"
    if (submitData.class === '10th') {
      submitData.stream = 'Other';
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setMessage(data.message || 'Failed to update profile');
      } else {
        setMessage('Profile updated successfully!');
        // Refresh auth context to update completion percentage
        window.location.reload();
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Help us personalize your career guidance experience</p>
        </div>

        {/* Profile Form */}
  <div className="glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur rounded-2xl shadow-lg p-8 ring-1 ring-black/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date of Birth */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Date of Birth</span>
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Mumbai, Maharashtra"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white placeholder-gray-500"
              />
            </div>

            {/* Class */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>Current Class *</span>
              </label>
              <select
                value={formData.class}
                onChange={(e) => handleChange('class', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                required
              >
                <option value="">Select your class</option>
                <option value="10th">10th Standard</option>
                <option value="12th">12th Standard</option>
              </select>
              {formData.class === '10th' && (
                <p className="mt-2 text-sm text-gray-500">
                  Stream is automatically set to "None" for 10th standard students
                </p>
              )}
            </div>

            {/* Stream - only show if 12th is selected */}
            {formData.class === '12th' && (
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Stream</span>
                </label>
                <select
                  value={formData.stream}
                  onChange={(e) => handleChange('stream', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                >
                  <option value="">Select your stream</option>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Vocational courses">Vocational courses</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating Profile...</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl text-sm ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}