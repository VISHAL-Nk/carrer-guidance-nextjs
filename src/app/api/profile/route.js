import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import UserProfile from '@/models/UserProfile';

function json(data, status = 200) { return NextResponse.json(data, { status }); }

function getToken(request) {
  const cookie = request.cookies.get('token')?.value;
  const auth = request.headers.get('authorization');
  if (cookie) return cookie;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

async function requireUser(request) {
  const token = getToken(request);
  if (!token) throw new Error('401');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded?.userId) throw new Error('401');
  return decoded.userId;
}

export async function PUT(request) {
  try {
    const userId = await requireUser(request);
    const profileData = await request.json();
    if (!profileData || Object.keys(profileData).length === 0) return json({ message: 'Profile data is required' }, 400);
    if (!profileData.stream && profileData.class === '10th') profileData.stream = 'Other';
    await connectDB();
    const existing = await UserProfile.findById(userId);
    if (!existing) return json({ message: 'User profile not found' }, 404);
    existing.dob = profileData.dob ?? existing.dob;
    existing.gender = profileData.gender ?? existing.gender;
    existing.location = profileData.location ?? existing.location;
    existing.class = profileData.class ?? existing.class;
    existing.stream = profileData.stream ?? existing.stream;
    await existing.save();
    const user = await User.findById(userId);
    const { percentage, isComplete } = await user.calculateProfileCompletion();
    return json({ message: 'Profile updated successfully', profile: existing, profileCompletion: { isComplete, percentage } }, 201);
  } catch (e) {
    if (e.message === '401') return json({ message: 'Authentication token is missing or invalid' }, 401);
    return json({ message: 'Server error' }, 500);
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const variant = url.searchParams.get('v');
  try {
    const userId = await requireUser(request);
    await connectDB();
    if (variant === 'completion') {
      const user = await User.findById(userId);
      if (!user) return json({ message: 'User not found' }, 404);
      const { percentage, isComplete } = await user.calculateProfileCompletion();
      return json({ profileCompletion: { isComplete, percentage } });
    }
    const profile = await UserProfile.findById(userId);
    if (!profile) return json({ message: 'Profile not found' }, 404);
    const user = await User.findById(userId);
    const { percentage, isComplete } = await user.calculateProfileCompletion();
    return json({ profile, profileCompletion: { isComplete, percentage } });
  } catch (e) {
    console.error('Profile GET API error:', e);
    if (e.message === '401') return json({ message: 'Authentication token is missing or invalid' }, 401);
    return json({ message: 'Server error', error: e.message }, 500);
  }
}

export const dynamic = 'force-dynamic';
