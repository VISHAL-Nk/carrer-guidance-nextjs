"use client";
import Link from "next/link";
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
} from "lucide-react";

export default function Home() {
  const { user, completion, loading } = useAuth();
  const isProfileComplete = completion?.isComplete ?? false;

  // Debug logging
  console.log("Home page - Auth state:", { user: !!user, loading, completion });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Your <span className="gradient-text">Career Journey</span>{" "}
                  Starts Here
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover your perfect career path with AI-powered guidance,
                  personalized recommendations, and comprehensive resources
                  tailored for Indian students.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link
                      href="/guidance"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold btn-hover transition-all flex items-center justify-center space-x-2"
                    >
                      <Target className="w-5 h-5" />
                      <span>Start Career Assessment</span>
                    </Link>
                    <Link
                      href="/college-predictor"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                    >
                      <GraduationCap className="w-5 h-5" />
                      <span>Predict Colleges</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold btn-hover transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      href="/login"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">10K+</div>
                  <div className="text-sm text-gray-600">Students Guided</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    500+
                  </div>
                  <div className="text-sm text-gray-600">Colleges Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 card-hover">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Smart Assessment
                      </h3>
                      <p className="text-sm text-gray-600">
                        AI-powered career matching
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        College Finder
                      </h3>
                      <p className="text-sm text-gray-600">
                        Discover perfect institutions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Career Roadmap
                      </h3>
                      <p className="text-sm text-gray-600">
                        Step-by-step guidance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section for Authenticated Users */}
      {user && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Completion Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 card-hover">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Profile Status
                    </h2>
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded loading-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded loading-pulse"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Completion</span>
                        <span className="font-semibold text-gray-900">
                          {Math.round(completion?.percentage ?? 0)}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full progress-bar"
                          style={{ width: `${completion?.percentage ?? 0}%` }}
                        ></div>
                      </div>

                      {!isProfileComplete && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800 mb-2">
                            Complete your profile to unlock all features
                          </p>
                          <Link
                            href="/profile"
                            className="text-sm font-medium text-yellow-600 hover:text-yellow-700 underline"
                          >
                            Update Profile →
                          </Link>
                        </div>
                      )}

                      {isProfileComplete && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <p className="text-sm text-green-800">
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Your Dashboard
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <DashboardCard
                    href="/guidance"
                    title="Career Guidance"
                    description="AI-powered career assessment"
                    icon={<Target className="w-5 h-5" />}
                    color="blue"
                    locked={!isProfileComplete}
                  />
                  <DashboardCard
                    href="/college-predictor"
                    title="College Predictor"
                    description="Personalized college recommendations"
                    icon={<GraduationCap className="w-5 h-5" />}
                    color="emerald"
                    locked={!isProfileComplete}
                  />
                  <DashboardCard
                    href="/interest"
                    title="Interest Selection"
                    description="Match interests with careers"
                    icon={<Star className="w-5 h-5" />}
                    color="purple"
                    locked={!isProfileComplete}
                    comingSoon
                  />
                  <DashboardCard
                    href="/scholarships"
                    title="Scholarships"
                    description="Find funding opportunities"
                    icon={<Award className="w-5 h-5" />}
                    color="orange"
                    locked={!isProfileComplete}
                    comingSoon
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CareerGuide?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge AI technology with comprehensive career
              resources to provide personalized guidance for every student.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-blue-600" />}
              title="Personalized Assessment"
              description="Our AI analyzes your interests, skills, and goals to recommend the perfect career path tailored just for you."
            />
            <FeatureCard
              icon={<GraduationCap className="w-8 h-8 text-emerald-600" />}
              title="Comprehensive Database"
              description="Access detailed information about colleges, courses, and career opportunities across India."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-purple-600" />}
              title="AI-Powered Roadmaps"
              description="Get step-by-step career roadmaps generated by AI to guide you from where you are to where you want to be."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Discover Your Future?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have found their perfect career
              path with CareerGuide.
            </p>
            <Link
              href="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold btn-hover transition-all inline-flex items-center space-x-2"
            >
              <span>Start Your Journey Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
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
    blue: "from-blue-500 to-blue-600 bg-blue-50 text-blue-600",
    emerald: "from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-600",
    purple: "from-purple-500 to-purple-600 bg-purple-50 text-purple-600",
    orange: "from-orange-500 to-orange-600 bg-orange-50 text-orange-600",
  };

  if (locked) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 opacity-60 cursor-not-allowed">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 ${
              colorClasses[color].split(" ")[1]
            } rounded-xl flex items-center justify-center`}
          >
            {icon}
          </div>
          <Lock className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-sm text-yellow-600 font-medium">
          Complete profile to unlock
        </div>
      </div>
    );
  }

  if (comingSoon) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 opacity-75 cursor-not-allowed">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 ${
              colorClasses[color].split(" ")[1]
            } rounded-xl flex items-center justify-center`}
          >
            {icon}
          </div>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
            Coming Soon
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-sm text-gray-500">Updates are underway</div>
      </div>
    );
  }

  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-2xl shadow-lg p-6 card-hover transition-all">
        <div
          className={`w-12 h-12 ${
            colorClasses[color].split(" ")[1]
          } rounded-xl flex items-center justify-center mb-4`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-blue-600 font-medium">
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center p-6">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}