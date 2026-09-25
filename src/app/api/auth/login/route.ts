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

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return errorResponse("Invalid email or password.", "INVALID_CREDENTIALS", 401);
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return errorResponse("Invalid email or password.", "INVALID_CREDENTIALS", 401);
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
