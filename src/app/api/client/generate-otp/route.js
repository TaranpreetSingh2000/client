import { NextResponse } from "next/server";
import apiLogger from "../api-logger/route";
import { decryptData } from "@/utils/decryption";
import { encryptData } from "@/utils/encryption";

export async function POST(request) {
  const userAgent = request.headers.get("user-agent");
  const requestID = crypto.randomUUID();
  let identifier = "";
  let httpStatus;

  try {
    const body = await request.json();
    const { payloadIV, payloadCV } = body;
    const decryptedPayloadBody = decryptData(payloadIV);
    const decryptedPayloadUserToken = decryptData(payloadCV);

    const { EmailId, MobileNo } = decryptedPayloadBody;

    identifier = EmailId ? EmailId : MobileNo;

    const OTPUrl = process.env.NEXT_ABCD_GENERATE_OTP;

    const otpHeader = {
      "auth-token": decryptedPayloadUserToken,
      "Content-Type": "application/json",
    };

    const requestToLog = {
      url: OTPUrl,
      method: "POST",
      headers: otpHeader,
      body: JSON.stringify(decryptedPayloadBody),
    };

    // Fetch the OTP from external service
    const otpResponse = await fetch(OTPUrl, {
      method: "POST",
      headers: otpHeader,
      body: JSON.stringify(decryptedPayloadBody),
    });

    const otpData = await otpResponse.json();
    httpStatus = otpResponse?.status ?? otpResponse?.status;

    const responseToLog = otpData;

    await apiLogger({
      uniqueId: requestID,
      apiName: process.env.NEXT_ABCD_GENERATE_OTP,
      httpStatus: httpStatus.toString(),
      httpMethod: "POST",
      channel: userAgent,
      identifier: identifier,
      request: requestToLog,
      response: responseToLog,
    });

    if (!otpResponse.ok) {
      return NextResponse.json(
        { message: "Failed to generate OTP", data: otpData },
        { status: otpResponse.status },
      );
    }

    return NextResponse.json(
      {
        message: "OTP generated successfully",
        data: otpData,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Unknown error occurred" },
      { status: 500 },
    );
  }
}
