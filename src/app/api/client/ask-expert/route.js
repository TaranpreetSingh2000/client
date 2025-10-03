import { CREATE_ASK_OUR_EXPERT_DATA } from "@/graphql/queries";
import { addaskexpertData } from "@/services/askexpert.service";
import { decryptData } from "@/utils/decryption";
import { encryptData } from "@/utils/encryption";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const decryptedExpertData = decryptData(body);
    const { data } = decryptedExpertData;

    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "All fields are required", status: 400 },
        { status: 400 },
      );
    }

    const askexpertdata = await addaskexpertData(CREATE_ASK_OUR_EXPERT_DATA, {
      data: data,
    });

    const encryptedAskExpertResponse = encryptData(askexpertdata);
    return NextResponse.json(
      {
        askExpertDetail: encryptedAskExpertResponse,
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
