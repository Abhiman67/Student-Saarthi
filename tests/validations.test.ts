import { describe, it, expect } from "vitest";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  projectSchema,
  taskSchema,
  applicationSchema,
  approvalDecisionSchema,
} from "@/lib/validations";

describe("Validation Schemas (Section 26)", () => {
  it("validates correct signup input", () => {
    const valid = signupSchema.safeParse({
      name: "Abhishek",
      email: "abhishek@university.edu",
      password: "securePassword123",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects invalid signup input (short password and invalid email)", () => {
    const invalidEmail = signupSchema.safeParse({
      name: "Abhishek",
      email: "not-an-email",
      password: "pass",
    });
    expect(invalidEmail.success).toBe(false);
  });

  it("validates login schema and rejects empty credentials", () => {
    const valid = loginSchema.safeParse({
      email: "student@test.com",
      password: "secretpassword",
    });
    expect(valid.success).toBe(true);

    const empty = loginSchema.safeParse({
      email: "not-an-email",
      password: "",
    });
    expect(empty.success).toBe(false);
  });

  it("validates forgot password schema", () => {
    const valid = forgotPasswordSchema.safeParse({
      email: "test@domain.com",
      newPassword: "newSecurePassword123",
    });
    expect(valid.success).toBe(true);

    const tooShort = forgotPasswordSchema.safeParse({
      email: "test@domain.com",
      newPassword: "123",
    });
    expect(tooShort.success).toBe(false);
  });

  it("validates project creation schema", () => {
    const valid = projectSchema.safeParse({
      name: "Raft Consensus Protocol",
      description: "Distributed systems course project",
      type: "Coursework",
      status: "Planning",
    });
    expect(valid.success).toBe(true);

    const invalid = projectSchema.safeParse({
      name: "",
    });
    expect(invalid.success).toBe(false);
  });

  it("validates task creation and priority constraints", () => {
    const valid = taskSchema.safeParse({
      title: "Write unit tests",
      priority: "High",
      status: "Pending",
    });
    expect(valid.success).toBe(true);

    const emptyTitle = taskSchema.safeParse({
      title: "",
    });
    expect(emptyTitle.success).toBe(false);
  });

  it("validates career application schema", () => {
    const valid = applicationSchema.safeParse({
      company: "Google",
      role: "Software Engineering Intern",
      url: "https://careers.google.com/jobs/123",
      status: "Applied",
    });
    expect(valid.success).toBe(true);

    const missingCompany = applicationSchema.safeParse({
      company: "",
      role: "SDE",
    });
    expect(missingCompany.success).toBe(false);
  });

  it("validates human approval decision schema", () => {
    const approved = approvalDecisionSchema.safeParse({
      approvalId: "app-123",
      decision: "Approved",
    });
    expect(approved.success).toBe(true);

    const denied = approvalDecisionSchema.safeParse({
      approvalId: "app-123",
      decision: "Denied",
    });
    expect(denied.success).toBe(true);

    const invalidDecision = approvalDecisionSchema.safeParse({
      approvalId: "app-123",
      decision: "Maybe",
    });
    expect(invalidDecision.success).toBe(false);
  });
});
