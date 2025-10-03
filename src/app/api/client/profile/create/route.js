import { decryptData } from "@/utils/decryption";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch(
      `${process.env.NEXT_STRAPI_API_URL}/api/abcd-user-logins`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: body }),
      },
    );

    const data = await response.json();

    const decryptedData = decryptData(data?.data);
    if (decryptedData) {
      const payload = {
        data: {
          sessionId: decryptedData?.documentId,
          user: decryptedData?.name,
          loginTimestamp: decryptedData?.loginTimestamp,
        },
      };

      await fetch(`${process.env.NEXT_STRAPI_API_URL}/api/login-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
