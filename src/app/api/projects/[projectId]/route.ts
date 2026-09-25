import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { projectSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { projectId } = params;

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (project.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    return successResponse({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return errorResponse("Failed to fetch project details", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { projectId } = params;

  try {
    const existing = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (existing.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    const body = await req.json();
    const result = projectSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message || "Validation failed", "VALIDATION_ERROR", 400);
    }

    const { name, description, type, status, targetDate, linkedAgentIds } = result.data;

    const updated = await db.project.update({
      where: { id: projectId },
      data: {
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
      action: "PROJECT_UPDATED",
      details: `Updated project "${updated.name}"`,
    });

    return successResponse({ project: updated });
  } catch (error) {
    console.error("Error updating project:", error);
    return errorResponse("Failed to update project", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { projectId } = params;

  try {
    const existing = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (existing.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    await db.project.delete({
      where: { id: projectId },
    });

    await logAuditEvent({
      userId: user.id,
      action: "PROJECT_DELETED",
      details: `Deleted project "${existing.name}"`,
    });

    return successResponse({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return errorResponse("Failed to delete project", "INTERNAL_SERVER_ERROR", 500);
  }
}
