import { db } from "./db";

export async function logAuditEvent(params: {
  userId: string;
  action: string;
  details?: string;
  ipAddress?: string;
}) {
  try {
    return await db.auditEvent.create({
      data: {
        userId: params.userId,
        action: params.action,
        details: params.details || null,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
    return null;
  }
}
