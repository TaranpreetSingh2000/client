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
    const { payloadCV, IVtype } = body;
    const decryptedPayloadParams = decryptData(payloadCV);
    const decryptedEmployeeType = decryptData(IVtype);

    identifier = decryptedEmployeeType || "";
    const tokenURL = process.env.NEXT_ABCD_GENERATE_TOKEN;

    const searchParams = new URLSearchParams(decryptedPayloadParams);
    const urlWithParams = `${tokenURL}?${searchParams.toString()}`;

    const requestToLog = {
      urlWithParams: urlWithParams,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${process.env.ABCD_BASIC_TOKEN}`,
      },
    };

    const externalRes = await fetch(urlWithParams, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${process.env.ABCD_BASIC_TOKEN}`,
      },
    });

    const tokenData = await externalRes.json();
    const encryptedTokenData = encryptData(tokenData);
    if (!externalRes.ok) {
      return NextResponse.json(
        { message: "Failed to fetch token" },
        { status: externalRes.status },
      );
    }

    httpStatus = externalRes?.status ?? externalRes?.status;
    const responseToLog = tokenData;

    await apiLogger({
      uniqueId: requestID,
      apiName: tokenURL,
      httpStatus: httpStatus.toString(),
      httpMethod: "POST",
      channel: userAgent,
      identifier: identifier,
      request: requestToLog,
      response: responseToLog,
    });

    return NextResponse.json(
      {
        message: "Token generated successfully",
        token: encryptedTokenData,
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
