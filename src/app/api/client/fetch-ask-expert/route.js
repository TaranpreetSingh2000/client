import { fetchExpertData } from "@/services/expert.service";
import { encryptData } from "@/utils/encryption";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const askexpertdata = await fetchExpertData();

    const encryptedExpertData = encryptData(askexpertdata);
    return NextResponse.json(
      {
        expertDetail: encryptedExpertData,
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
