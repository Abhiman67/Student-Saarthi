import { NextResponse } from "next/server";
import { getCurrentUser } from "./auth";

export function errorResponse(
  message: string,
  code: string = "BAD_REQUEST",
  status: number = 400
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export function successResponse(data: unknown, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      errorResponse: errorResponse("Unauthorized. Please log in.", "UNAUTHORIZED", 401),
    };
  }
  return { user, errorResponse: null };
}
