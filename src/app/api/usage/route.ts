import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const [agentCount, messageCount, fileCount, projectsCount, tasksCount] = await Promise.all([
      db.agent.count(),
      db.usageEvent.aggregate({
        where: { userId: user.id, eventType: "MESSAGE_SENT" },
        _sum: { count: true },
      }),
      db.file.count({ where: { userId: user.id } }),
      db.project.count({ where: { userId: user.id } }),
      db.task.count({ where: { userId: user.id } }),
    ]);

    const totalMessages = messageCount._sum.count || 0;

    return successResponse({
      plan: "Student Scholar (Free Viva Tier)",
      billingStatus: "Billing is not active in this MVP.",
      stats: {
        agentCount,
        maxAgents: 6,
        totalMessages,
        maxMessages: 1000,
        totalFiles: fileCount,
        maxFiles: 50,
        projectsCount,
        tasksCount,
      },
      limits: {
        maxFileSizeMb: 10,
        allowedFormats: ["PDF", "DOCX", "TXT", "MD"],
        activeProviders: process.env.OPENAI_API_KEY ? "Live LLM Provider + Mock Engine" : "Deterministic Viva Mock Provider",
      },
    });
  } catch (error) {
    console.error("Error fetching usage statistics:", error);
    return errorResponse("Failed to load usage statistics", "INTERNAL_SERVER_ERROR", 500);
  }
}
