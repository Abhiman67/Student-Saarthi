import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { applicationSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const applications = await db.application.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return successResponse({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return errorResponse("Failed to load applications", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const body = await req.json();
    const result = applicationSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message || "Validation failed", "VALIDATION_ERROR", 400);
    }

    const { company, role, url, status, notes } = result.data;

    const application = await db.application.create({
      data: {
        userId: user.id,
        company,
        role,
        url: url || null,
        status,
        notes: notes || null,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "CAREER_APPLICATION_ADDED",
      details: `Added application for ${role} at ${company} (Status: ${status})`,
    });

    return successResponse({ application }, 201);
  } catch (error) {
    console.error("Error creating application:", error);
    return errorResponse("Failed to save application", "INTERNAL_SERVER_ERROR", 500);
  }
}
