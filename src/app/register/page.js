"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, User, Mail, Phone, Lock, Eye, EyeOff, Shield } from 'lucide-react';

export default function RegisterPage() {
  const [stage, setStage] = useState(1); // 1: Registration, 2: OTP Verification
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (message) setMessage('');
  }

  async function handleRegistration(e) {
    e.preventDefault();
    setMessage('');

    // Validation
    const required = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
    for (const field of required) {
      if (!formData[field]) {
        setMessage(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setMessage(data.message || 'Failed to send verification code');
      } else {
        setMessage('Verification code sent to your phone!');
        setStage(2);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpVerification(e) {
    e.preventDefault();
    setMessage('');

    if (!otp || otp.length !== 6) {
      setMessage('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth?action=verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setMessage(data.message || 'Verification failed');
      } else {
        setMessage('Registration successful! Redirecting to login...');
        try {
          await refresh();
        } catch (error) {
          console.error('Error refreshing auth state after registration:', error);
        }
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {stage === 1 ? <UserPlus className="w-8 h-8 text-white" /> : <Shield className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {stage === 1 ? 'Create Account' : 'Verify Your Phone'}
          </h1>
          <p className="text-gray-600">
            {stage === 1 
              ? 'Join thousands of students discovering their career path' 
              : 'Enter the verification code sent to your phone'
            }
          </p>
        </div>

        {/* Form */}
  <div className="glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur rounded-2xl shadow-xl p-8 ring-1 ring-black/5">
          {stage === 1 ? (
            <form onSubmit={handleRegistration} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    <span>First Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                    required
                  />
                </div>
              </div>

              {/* Middle Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Middle Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Middle name"
                  value={formData.middleName}
                  onChange={(e) => handleChange('middleName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold btn-hover transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpVerification} className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  We've sent a 6-digit code to <br />
                  <span className="font-medium text-gray-900">{formData.phone}</span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Verification Code</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg font-mono text-black"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold btn-hover transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Verify & Complete Registration</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStage(1)}
                className="w-full text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                ← Back to Registration
              </button>
            </form>
          )}

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes('successful') || message.includes('sent')
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Sign In Link */}
          {stage === 1 && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}