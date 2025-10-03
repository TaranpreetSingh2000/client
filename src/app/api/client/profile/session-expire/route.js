import { decryptData } from "@/utils/decryption";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const body = await request.json();
    const { payloadIV } = body;

    const decryptedUserId = decryptData(payloadIV);
    if (!decryptedUserId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 },
      );
    }

    const payload = {
      data: {
        isUserSessionActive: false,
      },
    };

    const response = await fetch(
      `${process.env.NEXT_STRAPI_API_URL}/api/abcd-user-logins/${decryptedUserId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: "Failed to logout the user", details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    if (data) {
      const payload = {
        data: {
          logoutTimestamp: Date.now().toString(),
        },
      };

      await fetch(
        `${process.env.NEXT_STRAPI_API_URL}/api/login-logs/${decryptedUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
    }
    return NextResponse.json({
      message: "Session has expired, please log in again.",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error.message },
      { status: 500 },
    );
  }
}
