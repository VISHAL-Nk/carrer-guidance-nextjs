import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import twilio from 'twilio';
import connectDB from '@/lib/db';
import User from '@/models/User';
import UserProfile from '@/models/UserProfile';

const pendingRegistrations = new Map();

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^\+?[1-9]\d{1,14}$/.test(phone);
}
function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&=\-])[A-Za-z\d@$!%*?&=\-]{8,}$/.test(password);
}
function validateName(name) {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
}

function json(data, init = 200) {
  return NextResponse.json(data, { status: init });
}

async function handleRegister(req) {
  const body = await req.json();
  const { firstName, middleName, lastName, email, password, confirmPassword, phone } = body || {};
  if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
    return json({ message: 'All required fields must be provided' }, 400);
  }
  if (!validateName(firstName)) return json({ message: 'First name must be 2-50 characters long' }, 400);
  if (!validateName(lastName)) return json({ message: 'Last name must be 2-50 characters long' }, 400);
  if (middleName && !validateName(middleName)) return json({ message: 'Middle name must be 2-50 characters long' }, 400);
  if (!validateEmail(email)) return json({ message: 'Please provide a valid email address' }, 400);
  if (!validatePhone(phone)) return json({ message: 'Please provide a valid phone number' }, 400);
  if (!validatePassword(password)) {
    return json({ message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character' }, 400);
  }
  if (password !== confirmPassword) return json({ message: 'Passwords do not match' }, 400);

  await connectDB();
  const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
  if (existing) return json({ message: 'User already exists with this email or phone' }, 409);

  const hashedPassword = await bcryptjs.hash(password, 12);
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

  // Log OTP in development mode for testing
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔐 OTP for ${phone}: ${otp}`);
  }

  pendingRegistrations.set(phone, {
    firstName: firstName.trim(),
    middleName: middleName?.trim() || null,
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    phone: phone.trim(),
    otp,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    attempts: 0,
  });

  try {
    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;
    if (!sid || !token || !from) throw new Error('Twilio not configured');
    const client = twilio(sid, token);
    await client.messages.create({ body: `Your verification code is: ${otp}. Valid for 5 minutes.`, from, to: phone });
  } catch (e) {
    pendingRegistrations.delete(phone);
    return json({ message: 'Failed to send verification code. Please try again.' }, 503);
  }

  return json({ message: 'Verification code sent successfully', expiresIn: 300 });
}

async function handleLogin(req) {
  const body = await req.json();
  const { email, password } = body || {};
  if (!email || !password) return json({ message: 'Email and password are required' }, 400);
  if (!validateEmail(email)) return json({ message: 'Invalid email format' }, 400);
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user) return json({ message: 'Invalid credentials' }, 401);
  if (!user.isVerified) return json({ message: 'Please verify your account first' }, 403);
  const ok = await bcryptjs.compare(password, user.password);
  if (!ok) return json({ message: 'Invalid credentials' }, 401);

  const existingProfile = await UserProfile.findById(user._id);
  if (!existingProfile) await UserProfile.create({ _id: user._id });
  const { percentage, isComplete } = await user.calculateProfileCompletion();

  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'sih',
    audience: 'students',
  });
  const res = json({
    message: 'Login successful',
    user: { id: user._id, email: user.email, phone: user.phone, firstName: user.firstName, lastName: user.lastName },
    profileCompletion: { isComplete, percentage },
    token,
  });
  res.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 86400, path: '/' });
  return res;
}

async function handleVerifyOtp(req) {
  const body = await req.json();
  const { phone, otp } = body || {};
  if (!phone || !otp) return json({ message: 'Phone and OTP are required' }, 400);
  if (!validatePhone(phone)) return json({ message: 'Invalid phone number format' }, 400);
  if (!/^\d{6}$/.test(otp)) return json({ message: 'OTP must be 6 digits' }, 400);

  const reg = pendingRegistrations.get(phone);
  if (!reg) return json({ message: 'No pending registration found for this phone number' }, 404);
  if (new Date() > reg.otpExpiry) {
    pendingRegistrations.delete(phone);
    return json({ message: 'OTP has expired. Please register again.' }, 410);
  }
  if (reg.attempts >= 3) {
    pendingRegistrations.delete(phone);
    return json({ message: 'Too many failed attempts. Please register again.' }, 429);
  }
  if (reg.otp !== otp) {
    reg.attempts += 1;
    pendingRegistrations.set(phone, reg);
    return json({ message: 'Invalid OTP', attemptsRemaining: 3 - reg.attempts }, 400);
  }

  await connectDB();
  const existingUser = await User.findOne({ $or: [{ email: reg.email }, { phone: reg.phone }] });
  if (existingUser) {
    pendingRegistrations.delete(phone);
    return json({ message: 'User already exists' }, 409);
  }

  const newUser = await User.create({
    firstName: reg.firstName,
    middleName: reg.middleName,
    lastName: reg.lastName,
    email: reg.email,
    password: reg.password,
    phone: reg.phone,
    isVerified: true,
  });
  pendingRegistrations.delete(phone);
  return json({ message: 'User registered successfully', user: { id: newUser._id, email: newUser.email, phone: newUser.phone, firstName: newUser.firstName, lastName: newUser.lastName } }, 201);
}

async function handleSignout() {
  const res = json({ message: 'User signed out successfully' }, 200);
  res.cookies.set('token', '', { httpOnly: true, maxAge: 0, path: '/' });
  return res;
}

export async function POST(req) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');
  try {
    if (action === 'register') return await handleRegister(req);
    if (action === 'login') return await handleLogin(req);
    if (action === 'verifyOTP') return await handleVerifyOtp(req);
    if (action === 'signout') return await handleSignout(req);
    return json({ message: 'Invalid action' }, 400);
  } catch (e) {
    return json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : e.message }, 500);
  }
}

export const dynamic = 'force-dynamic';
