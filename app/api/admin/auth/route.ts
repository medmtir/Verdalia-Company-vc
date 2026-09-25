import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import {
  comparePassword,
  getAuthenticatedAdmin,
  hashPassword,
  signAdminToken,
  TOKEN_COOKIE,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
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
