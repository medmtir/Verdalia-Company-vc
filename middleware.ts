import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight JWT structure validation for Edge Runtime.
 * Full cryptographic verification happens in API route handlers.
 */
function isValidJwtStructure(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!header.alg || !payload.adminId || !payload.email) return false;
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin dashboard routes
  if (pathname.startsWith("/admin/dashboard")) {
    const token = request.cookies.get("verdalia_admin_token")?.value;
    if (!token || !isValidJwtStructure(token)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes (except authentication)
  if (
    pathname.startsWith("/api/admin/") &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    const token = request.cookies.get("verdalia_admin_token")?.value;
    if (!token || !isValidJwtStructure(token)) {
      return NextResponse.json(
        { error: "Accès non autorisé. Session administrateur requise." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/admin/:path*"],
};
