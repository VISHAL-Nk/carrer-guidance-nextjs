"use client";
import { useEffect, useState } from 'react';

export default function CollegesPage() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ search: '' });
  const [meta, setMeta] = useState(null);

  async function load() {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v])=>v)));
    const res = await fetch('/api/colleges?' + qs.toString());
    const data = await res.json();
    if (res.ok) {
      setItems(data.data.colleges);
      setMeta(data.data);
    }
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Colleges</h1>
      <div className="flex gap-2 mb-4">
        <input className="border p-2 flex-1" placeholder="Search" value={filters.search} onChange={(e)=>setFilters({...filters,search:e.target.value})} />
        <button className="bg-black text-white px-4" onClick={load}>Search</button>
      </div>
      <ul className="space-y-2">
        {items.map(c => (
          <li key={c.id} className="border p-3 rounded">
            <div className="font-medium">{c.collegeName}</div>
            <div className="text-sm text-gray-600">{c.location} • {c.CollegeType}</div>
          </li>
        ))}
      </ul>
      {meta && <p className="mt-4 text-sm">Found {meta.totalCount} results for class {meta.userClass}</p>}
    </div>
  );
}
