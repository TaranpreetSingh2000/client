import { NextResponse } from "next/server";
import apiLogger from "../api-logger/route";
import { decryptData } from "@/utils/decryption";

export async function POST(request) {
  const userAgent = request.headers.get("user-agent");
  const requestID = crypto.randomUUID();
  let identifier = "";
  let httpStatus;

  try {
    const body = await request.json();
    const { payloadCV, payloadSource } = body;
    const decryptedUserToken = decryptData(payloadCV);
    const decryptedOTPSourceBody = decryptData(payloadSource);

    const { EmailId, MobileNo, OTP } = decryptedOTPSourceBody;

    identifier = EmailId ? EmailId : MobileNo;
    // Ensure OTP is provided
    if (!OTP) {
      return NextResponse.json({ message: "OTP is required" }, { status: 400 });
    }

    // Set the Authorization header with the userToken
    const otpHeader = {
      "auth-token": decryptedUserToken,
      "Content-Type": "application/json",
    };

    const requestToLog = {
      url: process.env.NEXT_ABCD_VALIDATE_OTP,
      method: "POST",
      headers: otpHeader,
      body: JSON.stringify(decryptedOTPSourceBody),
    };

    // Send the OTP validation request to the external service
    const validateOtpResponse = await fetch(
      process.env.NEXT_ABCD_VALIDATE_OTP,
      {
        method: "POST",
        headers: otpHeader,
        body: JSON.stringify(decryptedOTPSourceBody),
      },
    );

    const otpData = await validateOtpResponse.json();
    httpStatus = validateOtpResponse?.status ?? validateOtpResponse?.status;

    const responseToLog = otpData;

    await apiLogger({
      uniqueId: requestID,
      apiName: process.env.NEXT_ABCD_VALIDATE_OTP,
      httpStatus: httpStatus.toString(),
      httpMethod: "POST",
      channel: userAgent,
      identifier: identifier,
      request: requestToLog,
      response: responseToLog,
    });

    // Check if the response was not successful
    if (!validateOtpResponse.ok) {
      let errorMessage = "Failed to validate OTP";

      return NextResponse.json(
        { message: errorMessage, data: otpData },
        { status: validateOtpResponse.status },
      );
    }

    // If OTP validation is successful, return the result
    return NextResponse.json(
      {
        message: "OTP validated successfully",
        data: otpData,
      },
      { status: 200 },
    );
  } catch (error) {
    // Catch any errors that occur during the process
    console.error("Error during OTP validation:", error);

    // Return a generic error message, or use the specific error message if available
    return NextResponse.json(
      {
        message:
          error?.message || "An unknown error occurred during OTP validation",
      },
      { status: 500 },
    );
  }
}
