"use client";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, completion, loading } = useAuth();
  const gated = !completion || !completion.isComplete;
  return (
    <main className="p-8 max-w-6xl mx-auto">
      <section className="grid md:grid-cols-2 gap-8 items-center mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Your Career, Guided by Data and AI</h1>
          <p className="mt-4 text-gray-600">Answer a few questions, discover your optimal stream, explore colleges, and get an AI-generated roadmap to reach your goals.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/guidance" className="bg-black text-white px-5 py-2 rounded">Start Guidance</Link>
            <Link href="/colleges" className="border px-5 py-2 rounded">Browse Colleges</Link>
          </div>
        </div>
        <div className="border rounded p-6 bg-gray-50">
          <h2 className="font-semibold mb-2">Profile Completion</h2>
          {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : (
            <div>
              <div className="h-2 bg-white rounded overflow-hidden mb-2">
                <div className="h-2 bg-green-600" style={{ width: `${Math.round(completion?.percentage ?? 0)}%` }}></div>
              </div>
              <div className="text-sm text-gray-700">{Math.round(completion?.percentage ?? 0)}% complete</div>
              {gated && (
                <div className="mt-3 text-xs text-yellow-700">Complete your profile to unlock all features.</div>
              )}
              <div className="mt-4">
                <Link href="/profile" className="underline">Update Profile</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Dashboard</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Tile href="/guidance" title="Career Guidance" gated={gated} />
          <Tile href="/interest" title="Interest Selection" gated={gated} />
          <Tile href="/scholarships" title="Scholarships" gated={gated} />
          <Tile href="/colleges" title="College List" gated={gated} />
        </div>
        {gated && (
          <p className="mt-3 text-sm text-gray-600">Complete your profile to access the above features.</p>
        )}
      </section>
    </main>
  );
}

function Tile({ href, title, gated }) {
  const base = "border rounded p-4 hover:bg-gray-50 transition";
  if (gated) {
    return (
      <div className={`${base} opacity-60 cursor-not-allowed`}> 
        <div className="font-medium">{title}</div>
        <div className="text-xs text-gray-500 mt-1">Locked until profile is complete</div>
      </div>
    );
  }
  return (
    <Link href={href} className={base}>
      <div className="font-medium">{title}</div>
      <div className="text-xs text-gray-500 mt-1">Open</div>
    </Link>
  );
}
