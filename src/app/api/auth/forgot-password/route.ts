import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { forgotPasswordSchema } from "@/lib/validations";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message || "Invalid input", "VALIDATION_ERROR", 400);
    }

    const { email, newPassword } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Return safe message without leaking user existence
      return successResponse({
        message: "If an account with this email exists, the password has been updated.",
      });
    }

    const passwordHash = await hashPassword(newPassword);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await logAuditEvent({
      userId: user.id,
      action: "PASSWORD_RESET",
      details: "Password was reset via forgot-password flow",
    });

    return successResponse({
      message: "Password updated successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse("An error occurred while resetting password.", "INTERNAL_SERVER_ERROR", 500);
  }
}
