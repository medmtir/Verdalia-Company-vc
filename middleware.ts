import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin dashboard routes
  if (pathname.startsWith("/admin/dashboard")) {
    const token = request.cookies.get("verdalia_admin_token")?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes (except authentication)
  if (
    pathname.startsWith("/api/admin/") &&
    !pathname.startsWith("/api/admin/auth/login")
  ) {
    const token = request.cookies.get("verdalia_admin_token")?.value;
    if (!token) {
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

