// /app/api/refresh/route.ts
import { encryptData } from "@/utils/encryption";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const cookie = req.headers.get("cookie") || "";
  const refreshToken = cookie
    .split("; ")
    .find((row) => row.startsWith("refreshToken="))
    ?.split("=")[1];

  if (!refreshToken) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 401,
    });
  }
  try {
    jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const sessionId = crypto.randomUUID();
    const payload = {
      sessionId,
    };
    const newAccessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "1m",
    });

    const newEncryptedToken = encryptData(newAccessToken);
    return new Response(JSON.stringify({ sessionId: newEncryptedToken }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 403,
    });
  }
}
