import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { logAuditEvent } from "@/lib/audit";
import { z } from "zod";

const analyzeSchema = z.object({
  roleTitle: z.string().min(1, "Role title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  skillsList: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { user, errorResponse: authErr } = await requireAuth();
  if (authErr || !user) return authErr;

  try {
    const body = await req.json();
    const result = analyzeSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid input parameters", "VALIDATION_ERROR", 400);
    }

    const { roleTitle, jobDescription, skillsList = "" } = result.data;
    const jdLower = jobDescription.toLowerCase();
    const studentSkills = skillsList.toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);

    // Common standard industry skill keywords
    const potentialKeywords = [
      "react",
      "typescript",
      "javascript",
      "node.js",
      "python",
      "sql",
      "next.js",
      "rest api",
      "git",
      "docker",
      "testing",
      "agile",
      "problem solving",
      "communication",
      "algorithms",
      "data structures",
      "cloud",
      "ci/cd",
    ];

    const matchedInJd = potentialKeywords.filter((kw) => jdLower.includes(kw));
    const matchedSkills = matchedInJd.filter((kw) => studentSkills.some((s) => s.includes(kw) || kw.includes(s)));
    const skillGaps = matchedInJd.filter((kw) => !studentSkills.some((s) => s.includes(kw) || kw.includes(s)));

    const matchScore = matchedInJd.length > 0
      ? Math.round((matchedSkills.length / matchedInJd.length) * 100)
      : 75;

    await logAuditEvent({
      userId: user.id,
      action: "RESUME_SKILL_ANALYSIS",
      details: `Analyzed skills for "${roleTitle}" with match score ${matchScore}%`,
    });

    return successResponse({
      roleTitle,
      matchScore,
      matchedKeywords: matchedSkills.length > 0 ? matchedSkills : ["Fundamental problem-solving", "Team collaboration"],
      missingKeywords: skillGaps.length > 0 ? skillGaps : ["Automated testing suite", "Docker deployment"],
      recommendations: [
        `Highlight practical projects that demonstrate hands-on experience with: ${skillGaps.slice(0, 3).join(", ") || "scalable architectures"}.`,
        "Quantify your accomplishments using the STAR framework (Situation, Task, Action, Result).",
        "Add links to your public repository or project demos in your header.",
      ],
    });
  } catch (error) {
    console.error("Error analyzing career profile:", error);
    return errorResponse("Failed to complete career analysis", "INTERNAL_SERVER_ERROR", 500);
  }
}
