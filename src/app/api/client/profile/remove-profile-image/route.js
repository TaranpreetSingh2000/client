import { decryptData } from "@/utils/decryption";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const body = await request.json();
    const { documentId } = body;
    const decryptedDocumentId = decryptData(JSON.parse(documentId));

    const bodyData = {
      data: {
        userProfileImage: [],
      },
    };
    const response = await fetch(
      `${process.env.NEXT_STRAPI_API_URL}/api/abcd-user-logins/${decryptedDocumentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      },
    );

    if (response) {
      return NextResponse.json({
        message: "Profile photo removed",
        status: response.status,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
