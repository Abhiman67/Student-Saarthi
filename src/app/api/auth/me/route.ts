import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return errorResponse("Not authenticated", "UNAUTHORIZED", 401);
  }

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  return successResponse({
    user,
    profile,
  });
}
