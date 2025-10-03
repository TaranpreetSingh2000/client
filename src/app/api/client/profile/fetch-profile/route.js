import { decryptData } from "@/utils/decryption";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { userId } = body;

    // Validate input
    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 },
      );
    }

    const decryptedUserId = decryptData(JSON.parse(userId));

    // Call external service
    const response = await fetch(
      `${process.env.NEXT_STRAPI_API_URL}/api/abcd-user-logins/${decryptedUserId}?populate=*`,
    );

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: "Failed to fetch user data", details: errorData },
        { status: response.status },
      );
    }

    // Parse and return data
    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error.message },
      { status: 500 },
    );
  }
}
