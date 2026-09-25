import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { conversationId } = params;

  try {
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        agent: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return errorResponse("Conversation not found", "RESOURCE_NOT_FOUND", 404);
    }

    if (conversation.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    return successResponse({ conversation });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return errorResponse("Failed to load conversation", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { conversationId } = params;

  try {
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return errorResponse("Conversation not found", "RESOURCE_NOT_FOUND", 404);
    }

    if (conversation.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    await db.conversation.delete({
      where: { id: conversationId },
    });

    await logAuditEvent({
      userId: user.id,
      action: "CONVERSATION_DELETED",
      details: `Deleted conversation: ${conversation.title}`,
    });

    return successResponse({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return errorResponse("Failed to delete conversation", "INTERNAL_SERVER_ERROR", 500);
  }
}
