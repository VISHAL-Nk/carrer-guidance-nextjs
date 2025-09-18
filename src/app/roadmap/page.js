"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
const MermaidRenderer = dynamic(() => import('@/components/MermaidRenderer'), { ssr: false, loading: () => <div className="text-sm text-gray-500">Rendering diagram…</div> });

export default function RoadmapPage() {
  const [topic, setTopic] = useState('javascript');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');

  async function generate() {
    setErr('');
    setCode('');
    const res = await fetch('/api/roadmap?topic=' + encodeURIComponent(topic));
    const data = await res.json();
    if (res.ok) setCode(data.mermaidCode);
    else setErr(data.message || data.error || 'Error');
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">AI Roadmap Generator</h1>
      <div className="flex gap-2">
        <input className="border p-2 flex-1" value={topic} onChange={(e)=>setTopic(e.target.value)} />
        <button className="bg-black text-white px-4" onClick={generate}>Generate</button>
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {code && <MermaidRenderer code={code} />}
    </div>
  );
}
