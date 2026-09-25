import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { taskSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const projectId = searchParams.get("projectId");
  const view = searchParams.get("view"); // "today" | "week" | "all"

  try {
    const now = new Date();
    let dateFilter: Record<string, unknown> = {};

    if (view === "today") {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      dateFilter = {
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      };
    } else if (view === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);
      endOfWeek.setHours(23, 59, 59, 999);

      dateFilter = {
        dueDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      };
    }

    const tasks = await db.task.findMany({
      where: {
        userId: user.id,
        ...(status ? { status } : {}),
        ...(projectId ? { projectId } : {}),
        ...dateFilter,
      },
      include: {
        project: {
          select: { id: true, name: true },
        },
        agent: {
          select: { id: true, name: true, icon: true },
        },
      },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    });

    return successResponse({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return errorResponse("Failed to load tasks", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const body = await req.json();
    const result = taskSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message || "Invalid task input", "VALIDATION_ERROR", 400);
    }

    const { title, description, dueDate, priority, status, projectId, agentId } = result.data;

    if (projectId) {
      const proj = await db.project.findUnique({ where: { id: projectId } });
      if (!proj || proj.userId !== user.id) {
        return errorResponse("Associated project not found or access denied", "FORBIDDEN", 403);
      }
    }

    const task = await db.task.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        status,
        projectId: projectId || null,
        agentId: agentId || null,
      },
      include: {
        project: { select: { id: true, name: true } },
        agent: { select: { id: true, name: true } },
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "TASK_CREATED",
      details: `Created task "${task.title}" with priority ${task.priority}`,
    });

    return successResponse({ task }, 201);
  } catch (error) {
    console.error("Error creating task:", error);
    return errorResponse("Failed to create task", "INTERNAL_SERVER_ERROR", 500);
  }
}
