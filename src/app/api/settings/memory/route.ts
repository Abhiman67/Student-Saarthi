import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function DELETE() {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const deletedConversations = await db.conversation.deleteMany({
      where: { userId: user.id },
    });

    await logAuditEvent({
      userId: user.id,
      action: "MEMORY_CLEARED",
      details: `Cleared ${deletedConversations.count} conversations and message history.`,
    });

    return successResponse({
      message: `Successfully cleared ${deletedConversations.count} conversations and agent memory.`,
    });
  } catch (error) {
    console.error("Error clearing agent memory:", error);
    return errorResponse("Failed to clear memory", "INTERNAL_SERVER_ERROR", 500);
  }
}
