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

  // If visiting protected route without valid session -> issue demo session cookie for seamless demo access!
  if (isProtectedPath && !isValid) {
    const { SignJWT } = await import("jose");
    const demoToken = await new SignJWT({
      userId: "demo-user-1",
      email: "student@university.edu",
      name: "Abhishek",
      role: "Student",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(JWT_SECRET);

    const res = NextResponse.next();
    res.cookies.set(COOKIE_NAME, demoToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
    return res;
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
