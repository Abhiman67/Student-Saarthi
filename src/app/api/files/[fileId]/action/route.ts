import { NextRequest } from "next/server";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-response";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function POST(
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

    const body = await req.json();
    const action = body.action; // "summary" | "flashcards" | "quiz"

    if (action === "summary") {
      const summaryText =
        file.summary ||
        `Comprehensive Study Summary for ${file.name}:\n\n1. Core Focus: Foundational principles and technical methodology.\n2. Important Notes: Key definitions, architectural patterns, and practical execution steps.\n3. Viva Takeaway: Make sure to review trade-offs and implementation choices highlighted throughout the document.`;

      const updated = await db.file.update({
        where: { id: fileId },
        data: { summary: summaryText },
      });

      await logAuditEvent({
        userId: user.id,
        action: "FILE_STUDY_SUMMARY",
        details: `Generated study summary for "${file.name}"`,
      });

      return successResponse({ action: "summary", summary: updated.summary });
    }

    if (action === "flashcards") {
      const defaultFlashcards = [
        {
          question: `What is the primary objective outlined in "${file.name}"?`,
          answer: "To establish a structured understanding of foundational domain concepts and implementation workflows.",
        },
        {
          question: "How should students balance architectural trade-offs?",
          answer: "By evaluating performance, security, maintainability, and deadlines rather than adopting unneeded complexity.",
        },
        {
          question: "What is the recommended viva defense strategy?",
          answer: "Clearly articulate problem definition, architecture decisions, failure recovery, and future scope.",
        },
      ];

      const updated = await db.file.update({
        where: { id: fileId },
        data: { flashcards: JSON.stringify(defaultFlashcards) },
      });

      await logAuditEvent({
        userId: user.id,
        action: "FILE_STUDY_FLASHCARDS",
        details: `Generated flashcards for "${file.name}"`,
      });

      return successResponse({ action: "flashcards", flashcards: defaultFlashcards });
    }

    if (action === "quiz") {
      const defaultQuiz = [
        {
          question: `In the context of "${file.name}", which factor is most crucial during system design?`,
          options: [
            "Premature optimization without benchmarking",
            "Single responsibility, separation of concerns, and clean interfaces",
            "Ignoring error boundaries and edge cases",
            "Hardcoding credentials in source code",
          ],
          answer: 1,
          explanation: "Separation of concerns ensures maintainable, testable, and robust architecture.",
        },
        {
          question: "How does human-in-the-loop approval protect user workspaces?",
          options: [
            "It slows down everything intentionally",
            "It prevents unauthorized or accidental destructive modifications without explicit consent",
            "It eliminates the need for software testing",
            "It replaces database backups",
          ],
          answer: 1,
          explanation: "Explicit approval ensures that AI suggestions are never executed without human authorization.",
        },
      ];

      const updated = await db.file.update({
        where: { id: fileId },
        data: { quiz: JSON.stringify(defaultQuiz) },
      });

      await logAuditEvent({
        userId: user.id,
        action: "FILE_STUDY_QUIZ",
        details: `Generated interactive quiz for "${file.name}"`,
      });

      return successResponse({ action: "quiz", quiz: defaultQuiz });
    }

    return errorResponse("Invalid action specified", "INVALID_ACTION", 400);
  } catch (error) {
    console.error("Error executing file action:", error);
    return errorResponse("Failed to execute study action", "INTERNAL_SERVER_ERROR", 500);
  }
}
