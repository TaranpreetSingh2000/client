import { fetchLoginModalData } from "@/services/loginmodalview.service";
import { encryptData } from "@/utils/encryption";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await fetchLoginModalData();

    const encryptedData = encryptData(data);
    return NextResponse.json(
      {
        response: encryptedData,
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
