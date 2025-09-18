"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
const MermaidRenderer = dynamic(() => import('@/components/MermaidRenderer'), { ssr: false, loading: () => <div className="text-sm text-gray-500">Rendering diagram…</div> });

export default function RoadmapPage() {
  const [topic, setTopic] = useState('javascript');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  async function generate() {
    setErr('');
    setCode('');
    setIsGenerating(true);
    try {
      const res = await fetch('/api/roadmap?topic=' + encodeURIComponent(topic));
      const data = await res.json();
      if (res.ok) setCode(data.mermaidCode);
      else setErr(data.message || data.error || 'Error');
    } catch (error) {
      setErr('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  const handleRetryRequest = (message) => {
    setErr(message);
    // Optionally auto-regenerate after showing the message
    setTimeout(() => generate(), 1000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">AI Roadmap Generator</h1>
      <div className="flex gap-2">
        <input 
          className="border p-2 flex-1" 
          value={topic} 
          onChange={(e)=>setTopic(e.target.value)}
          disabled={isGenerating}
          placeholder="Enter a topic (e.g., javascript, machine learning, web development)" 
        />
        <button 
          className="bg-black text-white px-4 disabled:bg-gray-400 disabled:cursor-not-allowed" 
          onClick={generate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {err && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{err}</p>
        </div>
      )}
      {code && <MermaidRenderer code={code} onRetryRequest={handleRetryRequest} />}
    </div>
  );
}
