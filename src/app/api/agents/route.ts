import { db } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [activeAgents, futureScopeAgents] = await Promise.all([
      db.agent.findMany({
        where: { isFutureScope: false },
        orderBy: { name: "asc" },
      }),
      db.agent.findMany({
        where: { isFutureScope: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return successResponse({
      agents: activeAgents,
      futureScopeAgents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return errorResponse("Failed to fetch agents", "INTERNAL_SERVER_ERROR", 500);
  }
}
