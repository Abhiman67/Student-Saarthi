import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const auditEvents = await db.auditEvent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return successResponse({ auditEvents });
  } catch (error) {
    console.error("Error fetching audit events:", error);
    return errorResponse("Failed to load audit activity", "INTERNAL_SERVER_ERROR", 500);
  }
}
