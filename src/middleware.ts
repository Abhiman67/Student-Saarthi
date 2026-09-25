import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "vidya-sarthi-dev-secret-key-at-least-32-chars-long-12345678"
);

const COOKIE_NAME = "vidya_sarthi_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  const isProtectedPath = pathname.startsWith("/app") || pathname.startsWith("/onboarding");
  const isAuthPath = pathname === "/login" || pathname === "/signup";

  // If visiting protected route without valid session -> redirect to /login
  if (isProtectedPath && !isValid) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting login/signup -> redirect to /app
  if (isAuthPath && isValid) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app/:path*",
    "/onboarding",
    "/login",
    "/signup",
  ],
};
