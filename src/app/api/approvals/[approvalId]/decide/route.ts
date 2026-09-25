import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { approvalDecisionSchema } from "@/lib/validations";

export async function POST(
  req: NextRequest,
  { params }: { params: { approvalId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { approvalId } = params;

  try {
    const approval = await db.approval.findUnique({
      where: { id: approvalId },
    });

    if (!approval) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (approval.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    if (approval.status !== "Pending") {
      return errorResponse("This approval action has already been resolved.", "ALREADY_RESOLVED", 400);
    }

    const body = await req.json();
    const result = approvalDecisionSchema.safeParse({ ...body, approvalId });
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message || "Invalid decision", "VALIDATION_ERROR", 400);
    }

    const { decision, decisionNotes } = result.data;
    let createdEntity = null;

    if (decision === "Approved") {
      try {
        const payload = JSON.parse(approval.payload);

        if (approval.actionType === "CREATE_TASK") {
          createdEntity = await db.task.create({
            data: {
              userId: user.id,
              title: payload.title || "New Task",
              description: payload.description || "Created via approved AI proposal",
              priority: payload.priority || "Medium",
              status: "Pending",
              agentId: payload.agentId || null,
            },
          });
        } else if (approval.actionType === "MODIFY_PROJECT") {
          createdEntity = await db.project.create({
            data: {
              userId: user.id,
              name: payload.name || "New Project",
              type: payload.type || "Coursework",
              status: "Planning",
            },
          });
        }
      } catch (err) {
        console.error("Error executing approved payload:", err);
      }
    }

    const updatedApproval = await db.approval.update({
      where: { id: approvalId },
      data: {
        status: decision,
        decisionNotes: decisionNotes || null,
        decidedAt: new Date(),
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: `APPROVAL_${decision.toUpperCase()}`,
      details: `${decision} action "${approval.actionType}": ${approval.description}`,
    });

    return successResponse({
      approval: updatedApproval,
      createdEntity,
      message: `Action successfully ${decision.toLowerCase()}.`,
    });
  } catch (error) {
    console.error("Error processing approval decision:", error);
    return errorResponse("Failed to process approval decision", "INTERNAL_SERVER_ERROR", 500);
  }
}
