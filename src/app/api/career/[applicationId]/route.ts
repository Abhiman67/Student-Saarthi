import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { applicationSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { applicationId } = params;

  try {
    const app = await db.application.findUnique({
      where: { id: applicationId },
    });

    if (!app) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (app.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    return successResponse({ application: app });
  } catch (error) {
    console.error("Error fetching application:", error);
    return errorResponse("Failed to load application", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { applicationId } = params;

  try {
    const existing = await db.application.findUnique({
      where: { id: applicationId },
    });

    if (!existing) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (existing.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    const body = await req.json();
    const result = applicationSchema.partial().safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message || "Validation failed", "VALIDATION_ERROR", 400);
    }

    const updated = await db.application.update({
      where: { id: applicationId },
      data: {
        ...(result.data.company !== undefined ? { company: result.data.company } : {}),
        ...(result.data.role !== undefined ? { role: result.data.role } : {}),
        ...(result.data.url !== undefined ? { url: result.data.url || null } : {}),
        ...(result.data.status !== undefined ? { status: result.data.status } : {}),
        ...(result.data.notes !== undefined ? { notes: result.data.notes || null } : {}),
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "CAREER_APPLICATION_UPDATED",
      details: `Updated application for ${updated.company} (${updated.status})`,
    });

    return successResponse({ application: updated });
  } catch (error) {
    console.error("Error updating application:", error);
    return errorResponse("Failed to update application", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { applicationId } = params;

  try {
    const existing = await db.application.findUnique({
      where: { id: applicationId },
    });

    if (!existing) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (existing.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    await db.application.delete({
      where: { id: applicationId },
    });

    await logAuditEvent({
      userId: user.id,
      action: "CAREER_APPLICATION_DELETED",
      details: `Deleted application for ${existing.company}`,
    });

    return successResponse({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    return errorResponse("Failed to delete application", "INTERNAL_SERVER_ERROR", 500);
  }
}
