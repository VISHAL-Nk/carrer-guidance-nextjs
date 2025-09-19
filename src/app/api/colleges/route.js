import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import UserProfile from "@/models/UserProfile";
import { collegeAfter10, collegeAfter12 } from "@/lib/data/collegeData";

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

function getToken(request) {
  const cookie = request.cookies.get("token")?.value;
  const auth = request.headers.get("authorization");
  if (cookie) return cookie;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

async function requireUser(request) {
  const token = getToken(request);
  if (!token) throw new Error("401");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded?.userId) throw new Error("401");
  return decoded.userId;
}

export async function GET(request) {
  try {
    const userId = await requireUser(request);
    await connectDB();
    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    const profile = await UserProfile.findById(userId);
    if (!profile?.class)
      return json(
        {
          message:
            "User profile incomplete. Please complete your profile to view colleges.",
        },
        400
      );
    const all = profile.class === "10th" ? collegeAfter10 : collegeAfter12;
    if (action === "stats") {
      const stats = {
        totalColleges: all.length,
        byType: all.reduce(
          (acc, c) => (
            (acc[c.CollegeType] = (acc[c.CollegeType] || 0) + 1), acc
          ),
          {}
        ),
        byLocation: all.reduce(
          (acc, c) => ((acc[c.location] = (acc[c.location] || 0) + 1), acc),
          {}
        ),
        userClass: profile.class,
      };
      return json({ success: true, data: stats });
    }
    let colleges = [...all];
    const search = url.searchParams.get("search");
    const location = url.searchParams.get("location");
    const type = url.searchParams.get("type");
    if (search) {
      const s = search.toLowerCase();
      colleges = colleges.filter(
        (c) =>
          c.collegeName.toLowerCase().includes(s) ||
          c.location.toLowerCase().includes(s)
      );
    }
    if (location)
      colleges = colleges.filter((c) =>
        c.location.toLowerCase().includes(location.toLowerCase())
      );
    if (type)
      colleges = colleges.filter((c) =>
        c.CollegeType.toLowerCase().includes(type.toLowerCase())
      );
    const locations = [...new Set(all.map((c) => c.location))].sort();
    const types = [...new Set(all.map((c) => c.CollegeType))].sort();
    return json({
      success: true,
      data: {
        colleges,
        totalCount: colleges.length,
        userClass: profile.class,
        filters: { locations, types },
      },
    });
  } catch (e) {
    if (e.message === "401")
      return json(
        { message: "Authentication token is missing or invalid" },
        401
      );
    return json({ success: false, message: "Internal server error" }, 500);
  }
}

export const dynamic = "force-dynamic";
