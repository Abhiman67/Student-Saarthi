import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { logAuditEvent } from "@/lib/audit";
import { z } from "zod";

const coverLetterSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const body = await req.json();
    const result = coverLetterSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid input parameters", "VALIDATION_ERROR", 400);
    }

    const { company, role, notes = "" } = result.data;

    const draft = `Dear Hiring Team at ${company},

I am writing to express my enthusiastic interest in the ${role} opportunity. As a dedicated student with a strong foundation in modern software engineering, computer science fundamentals, and proactive problem-solving, I am excited about the chance to contribute to ${company}'s technical initiatives.

Throughout my coursework and hands-on projects, I have developed a keen interest in building reliable, user-centered software solutions. ${notes ? `Specifically, ${notes}. ` : ""}My experience working collaboratively on engineering milestones has taught me the importance of clean architecture, continuous feedback, and robust testing.

I would welcome the opportunity to discuss how my academic background and engineering enthusiasm align with your goals for the ${role}. Thank you for your time, consideration, and dedication to fostering emerging talent.

Sincerely,
${user.name}
Student Engineer`;

    await logAuditEvent({
      userId: user.id,
      action: "COVER_LETTER_DRAFTED",
      details: `Generated cover letter draft for ${role} at ${company}`,
    });

    return successResponse({
      company,
      role,
      draft,
      disclaimer: "Cover letters are presented as initial drafts requiring your personal review and customization. Vidya Sarthi never auto-submits applications or contacts employers on your behalf.",
    });
  } catch (error) {
    console.error("Error drafting cover letter:", error);
    return errorResponse("Failed to generate cover letter draft", "INTERNAL_SERVER_ERROR", 500);
  }
}
