import { decryptData } from "@/utils/decryption";
import { encryptData } from "@/utils/encryption";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const body = await request.json();
    const { payloadIV, payloadCV } = body;
    const decryptedPayload = decryptData(payloadIV);
    const decryptedUserId = decryptData(payloadCV);

    const response = await fetch(
      `${process.env.NEXT_STRAPI_API_URL}/api/abcd-user-logins/${decryptedUserId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(decryptedPayload),
      },
    );

    const data = await response.json();
    const encryptedData = encryptData(data);

    return NextResponse.json(encryptedData, { status: response.status });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
