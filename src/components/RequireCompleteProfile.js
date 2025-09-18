"use client";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RequireCompleteProfile({ children }) {
  const { completion, loading } = useAuth();
  if (loading) return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  if (!completion || !completion.isComplete) {
    const pct = completion?.percentage ?? 0;
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 border rounded bg-yellow-50">
        <h2 className="text-lg font-semibold mb-2">Complete your profile</h2>
        <p className="text-sm text-gray-700 mb-4">Your profile is {Math.round(pct)}% complete. Please complete it to access this feature.</p>
        <Link className="inline-block bg-black text-white px-4 py-2 rounded" href="/profile">Go to Profile</Link>
      </div>
    );
  }
  return children;
}
