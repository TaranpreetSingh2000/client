import { NextResponse } from "next/server";
import { addNewsletterData } from "@/services/newsletter.service";
import { CREATE_NEWSLETTER_DATA } from "@/graphql/queries";
import { decryptData } from "@/utils/decryption";
import { encryptData } from "@/utils/encryption";

export async function POST(request) {
  try {
    const body = await request.json();
    const decryptedNewsletterPayload = decryptData(body);
    const { data } = decryptedNewsletterPayload;
    const email = data?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required", status: 400 },
        { status: 400 },
      );
    }

    const newsletterdata = await addNewsletterData(CREATE_NEWSLETTER_DATA, {
      data: { email },
    });

    const encryptedNewsletterResponse = encryptData(newsletterdata);
    return NextResponse.json(
      {
        newsletterDetail: encryptedNewsletterResponse,
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
