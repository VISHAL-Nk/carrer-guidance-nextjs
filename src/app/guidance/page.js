"use client";
import { useEffect, useMemo, useState } from 'react';
import RequireCompleteProfile from '@/components/RequireCompleteProfile';
import dynamic from 'next/dynamic';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

const MermaidRenderer = dynamic(() => import('@/components/MermaidRenderer'), { ssr: false });

export default function GuidancePage() {
  return (
    <RequireCompleteProfile>
      <GuidanceInner />
    </RequireCompleteProfile>
  );
}

function GuidanceInner() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null); // { stream, detail, mermaid }
  const { notify } = useToast();
  const { completion } = useAuth();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Fetch profile to know class/stream
        const profRes = await fetch('/api/profile');
        const prof = await profRes.json();
        const userClass = prof?.profile?.class;
        if (userClass === '12th') {
          setQuestions([]);
          setLoading(false);
          notify('12th questions are under update.');
          return;
        }
        // Get questions for 10th
        const qRes = await fetch('/api/questions');
        const qData = await qRes.json();
        setQuestions(qData.questions || []);
      } finally { setLoading(false); }
    }
    load();
  }, [notify]);

  const allAnswered = useMemo(() => questions.length > 0 && questions.every(q => answers[q.id] != null), [questions, answers]);

  async function onSubmit() {
    if (!allAnswered) { notify('Please answer all questions.'); return; }
    const res = await fetch('/api/questions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ answers }) });
    const data = await res.json();
    const stream = data?.recommendation?.stream;
    if (!stream) { notify('Could not determine stream'); return; }
    // Ask roadmap API for mermaid using stream as topic
    const rr = await fetch('/api/roadmap?topic=' + encodeURIComponent(stream));
    const rd = await rr.json();
    setResult({ stream, detail: data.recommendation, mermaid: rd.mermaidCode });
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Career Guidance</h1>
      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2">Your Stream</h2>
            {result ? (
              <div className="p-4 border rounded bg-gray-50">
                <div className="text-lg font-semibold mb-1">{result.stream}</div>
                <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result.detail, null, 2)}</pre>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-3">Answer questions to find your optimal stream.</p>
            )}

            {questions.length === 0 ? (
              <div className="p-4 border rounded bg-yellow-50 text-sm">12th questions are under update. Please check back soon.</div>
            ) : (
              <div className="space-y-3">
                {questions.map((q) => (
                  <div key={q.id} className="border rounded p-3">
                    <div className="font-medium mb-1">{q.text}</div>
                    <div className="flex gap-2 text-sm">
                      {[0,1,2,3,4].map((v) => (
                        <label key={v} className="inline-flex items-center gap-1">
                          <input type="radio" name={`q-${q.id}`} checked={answers[q.id]===v} onChange={() => setAnswers(a=>({...a,[q.id]:v}))} />
                          <span>{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="bg-black text-white px-4 py-2 rounded disabled:opacity-60" disabled={!allAnswered} onClick={onSubmit}>Get Recommendation</button>
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold mb-2">AI Roadmap</h2>
            {result?.mermaid ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Copy Mermaid code and try it on mermaid.live</span>
                  <button
                    className="text-xs underline"
                    onClick={() => navigator.clipboard.writeText(result.mermaid)}
                    >Copy code</button>
                </div>
                <MermaidRenderer code={result.mermaid} />
              </div>
            ) : (
              <p className="text-sm text-gray-600">Roadmap will appear here once we identify your stream.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
