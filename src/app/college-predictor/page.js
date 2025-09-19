"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Target,
  Loader2,
  AlertTriangle,
  Search,
  RefreshCw,
  Filter,
  Info,
} from "lucide-react";

export default function Page() {
  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white";

  // Form state
  const [stream, setStream] = useState("");
  const [exam, setExam] = useState("");
  const [rank, setRank] = useState("");
  const [gender, setGender] = useState("");
  const [quota, setQuota] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(5);

  // Request state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const isScience = stream === "Science";
  const isJEE = exam === "JEE";

  const disabledBecauseUnderDev = useMemo(() => {
    if (!stream) return true;
    if (!isScience) return true;
    if (!exam) return true;
    if (!isJEE) return true;
    return false;
  }, [stream, exam, isScience, isJEE]);

  const canSubmit = useMemo(() => {
    if (disabledBecauseUnderDev) return false;
    const parsedRank = Number(rank);
    return (
      stream &&
      exam &&
      isScience &&
      isJEE &&
      !Number.isNaN(parsedRank) &&
      parsedRank > 0 &&
      gender &&
      quota &&
      category &&
      !!limit
    );
  }, [
    disabledBecauseUnderDev,
    stream,
    exam,
    rank,
    gender,
    quota,
    category,
    limit,
    isScience,
    isJEE,
  ]);

  function resetResults() {
    setResults([]);
    setError("");
    setSubmitted(false);
  }

  // Add this debug version of handleSubmit to your component

// Replace your handleSubmit function with this updated version
async function handleSubmit(e) {
  e.preventDefault();
  setSubmitted(true);
  setError("");
  setLoading(true);
  setResults([]);

  try {
    const body = {
      stream,
      exam,
      rank: Number(rank),
      gender,
      quota,
      category,
      limit: Number(limit),
    };

    console.log("Frontend - Sending request:", body);

    // Use Next.js API route instead of direct Flask call
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("Frontend - Response status:", res.status);

    if (!res.ok) {
      let msg = `Request failed (${res.status})`;
      try {
        const errorData = await res.json();
        console.log("Frontend - Error response:", errorData);
        if (errorData?.message) msg = errorData.message;
      } catch (parseError) {
        console.error("Frontend - Error parsing error response:", parseError);
      }
      throw new Error(msg);
    }

    const data = await res.json();
    console.log("Frontend - Success response:", data);
    
    // Handle both direct array and nested response formats
    const normalized = (Array.isArray(data) ? data : data?.results || data?.data?.colleges || [])
      .map(normalizeCollegeRecord)
      .filter(Boolean);

    console.log("Frontend - Normalized results:", normalized);
    setResults(normalized.slice(0, Number(limit) || 5));
    
    if (normalized.length === 0) {
      setError("No colleges found matching your criteria. Try adjusting your filters.");
    }
    
  } catch (err) {
    console.error("Frontend - Request error:", err);
    const msg = (err && typeof err === "object" && "message" in err) ? err.message : String(err);
    setError(msg);
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen">
      <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  College Predictor
                </h1>
                <p className="text-gray-600">
                  Find likely colleges and programs based on your rank and
                  preferences.
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-blue-700 hover:text-blue-800 font-medium hidden sm:inline-flex"
            >
              Home
            </Link>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Filters/Form */}
            <div className="lg:col-span-1">
              <form
                onSubmit={handleSubmit}
                className="glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur rounded-2xl shadow-lg p-6 ring-1 ring-black/5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Details
                  </h2>
                </div>

                {/* Stream */}
                <Field label="Stream" required>
                  <select
                    className={inputClass}
                    value={stream}
                    onChange={(e) => {
                      setStream(e.target.value);
                      setExam("");
                      setGender("");
                      setQuota("");
                      setCategory("");
                      setRank("");
                      resetResults();
                    }}
                  >
                    <option value="" disabled>
                      Select stream
                    </option>
                    <option>Science</option>
                    <option>Commerce</option>
                    <option>Arts</option>
                  </select>
                </Field>

                {/* Stream under development notice */}
                {stream && !isScience && (
                  <UnderDevNote text="Only Science stream is supported right now. Other streams are under development." />
                )}

                {/* Exam (only when Science) */}
                {isScience && (
                  <Field label="Entrance Exam" required>
                    <select
                      className={inputClass}
                      value={exam}
                      onChange={(e) => {
                        setExam(e.target.value);
                        setGender("");
                        setQuota("");
                        setCategory("");
                        setRank("");
                        resetResults();
                      }}
                    >
                      <option value="" disabled>
                        Select exam
                      </option>
                      <option>JEE</option>
                      <option>NEET</option>
                      <option>JKCET</option>
                    </select>
                  </Field>
                )}

                {/* Exam under development notice */}
                {isScience && exam && !isJEE && (
                  <UnderDevNote text="Only JEE is supported right now. Other exams are under development." />
                )}

                {/* Remaining fields only when Science + JEE */}
                {isScience && isJEE && (
                  <>
                    <Field
                      label="Rank"
                      required
                      helper="Enter your All India Rank (AIR)"
                    >
                      <input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        placeholder="e.g., 25467"
                        className={inputClass}
                        value={rank}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (!v || Number(v) >= 0) setRank(v);
                          resetResults();
                        }}
                      />
                    </Field>

                    <Field label="Gender" required>
                      <select
                        className={inputClass}
                        value={gender}
                        onChange={(e) => {
                          setGender(e.target.value);
                          resetResults();
                        }}
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </Field>

                    <Field label="Quota" required>
                      <select
                        className={inputClass}
                        value={quota}
                        onChange={(e) => {
                          setQuota(e.target.value);
                          resetResults();
                        }}
                      >
                        <option value="" disabled>
                          Select quota
                        </option>
                        <option>All India</option>
                        <option>Home State</option>
                        <option>Government</option>
                        <option>J&K</option>
                        <option>Ladakh</option>
                        <option>Other</option>
                      </select>
                    </Field>

                    <Field label="Category" required>
                      <select
                        className={inputClass}
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          resetResults();
                        }}
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        <option>Open</option>
                        <option>EWS</option>
                        <option>OBC-NCL</option>
                        <option>SC</option>
                        <option>ST</option>
                        <option>PWD</option>
                      </select>
                    </Field>

                    <Field label="No. of colleges to display" required>
                      <select
                        className={inputClass}
                        value={limit}
                        onChange={(e) => {
                          setLimit(Number(e.target.value));
                          resetResults();
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                      </select>
                    </Field>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={!canSubmit || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Predict Colleges
                    </>
                  )}
                </button>

                {submitted && !canSubmit && (
                  <p className="mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    Please complete the form with valid values. Only Science →
                    JEE flow is supported right now.
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
                  This tool sends your preferences to your local backend at
                  <span className="font-mono"> http://localhost:8080/predict</span>.
                  Ensure it is running and CORS is enabled.
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              <div className="glass bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur rounded-2xl shadow-lg p-6 ring-1 ring-black/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Predicted Colleges
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={resetResults}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    title="Clear results"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Clear
                  </button>
                </div>

                {!results.length && !loading && !error && (
                  <div className="text-center py-12 text-gray-600">
                    <p>
                      Fill the form and click Predict to see matched colleges.
                    </p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="min-w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-900 text-gray-700 text-sm">
                          <Th>College</Th>
                          <Th>Program</Th>
                          <Th>Quota</Th>
                          <Th>Seat Type</Th>
                          <Th>Gender</Th>
                          <Th className="text-right">Opening Rank</Th>
                          <Th className="text-right">Closing Rank</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r, idx) => (
                          <tr
                            key={`${r.college}-${r.program}-${idx}`}
                            className={
                              idx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                            }
                          >
                            <Td>
                              <div className="font-medium text-gray-900">
                                {r.college}
                              </div>
                              {r.campus && (
                                <div className="text-xs text-gray-500">
                                  {r.campus}
                                </div>
                              )}
                            </Td>
                            <Td>{r.program}</Td>
                            <Td>{r.quota}</Td>
                            <Td>{r.seatType}</Td>
                            <Td>{r.gender}</Td>
                            <Td className="text-right tabular-nums">
                              {fmtRank(r.openingRank)}
                            </Td>
                            <Td className="text-right tabular-nums">
                              {fmtRank(r.closingRank)}
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Small UI primitives
function Field({ label, required, helper, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
    </div>
  );
}

function UnderDevNote({ text }) {
  return (
    <div className="mb-4 text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
      {text}
    </div>
  );
}

function Th({ children, className = "" }) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function Td({ children, className = "" }) {
  return (
    <td className={`px-4 py-3 align-top text-sm text-gray-800 ${className}`}>
      {children}
    </td>
  );
}

// Helpers
function fmtRank(n) {
  if (n === undefined || n === null || n === "") return "—";
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  return num.toLocaleString("en-IN");
}

function normalizeCollegeRecord(item) {
  if (!item || typeof item !== "object") return null;
  const val = (obj, keys, fallback = "") => {
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "")
        return obj[k];
      const lower = Object.keys(obj).find(
        (kk) => kk.toLowerCase() === k.toLowerCase()
      );
      if (lower && obj[lower] !== undefined) return obj[lower];
    }
    return fallback;
  };

  const college = val(item, [
    "college_name",
    "college",
    "institute",
    "institute_name",
  ]);
  const campus = val(item, ["campus", "location"], "");
  const program = val(item, [
    "academic_program_name",
    "program",
    "branch",
    "course",
  ]);
  const quota = val(item, ["quota"], "");
  const seatType = val(item, ["seat_type", "seatType", "seat"], "");
  const gender = val(item, ["gender"], "");
  const openingRank = val(
    item,
    ["opening_rank", "openingRank", "open_rank", "opening"],
    ""
  );
  const closingRank = val(
    item,
    ["closing_rank", "closingRank", "close_rank", "closing"],
    ""
  );

  return {
    college,
    campus,
    program,
    quota,
    seatType,
    gender,
    openingRank,
    closingRank,
  };
}
