import { decryptData } from "@/utils/decryption";
import { encryptData } from "@/utils/encryption";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const decryptedPayload = decryptData(body);
    const { filename, type, imageBase64 } = decryptedPayload;

    const allowedTypes = ["image/png", "image/jpeg"];

    if (!imageBase64 || !filename || !type) {
      const encryptedErrorData = encryptData({
        error: { message: "Missing image data" },
      });

      return NextResponse.json(encryptedErrorData, { status: 400 });
    }

    const buffer = Buffer.from(imageBase64, "base64");
    if (buffer?.length > 2 * 1024 * 1024) {
      const encryptedErrorData = encryptData({
        error: { message: "File size should be less than 2MB" },
      });
      return NextResponse.json(encryptedErrorData, { status: 500 });
    }

    if (!allowedTypes.includes(type)) {
      const encryptedErrorData = encryptData({
        error: { message: "Only JPEG and PNG formats are allowed" },
      });

      return NextResponse.json(encryptedErrorData, { status: 500 });
    }

    const file = new File([buffer], filename, { type });
    const formPayload = new FormData();
    formPayload.append("files", file);

    const response = await fetch(
      `${process.env.NEXT_STRAPI_API_URL}/api/upload`,
      {
        method: "POST",
        body: formPayload,
      },
    );

    if (response) {
      const data = await response.json();
      const encryptedData = encryptData(data);
      return NextResponse.json(encryptedData, { status: response.status });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
