import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { projectSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const projects = await db.project.findMany({
      where: { userId: user.id },
      include: {
        tasks: {
          select: { id: true, status: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = projects.map((p) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.status === "Completed").length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      return {
        ...p,
        totalTasks,
        completedTasks,
        progress,
      };
    });

    return successResponse({ projects: formatted });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return errorResponse("Failed to fetch projects", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const body = await req.json();
    const result = projectSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message || "Invalid project details", "VALIDATION_ERROR", 400);
    }

    const { name, description, type, status, targetDate, linkedAgentIds } = result.data;

    const project = await db.project.create({
      data: {
        userId: user.id,
        name,
        description: description || null,
        type,
        status,
        targetDate: targetDate ? new Date(targetDate) : null,
        linkedAgentIds: linkedAgentIds ? JSON.stringify(linkedAgentIds) : null,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "PROJECT_CREATED",
      details: `Created project "${project.name}" (${project.type})`,
    });

    return successResponse({ project }, 201);
  } catch (error) {
    console.error("Error creating project:", error);
    return errorResponse("Failed to create project", "INTERNAL_SERVER_ERROR", 500);
  }
}
