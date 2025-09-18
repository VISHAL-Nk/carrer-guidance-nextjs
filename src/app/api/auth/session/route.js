import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ authenticated: false }, { status: 200 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) return NextResponse.json({ authenticated: false }, { status: 200 });
    await connectDB();
    const user = await User.findById(decoded.userId).select('firstName lastName email phone');
    if (!user) return NextResponse.json({ authenticated: false }, { status: 200 });
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

export const dynamic = 'force-dynamic';
