import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db/db";
import { AdminUser } from "@/lib/types";

const JWT_SECRET =
  process.env.JWT_SECRET || "verdalia_b2b_secret_key_2026_super_secure_token";
const TOKEN_COOKIE = "verdalia_admin_token";

export interface SessionPayload {
  adminId: string;
  email: string;
  role: string;
}

export function signAdminToken(admin: AdminUser): string {
  const payload: SessionPayload = {
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthenticatedAdmin(): Promise<AdminUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyAdminToken(token);
  if (!payload) return null;

  return db.admins.findById(payload.adminId);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export { TOKEN_COOKIE };
