import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { COOKIE_NAME } from "@/lib/auth";

export async function DELETE() {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    // Delete user cascades profile, projects, tasks, files, etc.
    await db.user.delete({
      where: { id: user.id },
    });

    const response = successResponse({
      message: "Account and all associated records deleted permanently.",
    });

    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Account deletion error:", error);
    return errorResponse("Failed to delete account.", "INTERNAL_SERVER_ERROR", 500);
  }
}
