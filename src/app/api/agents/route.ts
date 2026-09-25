import { db } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const agents = await db.agent.findMany({
      orderBy: { name: "asc" },
    });
    return successResponse({ agents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return errorResponse("Failed to fetch agents", "INTERNAL_SERVER_ERROR", 500);
  }
}
