"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, LogOut, Menu, X } from "lucide-react";

export default function SiteHeader() {
  const { user, loading, signout, completion } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Navigation links removed as per user request
  const navLinks = [];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-[#0b1220]/60 border-b border-white/30 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center shadow ring-1 ring-black/5">
              <span className="text-white font-bold text-sm">CG</span>
            </div>
            <span className="font-bold text-xl gradient-text">CareerGuide</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full loading-pulse"></div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 bg-white/70 hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/20 rounded-full px-3 py-2 transition-colors ring-1 ring-black/5 shadow-sm shine"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.firstName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-medium text-gray-900 dark:text-white">{user.firstName}</div>
                    {completion && (
                      <div className="text-xs text-gray-500">
                        {Math.round(completion.percentage)}% complete
                      </div>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/90 dark:bg-[#0b1220]/95 backdrop-blur rounded-xl shadow-lg border border-white/30 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {completion && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Profile Completion</span>
                            <span>{Math.round(completion.percentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1.5 rounded-full progress-bar"
                              style={{ width: `${completion.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Update Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        signout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50/80 dark:hover:bg-red-500/10 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:via-indigo-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium btn-hover transition-all shadow shine"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/40 py-4 bg-white/60 dark:bg-[#0b1220]/60 backdrop-blur">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}