import { verifyToken } from "@/lib/verifyToken";
import { NextResponse } from "next/server";
export async function middleware(request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  const isTokenValid = await verifyToken(token);
  if (!isTokenValid) {
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 },
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
