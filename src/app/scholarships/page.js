"use client";
import RequireCompleteProfile from '@/components/RequireCompleteProfile';
import { useMemo, useState } from 'react';
import { scholarships } from '@/lib/data/scholarship';

export default function ScholarshipsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return scholarships;
    return scholarships.filter((s) => s.scholarshipType === filter);
  }, [filter]);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pre-metric', label: 'Pre-Matric' },
    { key: 'female', label: 'For Women' },
  ];

  const typeLabel = (t) => (t === 'pre-metric' ? 'Pre-Matric' : t === 'female' ? 'Women' : t);

  return (
    <RequireCompleteProfile>
      <div className="max-w-3xl mx-auto p-6 ">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Scholarships</h1>
          <p className="text-sm text-gray-600">Handpicked opportunities based on common student needs.</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`shrink-0 rounded-full border px-3 py-1 text-sm transition-colors ${
                filter === t.key
                  ? 'bg-black text-white border-black'
                  : 'bg-white  hover:bg-gray-50 border-gray-300 text-black'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <ul className="space-y-3 ">
          {filtered.map((s, idx) => (
            <li key={`${s.name}-${idx}`} className="group">
              <a
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-300 p-4 hover:shadow-sm transition-shadow"
              >
                <div>
                  <h3 className="font-medium text-black group-hover:underline">
                    {s.name}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-500 px-2 py-0.5 text-xs font-medium text-white border border-gray-200">
                      {typeLabel(s.scholarshipType)}
                    </span>
                  </p>
                </div>
                <span className="mt-0.5 text-xs text-blue-500">Open link →</span>
              </a>
            </li>
          ))}

          {filtered.length === 0 && (
            <li className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
              No scholarships found for this filter.
            </li>
          )}
        </ul>
      </div>
    </RequireCompleteProfile>
  );
}
