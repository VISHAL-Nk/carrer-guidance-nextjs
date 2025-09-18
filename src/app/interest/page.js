"use client";
import RequireCompleteProfile from '@/components/RequireCompleteProfile';

export default function InterestPage() {
  return (
    <RequireCompleteProfile>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Interest Selection</h1>
        <p className="text-sm text-gray-600">Updates are underway. Please check back soon.</p>
      </div>
    </RequireCompleteProfile>
  );
}
