"use client";
import { useEffect, useMemo, useState } from 'react';
import RequireCompleteProfile from '@/components/RequireCompleteProfile';
import dynamic from 'next/dynamic';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Copy, 
  ExternalLink,
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';

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
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [userClass, setUserClass] = useState(null);
  const { notify } = useToast();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const profRes = await fetch('/api/profile');
        const prof = await profRes.json();
        const currentClass = prof?.profile?.class;
        setUserClass(currentClass);

        if (currentClass === '12th') {
          setQuestions([]);
          setLoading(false);
          return;
        }

        const qRes = await fetch('/api/questions');
        const qData = await qRes.json();
        if (qRes.ok) {
          setQuestions(qData.data?.questions || []);
        } else {
          notify(qData.message || 'Failed to load questions');
        }
      } catch (error) {
        notify('Failed to load assessment');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [notify]);

  const progress = useMemo(() => {
    if (questions.length === 0) return 0;
    const answered = Object.keys(answers).length;
    return Math.round((answered / questions.length) * 100);
  }, [questions.length, answers]);

  const allAnswered = useMemo(() => 
    questions.length > 0 && questions.every(q => answers[q.id] != null), 
    [questions, answers]
  );

  async function onSubmit() {
    if (!allAnswered) {
      notify('Please answer all questions to get your recommendation.');
      return;
    }

    setSubmitting(true);
    try {
      const responses = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answer
      }));

      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses })
      });

      const data = await res.json();
      
      if (!res.ok) {
        notify(data.message || 'Failed to process assessment');
        return;
      }

      const recommendedStream = data.data?.recommendation?.primaryPath;
      if (!recommendedStream) {
        notify('Could not determine optimal stream');
        return;
      }

      // Generate AI roadmap
      const roadmapRes = await fetch(`/api/roadmap?topic=${encodeURIComponent(recommendedStream)}`);
      const roadmapData = await roadmapRes.json();

      setResult({
        assessment: data.data,
        stream: recommendedStream,
        mermaidCode: roadmapData.mermaidCode
      });

      notify('Assessment completed successfully!');
    } catch (error) {
      notify('Failed to process assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function copyMermaidCode() {
    if (result?.mermaidCode) {
      navigator.clipboard.writeText(result.mermaidCode);
      notify('Mermaid code copied to clipboard!');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 loading-pulse">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">Loading your career assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Career Guidance Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover your optimal career path through our comprehensive AI-powered assessment
          </p>
        </div>

        {userClass === '12th' ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Assessment Under Development
              </h2>
              <p className="text-gray-600 mb-6">
                We're currently developing specialized career guidance for 12th grade students. 
                Our comprehensive assessment will be available soon with tailored recommendations 
                for your academic level.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Coming Soon:</strong> Advanced career assessment for 12th grade students 
                  with college recommendations and entrance exam guidance.
                </p>
              </div>
            </div>
          </div>
        ) : result ? (
          <ResultView result={result} onCopyCode={copyMermaidCode} />
        ) : (
          <AssessmentView
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
            progress={progress}
            allAnswered={allAnswered}
            submitting={submitting}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
}

function AssessmentView({ questions, answers, setAnswers, progress, allAnswered, submitting, onSubmit }) {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Progress Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Progress</h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Completion</span>
              <span className="text-sm font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Questions</span>
              <span className="text-sm font-medium">{questions.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Answered</span>
              <span className="text-sm font-medium">{Object.keys(answers).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className="text-sm font-medium">{questions.length - Object.keys(answers).length}</span>
            </div>
          </div>

          <button
            onClick={onSubmit}
            disabled={!allAnswered || submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold btn-hover transition-all flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Get My Results</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {!allAnswered && (
            <p className="text-xs text-gray-500 mt-3 text-center">
              Answer all questions to unlock your personalized career guidance
            </p>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              selectedAnswer={answers[question.id]}
              onAnswerChange={(answer) => setAnswers(prev => ({ ...prev, [question.id]: answer }))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ question, index, selectedAnswer, onAnswerChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 card-hover">
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={selectedAnswer === option.value}
                  onChange={() => onAnswerChange(option.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 flex-1">{option.text}</span>
                {selectedAnswer === option.value && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultView({ result, onCopyCode }) {
  const { assessment, stream, mermaidCode } = result;
  const confidence = Math.round(assessment.recommendation?.confidence || 0);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Results */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Recommended Stream</h2>
              <p className="text-gray-600">Based on your assessment results</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold gradient-text mb-2">{stream}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Confidence: {confidence}%</span>
              <span>•</span>
              <span>Questions Answered: {assessment.answeredQuestions}</span>
            </div>
          </div>

          {assessment.recommendation?.pathDetails && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{assessment.recommendation.pathDetails.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {assessment.recommendation.pathDetails.subjects?.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Career Opportunities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {assessment.recommendation.pathDetails.careerOptions?.map((career, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700 text-sm">{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alternative Paths */}
        {assessment.alternativePaths && assessment.alternativePaths.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Paths</h3>
            <div className="space-y-3">
              {assessment.alternativePaths.map((alt, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{alt.path}</span>
                    <span className="text-sm text-gray-500">Score: {alt.score}</span>
                  </div>
                  <p className="text-sm text-gray-600">{alt.details?.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Roadmap */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI-Generated Roadmap</h2>
                <p className="text-gray-600">Your personalized learning path</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onCopyCode}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Code</span>
              </button>
              <a
                href="https://mermaid.live"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Mermaid Live</span>
              </a>
            </div>
          </div>

          {mermaidCode ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <MermaidRenderer code={mermaidCode} />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 loading-pulse">
                <TrendingUp className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500">Generating your personalized roadmap...</p>
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Copy the Mermaid code and paste it into{' '}
              <a
                href="https://mermaid.live"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                mermaid.live
              </a>{' '}
              to edit and customize your roadmap.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}