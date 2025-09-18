import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import UserProfile from '@/models/UserProfile';
import { careerQuestions, calculateCareerPath, careerPaths } from '@/lib/data/question10';

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
        questionsByCategory: careerQuestions.reduce((acc, q) => ((acc[q.category] = (acc[q.category] || 0) + 1), acc), {}),
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
    return json({ success: true, data: { questions: careerQuestions, totalQuestions: careerQuestions.length, categories: [...new Set(careerQuestions.map((q) => q.category))] } });
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
    const result = calculateCareerPath(responses);
    const assessment = {
      studentInfo: studentInfo || {},
      responses,
      totalQuestions: careerQuestions.length,
      answeredQuestions: responses.length,
      completionPercentage: Math.round((responses.length / careerQuestions.length) * 100),
      recommendation: {
        primaryPath: result.recommendedPath,
        pathDetails: result.pathDetails,
        scores: result.scores,
        confidence: (Math.max(...Object.values(result.scores)) / (careerQuestions.length * 4)) * 100,
      },
      alternativePaths: Object.keys(result.scores)
        .filter((p) => p !== result.recommendedPath)
        .sort((a, b) => result.scores[b] - result.scores[a])
        .slice(0, 2)
        .map((p) => ({ path: p, score: result.scores[p], details: careerPaths[p] })),
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
