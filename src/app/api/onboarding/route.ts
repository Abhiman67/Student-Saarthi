import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { onboardingSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const { user, errorResponse: authError } = await requireAuth();
  if (authError || !user) return authError;

  try {
    const body = await req.json();
    const result = onboardingSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0]?.message || "Validation failed", "VALIDATION_ERROR", 400);
    }

    const {
      institution,
      degree,
      semester,
      goals,
      subjects,
      skills,
      interests,
      studyHours,
      careerTarget,
    } = result.data;

    // Upsert profile
    const profile = await db.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        institution,
        degree,
        semester,
        goals,
        subjects,
        skills: skills || "",
        interests: interests || "",
        studyHours: studyHours || 3,
        careerTarget: careerTarget || "",
      },
      update: {
        institution,
        degree,
        semester,
        goals,
        subjects,
        skills: skills || "",
        interests: interests || "",
        studyHours: studyHours || 3,
        careerTarget: careerTarget || "",
      },
    });

    // Mark user onboarding complete
    await db.user.update({
      where: { id: user.id },
      data: { onboardingCompleted: true },
    });

    await logAuditEvent({
      userId: user.id,
      action: "ONBOARDING_COMPLETED",
      details: `Completed onboarding profile for ${institution} (${degree}, Sem ${semester})`,
    });

    return successResponse({
      profile,
      message: "Onboarding completed successfully!",
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return errorResponse("Failed to save onboarding details.", "INTERNAL_SERVER_ERROR", 500);
  }
}
