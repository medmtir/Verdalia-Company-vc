import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import {
  comparePassword,
  getAuthenticatedAdmin,
  hashPassword,
  signAdminToken,
  TOKEN_COOKIE,
} from "@/lib/auth";

// ===== SECURITY: Brute force protection =====
const loginAttempts = new Map<string, { count: number; resetAt: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes lockout after max attempts

function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + ATTEMPT_WINDOW, lockedUntil: 0 });
    return { allowed: true };
  }

  if (entry.lockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((entry.lockedUntil - now) / 1000) };
  }

  entry.count++;
  if (entry.count > MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION;
    return { allowed: false, retryAfter: Math.ceil(LOCKOUT_DURATION / 1000) };
  }

  return { allowed: true };
}

function resetLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(req: NextRequest) {
  // Rate limit check
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateCheck = checkLoginRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: `Too many login attempts. Please try again in ${rateCheck.retryAfter} seconds.` },
      { status: 429, headers: { "Retry-After": String(rateCheck.retryAfter) } }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = db.admins.findByEmail(email.trim());
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or credentials." },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, admin.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or credentials." },
        { status: 401 }
      );
    }

    resetLoginAttempts(ip);
    db.admins.updateLastLogin(admin.id);
    const token = signAdminToken(admin);

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication service error." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      last_login: admin.last_login,
    },
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: TOKEN_COOKIE,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}

export async function PUT(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current and new passwords are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const isMatch = await comparePassword(currentPassword, admin.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    db.admins.updatePassword(admin.id, newHash);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update password." },
      { status: 500 }
    );
  }
}
