import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import { ToastProvider } from "@/contexts/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CareerPath - AI-Powered Career Guidance Platform",
  description:
    "Discover your ideal career path with our AI-powered assessment. Get personalized recommendations, interactive roadmaps, and guidance for students in classes 10th and 11th.",
  keywords:
    "career guidance, career assessment, AI career advisor, student guidance, career path, education planning",
  authors: [{ name: "CareerPath Team" }],
  creator: "CareerPath",
  publisher: "CareerPath",
  robots: "index, follow",
  openGraph: {
    title: "CareerPath - AI-Powered Career Guidance",
    description:
      "Discover your ideal career path with personalized AI-powered assessments and roadmaps.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerPath - AI-Powered Career Guidance",
    description:
      "Discover your ideal career path with personalized AI-powered assessments and roadmaps.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative overflow-x-hidden`}
      >
        {/* Global animated background */}
        <div className="fixed inset-0 -z-10">
          <div className="aurora-bg" />
          {/* decorative orbs */}
          <div className="orb orb-indigo w-64 h-64 top-10 -left-10 animate-float absolute" />
          <div className="orb orb-pink w-72 h-72 -bottom-10 right-10 animate-float-slow absolute" />
          <div className="orb orb-emerald w-56 h-56 bottom-20 left-1/3 animate-float absolute" />
        </div>
        <ToastProvider>
          <AuthProvider>
            <SiteHeader />
            <div className="min-h-[calc(100vh-64px)]">{children}</div>
            {/* Chatbot rendered per-page as needed */}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
