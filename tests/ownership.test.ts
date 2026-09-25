import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

describe("Database Ownership & Entity CRUD (Section 20, 21 & 26)", () => {
  let userA: any;
  let userB: any;

  beforeAll(async () => {
    // Create two separate test users
    const pwd = await hashPassword("password123");
    userA = await db.user.create({
      data: {
        email: `test-a-${Date.now()}@example.com`,
        name: "Student A",
        passwordHash: pwd,
      },
    });

    userB = await db.user.create({
      data: {
        email: `test-b-${Date.now()}@example.com`,
        name: "Student B",
        passwordHash: pwd,
      },
    });
  });

  afterAll(async () => {
    if (userA) await db.user.delete({ where: { id: userA.id } }).catch(() => {});
    if (userB) await db.user.delete({ where: { id: userB.id } }).catch(() => {});
  });

  it("creates a project for User A and verifies User B cannot access it", async () => {
    const project = await db.project.create({
      data: {
        userId: userA.id,
        name: "User A Capstone",
        type: "Major Project",
        status: "In Progress",
      },
    });

    expect(project.id).toBeDefined();
    expect(project.userId).toBe(userA.id);

    // Verify User A can fetch it
    const fetchedA = await db.project.findFirst({
      where: { id: project.id, userId: userA.id },
    });
    expect(fetchedA).not.toBeNull();

    // Verify User B CANNOT fetch it when scoped to User B
    const fetchedB = await db.project.findFirst({
      where: { id: project.id, userId: userB.id },
    });
    expect(fetchedB).toBeNull();
  });

  it("handles Task CRUD with project and user association", async () => {
    const task = await db.task.create({
      data: {
        userId: userA.id,
        title: "Test Unit Execution",
        priority: "High",
        status: "Pending",
      },
    });

    expect(task.id).toBeDefined();

    // Update status to Completed
    const updated = await db.task.update({
      where: { id: task.id },
      data: { status: "Completed" },
    });
    expect(updated.status).toBe("Completed");

    // Delete task
    await db.task.delete({ where: { id: task.id } });
    const checkDeleted = await db.task.findUnique({ where: { id: task.id } });
    expect(checkDeleted).toBeNull();
  });

  it("creates approval record and transitions status upon human decision", async () => {
    const approval = await db.approval.create({
      data: {
        userId: userA.id,
        actionType: "CREATE_TASK",
        description: "Propose new revision milestone",
        payload: JSON.stringify({ title: "Spaced Repetition" }),
        status: "Pending",
      },
    });

    expect(approval.status).toBe("Pending");

    const decided = await db.approval.update({
      where: { id: approval.id },
      data: {
        status: "Approved",
        decidedAt: new Date(),
      },
    });

    expect(decided.status).toBe("Approved");
    expect(decided.decidedAt).toBeDefined();
  });
});
