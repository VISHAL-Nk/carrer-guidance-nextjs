"use client";
import { useMemo, useState } from "react";
import RequireCompleteProfile from "@/components/RequireCompleteProfile";
import { interestQuestions } from "@/lib/data/interestQuestion";
import Link from "next/link";
import { Target, Loader2, AlertTriangle, RefreshCw, Info, ListChecks } from "lucide-react";

const categoryNames = {
  a: "Technical / Engineering",
  b: "Scientific / Research",
  c: "Creative / Arts",
  d: "Social / People",
  e: "Business / Leadership",
  f: "Administrative / Organizing",
};

export default function InterestPage() {
  const [selected, setSelected] = useState({}); // { [questionId]: 'a' | 'b' | ... }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white";

  const totalQuestions = interestQuestions.length;
  const answeredCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );
  const canSubmit = answeredCount === totalQuestions && !loading;

  function onPick(qid, letter) {
    setSelected((s) => ({ ...s, [qid]: letter }));
    if (error) setError("");
  }

  function resetAll() {
    setSelected({});
    setResults([]);
    setError("");
    setSubmitted(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setError("");
    setResults([]);
    if (!canSubmit) return;
    setLoading(true);

    try {
      const answers = interestQuestions.map((q) => selected[q.id]);
      const res = await fetch("/api/predict-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
          const errData = await res.json();
          if (errData?.message) msg = errData.message;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.results || [];
      setResults(arr);
      if (!arr.length) setError("No suggestions returned. Try again later.");
    } catch (err) {
      const msg = (err && typeof err === "object" && "message" in err) ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <RequireCompleteProfile>
      <main className="min-h-screen">
        <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="max-w-6xl mx-auto">
            <header className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <ListChecks className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Interest Assessment</h1>
                  <p className="text-gray-600">Answer a quick questionnaire to discover your interest areas.</p>
                </div>
              </div>
              <Link href="/" className="text-blue-700 hover:text-blue-800 font-medium hidden sm:inline-flex">
                Home
              </Link>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Questionnaire */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur rounded-2xl shadow-lg p-6 ring-1 ring-black/5">
                  <div className="flex items-center gap-2 mb-4">
                    <ListChecks className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Your Preferences</h2>
                  </div>

                  <ol className="space-y-6">
                    {interestQuestions.map((q) => (
                      <li key={q.id} className="border border-gray-200 rounded-xl p-4">
                        <p className="font-medium text-gray-900 mb-3">
                          {q.id}. {q.question}
                        </p>
                        <div className="grid md:grid-cols-2 gap-2">
                          {Object.entries(q.options).map(([letter, text]) => (
                            <label key={letter} className="flex items-start gap-3 p-2 rounded-lg border border-gray-200 hover:border-blue-400 cursor-pointer">
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                value={letter}
                                className="mt-1"
                                checked={selected[q.id] === letter}
                                onChange={() => onPick(q.id, letter)}
                              />
                              <span>
                                <span className="font-semibold mr-1 uppercase">{letter}.</span>
                                <span className="text-gray-700">{text}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Predicting...
                        </>
                      ) : (
                        <>
                          <Target className="w-5 h-5" />
                          Predict Interests
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={resetAll}
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                      title="Clear selections"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear
                    </button>

                    <span className="text-sm text-gray-600 ml-auto">
                      Answered {answeredCount}/{totalQuestions}
                    </span>
                  </div>

                  {submitted && !canSubmit && (
                    <p className="mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      Please answer all questions to continue.
                    </p>
                  )}

                  {error && (
                    <div className="mt-4 flex items-start gap-3 text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                      <AlertTriangle className="w-5 h-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Request error</p>
                        <p className="text-sm leading-5">{error}</p>
                      </div>
                    </div>
                  )}
                </form>

                <div className="glass mt-4 text-sm text-gray-600 bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur border border-gray-200/70 rounded-2xl p-4 flex gap-2 ring-1 ring-black/5">
                  <Info className="w-4 h-4 text-gray-500 mt-1" />
                  <p>
                    This tool sends your answers to your local backend at
                    <span className="font-mono"> http://localhost:8080/predict-interest</span>.
                    Ensure it is running and CORS is enabled.
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="lg:col-span-1">
                <div className="glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur rounded-2xl shadow-lg p-6 ring-1 ring-black/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Top Matches</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResults([])}
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                      title="Clear results"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear
                    </button>
                  </div>

                  {!results.length && !loading && !error && (
                    <div className="text-center py-8 text-gray-600">
                      <p>Complete the questionnaire and click Predict to see your interest profile.</p>
                    </div>
                  )}

                  {!!results.length && (
                    <div className="space-y-4">
                      {results.map((r, idx) => (
                        <ResultCard key={idx} result={r} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </RequireCompleteProfile>
  );
}

function ResultCard({ result }) {
  const label = result.interest_category || result.career_category || "";
  const title = categoryNames[label] || `Category ${String(label).toUpperCase()}`;
  const pct = result?.confidence_score != null ? Math.round(result.confidence_score * 100) : null;
  const careers = Array.isArray(result?.suggested_careers) ? result.suggested_careers : [];

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">Interest Category</div>
          <div className="text-lg font-semibold text-gray-900">{title} <span className="text-gray-500">({String(label).toUpperCase()})</span></div>
          {pct !== null && (
            <div className="text-sm text-gray-600 mt-1">Confidence: {pct}%</div>
          )}
        </div>
        {pct !== null && (
          <div className="min-w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-semibold">
            {pct}%
          </div>
        )}
      </div>
      {careers.length > 0 && (
        <div className="mt-3">
          <div className="text-sm font-medium text-gray-800 mb-1">Suggested Careers</div>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {careers.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

