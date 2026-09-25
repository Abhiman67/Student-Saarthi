import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";
import { successResponse } from "@/lib/api-response";

export async function POST() {
  const response = successResponse({ message: "Logged out successfully" });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
