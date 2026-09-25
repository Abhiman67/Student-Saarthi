import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    const approvals = await db.approval.findMany({
      where: {
        userId: user.id,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse({ approvals });
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return errorResponse("Failed to load approvals", "INTERNAL_SERVER_ERROR", 500);
  }
}
