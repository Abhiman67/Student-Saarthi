import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { fileId } = params;

  try {
    const file = await db.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (file.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    return successResponse({ file });
  } catch (error) {
    console.error("Error fetching file:", error);
    return errorResponse("Failed to load file details", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  const { fileId } = params;

  try {
    const file = await db.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return errorResponse("The requested resource was not found.", "RESOURCE_NOT_FOUND", 404);
    }

    if (file.userId !== user.id) {
      return errorResponse("Access denied", "FORBIDDEN", 403);
    }

    await db.file.delete({
      where: { id: fileId },
    });

    await logAuditEvent({
      userId: user.id,
      action: "FILE_DELETED",
      details: `Deleted file "${file.name}"`,
    });

    return successResponse({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return errorResponse("Failed to delete file", "INTERNAL_SERVER_ERROR", 500);
  }
}
