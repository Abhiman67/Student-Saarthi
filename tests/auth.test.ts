import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword, createSessionToken, verifySessionToken } from "@/lib/auth";

describe("Authentication & Security Module (Section 6 & 26)", () => {
  it("hashes password with salt and securely compares hashes", async () => {
    const plain = "studentSecretPassword123";
    const hashed = await hashPassword(plain);

    expect(hashed).not.toBe(plain);
    expect(hashed.length).toBeGreaterThan(20);

    const matches = await comparePassword(plain, hashed);
    expect(matches).toBe(true);

    const wrongMatches = await comparePassword("wrongPassword", hashed);
    expect(wrongMatches).toBe(false);
  });

  it("signs and verifies JWT session tokens", async () => {
    const userPayload = {
      userId: "user-test-cuid-123",
      email: "test@student.edu",
      name: "Abhishek",
    };

    const token = await createSessionToken(userPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(userPayload.userId);
    expect(decoded?.email).toBe(userPayload.email);
    expect(decoded?.name).toBe(userPayload.name);
  });

  it("fails verification on tempered tokens", async () => {
    const invalidToken = "eyJh...tampered...token";
    const decoded = await verifySessionToken(invalidToken);
    expect(decoded).toBeNull();
  });
});
