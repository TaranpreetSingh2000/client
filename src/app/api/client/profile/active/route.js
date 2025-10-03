import { fetchLoginActive } from "@/services/loginUserActive.service";
import { decryptData } from "@/utils/decryption";
import { NextResponse } from "next/server";

export async function POST(request) {
  const payload = await request.json();

  try {
    const decryptedData = decryptData(payload);
    const data = await fetchLoginActive(decryptedData);
    return NextResponse.json(
      {
        response: data,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error?.message || "Failed to fetch the details",
      },
      { status: 500 },
    );
  }
}
