import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const [profile, projects, tasks, files, applications, auditEvents] = await Promise.all([
      db.profile.findUnique({ where: { userId: user.id } }),
      db.project.findMany({ where: { userId: user.id }, include: { tasks: true } }),
      db.task.findMany({ where: { userId: user.id } }),
      db.file.findMany({
        where: { userId: user.id },
        select: { id: true, name: true, type: true, size: true, status: true, summary: true, createdAt: true },
      }),
      db.application.findMany({ where: { userId: user.id } }),
      db.auditEvent.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    ]);

    await logAuditEvent({
      userId: user.id,
      action: "DATA_EXPORTED",
      details: "Exported all student personal workspace data",
    });

    const exportData = {
      product: "Vidya Sarthi",
      exportTimestamp: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      profile,
      projects,
      tasks,
      files,
      applications,
      auditEvents,
    };

    return successResponse(exportData);
  } catch (error) {
    console.error("Export data error:", error);
    return errorResponse("Failed to export student data", "INTERNAL_SERVER_ERROR", 500);
  }
}
