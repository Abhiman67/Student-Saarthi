import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params;
    const agent = await db.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return errorResponse("Agent not found", "RESOURCE_NOT_FOUND", 404);
    }

    const user = await getCurrentUser();
    let conversations: unknown[] = [];
    if (user) {
      conversations = await db.conversation.findMany({
        where: {
          userId: user.id,
          agentId: agent.id,
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      });
    }

    return successResponse({
      agent,
      conversations,
    });
  } catch (error) {
    console.error("Error fetching agent:", error);
    return errorResponse("Failed to fetch agent details", "INTERNAL_SERVER_ERROR", 500);
  }
}
