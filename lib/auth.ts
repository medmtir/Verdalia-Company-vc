import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db/db";
import { AdminUser } from "@/lib/types";

// SECURITY: JWT_SECRET must be set via environment variable — no hardcoded fallback
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error(
    "CRITICAL: JWT_SECRET environment variable is not set. Refusing to start in production without a secure secret."
  );
}
const EFFECTIVE_SECRET = JWT_SECRET || "dev-only-insecure-key-" + Date.now();

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
  return jwt.sign(payload, EFFECTIVE_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, EFFECTIVE_SECRET) as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Lightweight JWT structure check for middleware (no full verify since
 * jsonwebtoken is not available in Edge Runtime). Validates format only.
 */
export function isValidJwtStructure(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    // Verify header and payload are valid base64
    const header = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    // Check required fields
    if (!header.alg || !payload.adminId || !payload.email) return false;
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function getAuthenticatedAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyAdminToken(token);
  if (!payload) return null;

  return db.admins.findById(payload.adminId);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export { TOKEN_COOKIE };
