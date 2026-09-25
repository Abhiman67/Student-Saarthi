import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { chatMessageSchema } from "@/lib/validations";
import { generateAgentResponse } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const body = await req.json();
    const result = chatMessageSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message || "Invalid message format", "VALIDATION_ERROR", 400);
    }

    const { agentId, message, conversationId: requestedConvId } = result.data;

    let convId = requestedConvId;
    if (convId) {
      const conv = await db.conversation.findUnique({
        where: { id: convId },
      });
      if (!conv || conv.userId !== user.id) {
        return errorResponse("Conversation not found or unauthorized", "RESOURCE_NOT_FOUND", 404);
      }
    } else {
      // Create new conversation
      const summaryTitle = message.slice(0, 35) + (message.length > 35 ? "..." : "");
      const newConv = await db.conversation.create({
        data: {
          userId: user.id,
          agentId,
          title: summaryTitle,
        },
      });
      convId = newConv.id;
    }

    // Save user message
    const userMsg = await db.message.create({
      data: {
        conversationId: convId,
        role: "user",
        content: message,
      },
    });

    // Fetch conversation history
    const history = await db.message.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    // Generate AI agent response
    const aiOutput = await generateAgentResponse({
      agentId,
      userMessage: message,
      userId: user.id,
      history: history.map((m) => ({ role: m.role, content: m.content })),
    });

    // Save assistant message
    const assistantMsg = await db.message.create({
      data: {
        conversationId: convId,
        role: "assistant",
        content: aiOutput.content,
        citations: aiOutput.citations ? JSON.stringify(aiOutput.citations) : null,
        approvalRequired: aiOutput.approvalRequired || false,
        approvalId: (aiOutput.approvalData?.payload?.approvalId as string) || null,
      },
    });

    // Record usage
    await db.usageEvent.create({
      data: {
        userId: user.id,
        eventType: "MESSAGE_SENT",
        count: 1,
      },
    });

    // Update conversation updatedAt
    await db.conversation.update({
      where: { id: convId },
      data: { updatedAt: new Date() },
    });

    return successResponse({
      conversationId: convId,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      approvalData: aiOutput.approvalData || null,
      citations: aiOutput.citations || [],
    });
  } catch (error) {
    console.error("Chat error:", error);
    return errorResponse("Failed to process message", "INTERNAL_SERVER_ERROR", 500);
  }
}
