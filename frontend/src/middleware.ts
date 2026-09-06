import { NextRequest, NextResponse } from "next/server";

/**
 * Lightweight route guard: redirects to /login if there's no auth cookie at
 * all for /owner and /admin routes. This only checks presence of a token —
 * it cannot verify the JWT's signature/role at the edge without calling the
 * backend, so it is a UX convenience, NOT the real authorization boundary.
 * The real boundary is backend/src/common/guards/jwt-auth.guard.ts (and a
 * role guard) on every protected NestJS endpoint — see PROMPT.md item 10.
 */
const PROTECTED_PREFIXES = ["/owner", "/admin", "/onboarding"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("localspotter_token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/admin/:path*", "/onboarding/:path*"],
};
