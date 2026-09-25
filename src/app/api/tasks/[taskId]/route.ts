import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { taskSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { taskId } = params;

  try {
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        agent: true,
      },
    });

    if (!task) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (task.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    return successResponse({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    return errorResponse("Failed to fetch task", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { taskId } = params;

  try {
    const existing = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!existing) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (existing.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    const body = await req.json();
    const result = taskSchema.partial().safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message || "Validation failed", "VALIDATION_ERROR", 400);
    }

    const { title, description, dueDate, priority, status, projectId, agentId } = result.data;

    const updated = await db.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
        ...(priority !== undefined ? { priority } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(projectId !== undefined ? { projectId } : {}),
        ...(agentId !== undefined ? { agentId } : {}),
      },
      include: {
        project: { select: { id: true, name: true } },
        agent: { select: { id: true, name: true } },
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "TASK_UPDATED",
      details: `Updated task "${updated.title}" (Status: ${updated.status})`,
    });

    return successResponse({ task: updated });
  } catch (error) {
    console.error("Error updating task:", error);
    return errorResponse("Failed to update task", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { taskId } = params;

  try {
    const existing = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!existing) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (existing.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    await db.task.delete({
      where: { id: taskId },
    });

    await logAuditEvent({
      userId: user.id,
      action: "TASK_DELETED",
      details: `Deleted task "${existing.title}"`,
    });

    return successResponse({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return errorResponse("Failed to delete task", "INTERNAL_SERVER_ERROR", 500);
  }
}
