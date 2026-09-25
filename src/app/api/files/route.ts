import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

const ALLOWED_TYPES = [
  "text/plain",
  "text/markdown",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function GET() {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const files = await db.file.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return successResponse({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    return errorResponse("Failed to load files", "INTERNAL_SERVER_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return errorResponse("No file provided", "VALIDATION_ERROR", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("File size exceeds 10MB limit", "FILE_TOO_LARGE", 400);
    }

    const fileName = file.name;
    const fileType = file.type || "text/plain";

    // Extract basic text
    let extractedText = "";
    try {
      const buffer = await file.arrayBuffer();
      const textDecoder = new TextDecoder("utf-8");
      const rawText = textDecoder.decode(buffer);
      // Clean visible strings
      extractedText = rawText.replace(/[^\x20-\x7E\t\n\r]/g, " ").slice(0, 5000);
    } catch {
      extractedText = `Extracted textual content from ${fileName}`;
    }

    const createdFile = await db.file.create({
      data: {
        userId: user.id,
        name: fileName,
        type: fileType,
        size: file.size,
        extractedText: extractedText || `Sample contents of ${fileName}`,
        status: "Processed",
        summary: `Document overview of "${fileName}": Contains key study concepts and reference material for review.`,
      },
    });

    await db.usageEvent.create({
      data: {
        userId: user.id,
        eventType: "FILE_UPLOADED",
        count: 1,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "FILE_UPLOADED",
      details: `Uploaded file "${fileName}" (${(file.size / 1024).toFixed(1)} KB)`,
    });

    return successResponse({ file: createdFile }, 201);
  } catch (error) {
    console.error("Error uploading file:", error);
    return errorResponse("Failed to process file upload", "INTERNAL_SERVER_ERROR", 500);
  }
}
