"use client";
import { useEffect, useState } from 'react';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/questions');
      const data = await res.json();
      if (res.ok) setQuestions(data.data.questions);
      else setError(data.message || 'Not available');
    })();
  }, []);

  async function submit() {
    const responses = Object.entries(answers).map(([questionId, answer]) => ({ questionId: Number(questionId), answer }));
    const res = await fetch('/api/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ responses }) });
    const data = await res.json();
    if (res.ok) setResult(data.data);
    else setError(data.message || data.error || 'Error');
  }

  if (error) return <div className="p-6">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Career Assessment</h1>
      {questions.map((q) => (
        <div key={q.id} className="border p-3 rounded">
          <div className="font-medium mb-2">{q.question}</div>
          <div className="flex flex-col gap-2">
            {q.options.map((o) => (
              <label key={o.value} className="flex items-center gap-2">
                <input type="radio" name={`q-${q.id}`} value={o.value} onChange={() => setAnswers({ ...answers, [q.id]: o.value })} />
                <span>{o.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      {questions.length > 0 && (
        <button className="bg-black text-white px-4 py-2" onClick={submit}>Submit</button>
      )}
      {result && (
        <div className="border p-4 rounded">
          <div className="font-semibold">Recommended: {result.recommendation.primaryPath}</div>
          <pre className="text-sm mt-2 whitespace-pre-wrap">{JSON.stringify(result.recommendation.pathDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
