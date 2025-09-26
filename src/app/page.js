"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  GraduationCap,
  Target,
  Award,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Lock,
  Star,
  Zap,
  Shield,
  Globe,
  Brain,
  Lightbulb,
  Rocket,
  MapPin,
  Calendar,
  Phone,
  Mail,
  DollarSign,
  Building,
  UserCheck,
  Briefcase,
} from "lucide-react";
import Chatbot from "@/components/CB/Chatbot";
import { useToast } from "@/contexts/ToastContext";

export default function Home() {
  const { user, completion, loading } = useAuth();
  const { notify } = useToast();
  const [slide, setSlide] = useState(0);
  const [fb, setFb] = useState({ name: "", email: "", message: "", rating: 5 });
  const [fbSubmitting, setFbSubmitting] = useState(false);
  
  // Hero carousel images from public/images
  const slides = [
    "containerImages/IMG_20250920_102648.jpg",
    "/images/WhatsApp Image 2025-09-19 at 3.55.30 PM.jpeg",
    "/images/WhatsApp Image 2025-09-19 at 3.55.30 PM (1).jpeg",
    "/images/WhatsApp Image 2025-09-19 at 3.55.31 PM.jpeg",
    "/images/WhatsApp Image 2025-09-19 at 3.55.30 PM (2).jpeg",
    "heroImages/IMG_20250920_104501.jpg",
    "heroImages/IMG_20250920_112640.jpg"
  ];

  useEffect(() => {
    // Auto-rotate carousel on the homepage
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  const isProfileComplete = completion?.isComplete ?? false;

  // Debug logging
  console.log("Home page - Auth state:", { user: !!user, loading, completion });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Hero Section with Image Carousel */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Enhanced decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-emerald-600/10"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-emerald-400 to-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50">
                  <GraduationCap className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Government Colleges J&K</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                  Your{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                    Future
                  </span>{" "}
                  Starts Here
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-700/90 dark:text-gray-200 leading-relaxed max-w-2xl">
                  Are you in Class 10 or 12 and thinking about your future after school? Discover the incredible opportunities waiting for you at Government Colleges across Jammu & Kashmir — where quality education meets affordability.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link
                      href="/guidance"
                      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Target className="w-6 h-6 mr-3 relative z-10" />
                      <span className="relative z-10">Start Assessment</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                    </Link>
                    <Link
                      href="http://localhost:5173/"
                      className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 dark:text-blue-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                      target="_blank"
                    >
                      <GraduationCap className="w-6 h-6 mr-3" />
                      <span>Find Colleges</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Rocket className="w-6 h-6 mr-3 relative z-10" />
                      <span className="relative z-10">Start Your Journey</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                    </Link>
                    <Link
                      href="/login"
                      className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 dark:text-blue-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                    >
                      <span>Sign In</span>
                    </Link>
                  </>
                )}
              </div>

            </div>

            {/* Image Carousel */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <div className="aspect-[16/10] w-full relative">
                  {slides.map((src, idx) => (
                    <img
                      key={src}
                      src={src}
                      alt={`Government college illustration ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                        slide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                      }`}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  ))}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                
                {/* Enhanced dots indicator */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Go to slide ${idx + 1}`}
                      onClick={() => setSlide(idx)}
                      className={`transition-all duration-300 ${
                        slide === idx 
                          ? 'w-8 h-3 bg-white rounded-full shadow-lg' 
                          : 'w-3 h-3 bg-white/60 rounded-full hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl rotate-12 opacity-80 blur-sm"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full opacity-60 blur-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Government Colleges Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Government Colleges in J&K?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Whether you dream of becoming a doctor, engineer, scientist, or expert in any other field, our colleges provide the perfect platform to turn your dreams into reality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border border-white/20 dark:border-gray-700/20 group-hover:border-gray-300/50 dark:group-hover:border-gray-600/50 transform group-hover:-translate-y-2">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 flex items-center justify-center">
                  <img 
                    src="containerImages/1758361179099.jpg" 
                    alt="Top Quality Education" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Top-Quality Education</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our colleges are affiliated with reputed universities and recognized by national bodies like UGC, AICTE, and NMC.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border border-white/20 dark:border-gray-700/20 group-hover:border-gray-300/50 dark:group-hover:border-gray-600/50 transform group-hover:-translate-y-2">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 flex items-center justify-center">
                  <img 
                    src="containerImages/1758361203434.jpg" 
                    alt="Highly Qualified Faculty" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Highly Qualified Faculty</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Learn from experienced professors and industry-trained professionals who are passionate about your success.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border border-white/20 dark:border-gray-700/20 group-hover:border-gray-300/50 dark:group-hover:border-gray-600/50 transform group-hover:-translate-y-2">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 flex items-center justify-center">
                  <img 
                    src="containerImages/1758361292455.jpg" 
                    alt="Affordable Fees" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Affordable Fees</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Get the best education without burdening your family financially. Most courses have minimal fees compared to private institutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section for Authenticated Users */}
      {user && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Your Learning Dashboard
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Track your progress and access personalized resources
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Completion Card */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 dark:border-gray-700/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Profile Status
                    </h2>
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded loading-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded loading-pulse"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Completion</span>
                        <span className="font-bold text-2xl text-gray-900 dark:text-white">
                          {Math.round(completion?.percentage ?? 0)}%
                        </span>
                      </div>

                      <div className="relative">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 h-3 rounded-full progress-bar relative overflow-hidden"
                            style={{ width: `${completion?.percentage ?? 0}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                      </div>

                      {!isProfileComplete ? (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-4">
                          <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-3 font-medium">
                            Complete your profile to unlock all features
                          </p>
                          <Link
                            href="/profile"
                            className="inline-flex items-center text-sm font-semibold text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200 transition-colors"
                          >
                            Update Profile
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl p-4 flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          <p className="text-emerald-800 dark:text-emerald-200 text-sm font-medium">
                            Profile Complete!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dashboard Cards */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Quick Access
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <DashboardCard
                    href="/guidance"
                    title="Career Assessment"
                    description="AI-powered career guidance"
                    icon={<Target className="w-6 h-6" />}
                    color="blue"
                    locked={!isProfileComplete}
                  />
                  <DashboardCard
                    href="/college-predictor"
                    title="College Predictor"
                    description="Find your ideal colleges"
                    icon={<GraduationCap className="w-6 h-6" />}
                    color="purple"
                    locked={!isProfileComplete}
                  />
                  <DashboardCard
                    href="/interest"
                    title="Interest Explorer"
                    description="Discover your passions"
                    icon={<Star className="w-6 h-6" />}
                    color="pink"
                    locked={!isProfileComplete}
                  />
                  <DashboardCard
                    href="/scholarships"
                    title="Scholarships"
                    description="Find funding opportunities"
                    icon={<Award className="w-6 h-6" />}
                    color="orange"
                    locked={!isProfileComplete}
                  />
                  <DashboardCard
                    href="/study-materials"
                    title="Study Materials"
                    description="Curated resources for exams"
                    icon={<BookOpen className="w-6 h-6" />}
                    color="emerald"
                    locked={!isProfileComplete}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              More Reasons to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Choose Us
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Building className="w-8 h-8" />}
              title="Modern Infrastructure"
              description="Smart classrooms, well-equipped labs, libraries, and digital learning tools to keep you ahead."
              color="blue"
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Wide Range of Courses"
              description="Medical & Paramedical Sciences, Engineering & Technology, Pure Sciences, Commerce & Management, and many more!"
              color="emerald"
            />
            <FeatureCard
              icon={<Award className="w-8 h-8" />}
              title="Scholarships & Financial Aid"
              description="Availability of state and central scholarships for deserving students. No dream is too big when the support is strong!"
              color="purple"
            />
            <FeatureCard
              icon={<Briefcase className="w-8 h-8" />}
              title="Career Support & Placement"
              description="Get guidance, internships, and help with job placements to launch your career with confidence."
              color="orange"
            />
            <FeatureCard
              icon={<UserCheck className="w-8 h-8" />}
              title="Reservation Benefits"
              description="Special quotas and reservation benefits for local students from Jammu & Kashmir."
              color="pink"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Government Schemes"
              description="Access to special incentives and government schemes designed for local students."
              color="teal"
            />
          </div>
        </div>
      </section>

      {/* Special Opportunities for Local Students Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200/50 dark:border-green-700/50 mb-6">
              <Rocket className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">🚀 Special Benefits</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Special Opportunities for{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Local Students
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              If you're from Jammu & Kashmir, you also get these exclusive benefits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-gray-300/50 dark:hover:border-gray-600/50 transform hover:-translate-y-2">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 flex items-center justify-center">
                <img 
                  src="containerImages/1758361383122.jpg" 
                  alt="Reservation Benefits" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="flex items-center mb-4">
                <UserCheck className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reservation Benefits</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Special reservation quotas and benefits designed specifically for students from Jammu & Kashmir.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-gray-300/50 dark:hover:border-gray-600/50 transform hover:-translate-y-2">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 flex items-center justify-center">
                <img 
                  src="containerImages/1758361450659.jpg" 
                  alt="Local Student Quotas" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-emerald-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Local Student Quotas</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Dedicated seats and quotas reserved for local students, ensuring better admission opportunities.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-gray-300/50 dark:hover:border-gray-600/50 transform hover:-translate-y-2">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 flex items-center justify-center">
                <img 
                  src="containerImages/1758361523108.jpg" 
                  alt="Government Schemes" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-purple-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Special Incentives</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Access to special government schemes and incentives designed to support local students' education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot: show only on main page when authenticated */}
      {user && <Chatbot />}



      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20 dark:border-gray-700/20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Start Your{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Educational Journey?
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of students who have secured their future with quality education at Government Colleges in Jammu & Kashmir.
              </p>
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Rocket className="w-6 h-6 mr-3 relative z-10" />
                <span className="relative z-10">Start Your Journey Today</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Feedback Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  We Value Your Feedback
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Help us improve by sharing your thoughts and experiences.
                </p>
              </div>
            </div>
            
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!fb.name || !fb.email || !fb.message) {
                  notify('Please fill in name, email and your feedback.');
                  return;
                }
                setFbSubmitting(true);
                try {
                  const res = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fb),
                  });
                  const data = await res.json();
                  if (res.ok && data.success) {
                    notify('Thanks for your feedback!');
                    setFb({ name: '', email: '', message: '', rating: 5 });
                  } else {
                    notify(data.message || 'Failed to submit feedback');
                  }
                } catch (err) {
                  notify('Network error. Please try again.');
                } finally {
                  setFbSubmitting(false);
                }
              }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={fb.name}
                    onChange={(e) => setFb((s) => ({ ...s, name: e.target.value }))}
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={fb.email}
                    onChange={(e) => setFb((s) => ({ ...s, email: e.target.value }))}
                    className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <select
                  value={fb.rating}
                  onChange={(e) => setFb((s) => ({ ...s, rating: Number(e.target.value) }))}
                  className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white transition-colors"
                >
                  {[5,4,3,2,1].map((r) => (
                    <option key={r} value={r}>
                      {r} / 5 {r === 5 ? '⭐⭐⭐⭐⭐' : r === 4 ? '⭐⭐⭐⭐' : r === 3 ? '⭐⭐⭐' : r === 2 ? '⭐⭐' : '⭐'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={fb.message}
                  onChange={(e) => setFb((s) => ({ ...s, message: e.target.value }))}
                  className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 min-h-[120px] bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-none"
                  placeholder="Tell us what you liked or what we can improve..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={fbSubmitting}
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {fbSubmitting && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3 relative z-10" />
                  )}
                  <span className="relative z-10">
                    {fbSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({
  href,
  title,
  description,
  icon,
  color,
  locked,
  comingSoon,
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 bg-blue-50 text-blue-600 border-blue-200",
    emerald: "from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-600 border-emerald-200",
    purple: "from-purple-500 to-purple-600 bg-purple-50 text-purple-600 border-purple-200",
    orange: "from-orange-500 to-orange-600 bg-orange-50 text-orange-600 border-orange-200",
    pink: "from-pink-500 to-pink-600 bg-pink-50 text-pink-600 border-pink-200",
  };

  if (locked) {
    return (
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-lg p-6 opacity-60 cursor-not-allowed border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${colorClasses[color].split(" ")[1]} rounded-2xl flex items-center justify-center`}>
            {icon}
          </div>
          <Lock className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
          Complete profile to unlock
        </div>
      </div>
    );
  }

  if (comingSoon) {
    return (
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-lg p-6 opacity-75 cursor-not-allowed border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${colorClasses[color].split(" ")[1]} rounded-2xl flex items-center justify-center`}>
            {icon}
          </div>
          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full font-semibold">
            Coming Soon
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="text-sm text-gray-500 dark:text-gray-400">Updates are underway</div>
      </div>
    );
  }

  return (
    <Link href={href} className="block group">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl p-6 transition-all duration-300 border border-white/20 dark:border-gray-700/20 group-hover:border-gray-300/50 dark:group-hover:border-gray-600/50 transform group-hover:-translate-y-1">
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color].split(" ")[0]} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ icon, title, description, color }) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    emerald: "text-emerald-600 bg-emerald-100",
    purple: "text-purple-600 bg-purple-100",
    orange: "text-orange-600 bg-orange-100",
    pink: "text-pink-600 bg-pink-100",
    teal: "text-teal-600 bg-teal-100",
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 border border-white/20 dark:border-gray-700/20 hover:border-gray-300/50 dark:hover:border-gray-600/50 transform hover:-translate-y-2">
      <div className={`w-16 h-16 ${colorClasses[color]} rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}