import { fetchUserLoginSessionId } from "@/services/userSessionLogsFilter.service";
import { decryptData } from "@/utils/decryption";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const payloadIV = body;
  const decryptedPayload = decryptData(payloadIV);

  const { payload } = decryptedPayload;
  try {
    const data = await fetchUserLoginSessionId(payload);

    if (data?.loginLogs?.length > 0) {
      const sortedLogs = data.loginLogs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      const latestLogin = sortedLogs[0];
      const documentId = latestLogin.documentId;

      const response = await fetch(
        `${process.env.NEXT_STRAPI_API_URL}/api/login-logs/${documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              logoutTimestamp: Date.now().toString(),
            },
          }),
        },
      );

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Failed to update user logs session:", errorDetails);
        return NextResponse.json(
          {
            message: "Failed to update user session.",
            error: errorDetails,
          },
          { status: response.status },
        );
      }
    }

    return NextResponse.json(
      {
        message: "Session has expired, please log in again.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        message: "Internal server error while processing the request.",
        error: error?.message || error,
      },
      { status: 500 },
    );
  }
}
