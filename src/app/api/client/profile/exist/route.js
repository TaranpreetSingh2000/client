import { fetchLoginUserId } from "@/services/loginUserId.service";
import { decryptData } from "@/utils/decryption";
import { NextResponse } from "next/server";

export async function POST(request) {
  const payload = await request.json();

  try {
    const decryptedData = decryptData(payload);

    const data = await fetchLoginUserId(decryptedData);

    return NextResponse.json(
      {
        response: data,
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
