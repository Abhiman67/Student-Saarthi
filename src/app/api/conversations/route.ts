import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { z } from "zod";

const createConvSchema = z.object({
  agentId: z.string().min(1),
  title: z.string().min(1).default("New Discussion"),
});

export async function GET(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  try {
    const conversations = await db.conversation.findMany({
      where: {
        userId: user.id,
        ...(agentId ? { agentId } : {}),
      },
      include: {
        agent: {
          select: { id: true, name: true, icon: true, category: true },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return successResponse({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return errorResponse("Failed to load conversations", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const body = await req.json();
    const result = createConvSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid parameters", "VALIDATION_ERROR", 400);
    }

    const { agentId, title } = result.data;
    const agent = await db.agent.findUnique({ where: { id: agentId } });
    if (!agent) {
      return errorResponse("Agent not found", "RESOURCE_NOT_FOUND", 404);
    }

    const conversation = await db.conversation.create({
      data: {
        userId: user.id,
        agentId,
        title,
      },
      include: {
        agent: true,
      },
    });

    return successResponse({ conversation }, 201);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return errorResponse("Failed to create conversation", "INTERNAL_SERVER_ERROR", 500);
  }
}
