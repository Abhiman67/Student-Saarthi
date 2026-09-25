import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { signupSchema } from "@/lib/validations";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message || "Invalid input", "VALIDATION_ERROR", 400);
    }

    const { name, email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return errorResponse("An account with this email already exists.", "USER_EXISTS", 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        onboardingCompleted: false,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "USER_SIGNUP",
      details: `User signed up: ${user.email}`,
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
      message: "Account created successfully.",
    }, 201);

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return errorResponse("An unexpected error occurred during signup.", "INTERNAL_SERVER_ERROR", 500);
  }
}
