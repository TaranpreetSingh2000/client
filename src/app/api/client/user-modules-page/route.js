import { fetchUserModulePageData } from "@/services/userModulePage.service";
import { decryptData } from "@/utils/decryption";
import { encryptData } from "@/utils/encryption";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const payload = await request.json();
    const decryptedPayload = decryptData(payload);
    const data = await fetchUserModulePageData(decryptedPayload);

    const encryptedResponse = encryptData(data);
    return NextResponse.json(
      {
        profileTracker: encryptedResponse,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
