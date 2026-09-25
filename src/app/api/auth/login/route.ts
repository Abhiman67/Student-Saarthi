import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid email or password format", "VALIDATION_ERROR", 400);
    }

    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    let user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // In demo mode on Vercel, auto-create account on the fly for any student email!
      const { hashPassword } = await import("@/lib/auth");
      const hashedPassword = await hashPassword(password);
      user = await db.user.create({
        data: {
          email: normalizedEmail,
          name: normalizedEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ") || "Student",
          passwordHash: hashedPassword,
          onboardingCompleted: true,
        },
      });

      // Create default academic profile for new user
      await db.profile.create({
        data: {
          userId: user.id,
          institution: "University",
          degree: "Computer Science & Engineering",
          semester: "Semester 6",
          goals: "Academic project & research",
          subjects: "Distributed Systems, Machine Learning",
          skills: "TypeScript, Python",
        },
      });
    } else {
      // If user exists, verify password (or accept demo student credentials)
      const isDemoAccount = normalizedEmail === "student@university.edu";
      const isValid = await comparePassword(password, user.passwordHash);
      if (!isValid && !isDemoAccount) {
        return errorResponse("Invalid email or password.", "INVALID_CREDENTIALS", 401);
      }
    }

    await logAuditEvent({
      userId: user.id,
      action: "USER_LOGIN",
      details: `User logged in: ${user.email}`,
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        onboardingCompleted: user.onboardingCompleted,
      },
      message: "Login successful.",
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("An unexpected error occurred during login.", "INTERNAL_SERVER_ERROR", 500);
  }
}
