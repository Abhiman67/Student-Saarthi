import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  institution: z.string().optional(),
  degree: z.string().optional(),
  semester: z.string().optional(),
  goals: z.string().optional(),
  subjects: z.string().optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
  studyHours: z.coerce.number().min(1).max(24).optional(),
  careerTarget: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid profile information", "VALIDATION_ERROR", 400);
    }

    const {
      name,
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

    if (name && name !== user.name) {
      await db.user.update({
        where: { id: user.id },
        data: { name },
      });
    }

    const updatedProfile = await db.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        institution,
        degree,
        semester,
        goals,
        subjects,
        skills,
        interests,
        studyHours: studyHours || 3,
        careerTarget,
      },
      update: {
        institution,
        degree,
        semester,
        goals,
        subjects,
        skills,
        interests,
        studyHours: studyHours || 3,
        careerTarget,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "PROFILE_UPDATED",
      details: "Updated student profile and educational settings",
    });

    return successResponse({
      user: { ...user, name: name || user.name },
      profile: updatedProfile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return errorResponse("Failed to update profile", "INTERNAL_SERVER_ERROR", 500);
  }
}
