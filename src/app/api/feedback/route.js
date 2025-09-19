import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Feedback from '@/models/Feedback';

function json(data, status = 200) { return NextResponse.json(data, { status }); }

function getToken(request) {
  const cookie = request.cookies.get('token')?.value;
  const auth = request.headers.get('authorization');
  if (cookie) return cookie;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, message, rating } = body || {};
    if (!name || !email || !message) {
      return json({ success: false, message: 'Name, email and message are required.' }, 400);
    }

    let userId = null;
    try {
      const token = getToken(request);
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded?.userId) userId = decoded.userId;
      }
    } catch {}

    const doc = await Feedback.create({ userId, name, email, message, rating });
    return json({ success: true, data: { id: doc._id } }, 201);
  } catch (e) {
    console.error('Feedback POST error:', e);
    return json({ success: false, message: 'Failed to submit feedback' }, 500);
  }
}

export const dynamic = 'force-dynamic';
