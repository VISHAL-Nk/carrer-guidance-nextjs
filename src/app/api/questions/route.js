import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import UserProfile from '@/models/UserProfile';
import { careerQuestions } from '@/lib/data/question10';

// Map category letters from Python model to stream details expected by UI
const careerPaths = {
  'Science Stream': {
    name: 'Science Stream',
    description: 'Focus on Physics, Chemistry, Mathematics/Biology leading to engineering, medicine, research, and technology careers.',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'],
    careerOptions: ['Engineer', 'Doctor', 'Scientist', 'Pharmacist', 'Biotechnologist']
  },
  'Commerce Stream': {
    name: 'Commerce Stream',
    description: 'Emphasis on business, finance, and economics leading to careers in management, accounting, banking, and entrepreneurship.',
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'Informatics Practices'],
    careerOptions: ['Entrepreneur', 'Business Manager', 'Banker', 'Chartered Accountant', 'Marketing Executive']
  },
  'Arts/Humanities Stream': {
    name: 'Arts/Humanities Stream',
    description: 'Creative and social sciences pathway ideal for design, media, education, civil services, and social work careers.',
    subjects: ['History', 'Political Science', 'Sociology', 'Psychology', 'Fine Arts'],
    careerOptions: ['Graphic Designer', 'Animator', 'Writer', 'Musician', 'Teacher', 'Social Worker']
  },
  'Diploma Courses': {
    name: 'Diploma Courses',
    description: 'Job-oriented technical diploma programs after 10th for early specialization in engineering trades and applied sciences.',
    subjects: ['Applied Mathematics', 'Workshop Practice', 'Electrical Basics', 'Mechanics'],
    careerOptions: ['Technician', 'Junior Engineer', 'Lab Assistant']
  },
  'Vocational Training': {
    name: 'Vocational Training',
    description: 'Hands-on ITI and vocational programs that develop practical skills for immediate employment across trades.',
    subjects: ['Trade Theory', 'Workshop Practice', 'Safety & Tools'],
    careerOptions: ['Fitter', 'Electrician', 'Welder', 'Mechanic']
  }
};

// Letter category to stream mapping
function categoryToStream(letter) {
  switch ((letter || '').toLowerCase()) {
    case 'a': return 'Science Stream'; // Practical/Technical
    case 'b': return 'Science Stream'; // Research/Scientific
    case 'c': return 'Arts/Humanities Stream';
    case 'd': return 'Arts/Humanities Stream'; // People/Social
    case 'e': return 'Commerce Stream';
    case 'f': return 'Commerce Stream';
    default: return 'Science Stream';
  }
}

function json(data, status = 200) { return NextResponse.json(data, { status }); }

function getToken(request) {
  const cookie = request.cookies.get('token')?.value;
  const auth = request.headers.get('authorization');
  if (cookie) return cookie;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

async function require10thUser(request) {
  const token = getToken(request);
  if (!token) throw new Error('401');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded?.userId) throw new Error('401');
  await connectDB();
  const profile = await UserProfile.findById(decoded.userId);
  if (!profile?.class) throw new Error('400');
  if (profile.class !== '10th') throw new Error('403');
  return decoded.userId;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    if (action === 'career-paths') {
      return json({ success: true, data: { careerPaths, totalPaths: Object.keys(careerPaths).length } });
    }
    if (action === 'stats') {
      const stats = {
        totalQuestions: careerQuestions.length,
        questionsByCategory: { general: careerQuestions.length },
        availableCareerPaths: Object.keys(careerPaths).length,
        careerPathNames: Object.keys(careerPaths).map((key) => careerPaths[key].name),
      };
      return json({ success: true, data: stats });
    }
    await require10thUser(request);
    const id = url.searchParams.get('id');
    if (id) {
      const q = careerQuestions.find((x) => x.id === Number(id));
      if (!q) return json({ success: false, error: 'Question not found' }, 404);
      return json({ success: true, data: q });
    }
    return json({ success: true, data: { questions: careerQuestions, totalQuestions: careerQuestions.length, categories: ['general'] } });
  } catch (e) {
    if (e.message === '401') return json({ message: 'Authentication token is missing' }, 401);
    if (e.message === '400') return json({ message: 'User profile incomplete. Please complete your profile first.' }, 400);
    if (e.message === '403') return json({ success: false, message: 'Career guidance questionnaire is currently available only for 10th grade students.' }, 403);
    return json({ success: false, error: 'Failed to fetch questions' }, 500);
  }
}

export async function POST(request) {
  try {
    await require10thUser(request);
    const body = await request.json();
    const { responses, studentInfo } = body || {};
    if (!responses || !Array.isArray(responses) || responses.length === 0) return json({ error: 'Invalid responses' }, 400);
    for (const r of responses) {
      if (!r.questionId || !r.answer) return json({ error: 'Each response must have questionId and answer.' }, 400);
    }
    // Convert to simple answers array expected by Python backend
    const answers = responses
      .sort((a, b) => a.questionId - b.questionId)
      .map((r) => String(r.answer).toLowerCase());

    // Proxy to Flask backend
    const backendUrl = process.env.PY_BACKEND_URL || 'http://localhost:8080';
    const res = await fetch(`${backendUrl}/predict-career`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });

    if (!res.ok) {
      const text = await res.text();
      let message = `Prediction service error (${res.status})`;
      try { message = JSON.parse(text).message || message; } catch {}
      return json({ success: false, message }, res.status);
    }

    const predictions = await res.json(); // array with top predictions
    const top = Array.isArray(predictions) && predictions[0] ? predictions[0] : null;
    const second = Array.isArray(predictions) && predictions[1] ? predictions[1] : null;

    if (!top) return json({ success: false, message: 'No prediction result returned' }, 502);

    const primaryStream = categoryToStream(top.career_category || top.interest_category);
    const primaryDetails = careerPaths[primaryStream] || null;
    const secondaryStream = second ? categoryToStream(second.career_category || second.interest_category) : null;
    const secondaryDetails = secondaryStream ? careerPaths[secondaryStream] : null;

    // Build assessment object to match existing UI expectations
    const assessment = {
      studentInfo: studentInfo || {},
      responses,
      totalQuestions: careerQuestions.length,
      answeredQuestions: responses.length,
      completionPercentage: Math.round((responses.length / careerQuestions.length) * 100),
      recommendation: {
        primaryPath: primaryStream,
        pathDetails: primaryDetails,
        scores: {
          [primaryStream]: Math.round((top.confidence_score || 0.8) * 100),
          ...(secondaryStream ? { [secondaryStream]: Math.round((second.confidence_score || 0.6) * 100) } : {})
        },
        confidence: Math.round(((top.confidence_score || 0.8) * 100)),
      },
      alternativePaths: secondaryStream ? [
        { path: secondaryStream, score: Math.round((second.confidence_score || 0.6) * 100), details: secondaryDetails }
      ] : [],
      timestamp: new Date().toISOString(),
    };

    return json({ success: true, data: assessment });
  } catch (e) {
    if (e.message === '401') return json({ message: 'Authentication token is missing' }, 401);
    if (e.message === '400') return json({ message: 'User profile incomplete. Please complete your profile first.' }, 400);
    if (e.message === '403') return json({ success: false, message: 'Access denied' }, 403);
    return json({ success: false, error: 'Failed to process assessment' }, 500);
  }
}

export const dynamic = 'force-dynamic';
