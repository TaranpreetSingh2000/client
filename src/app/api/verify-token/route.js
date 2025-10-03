import jwt from "jsonwebtoken";

export async function POST(req) {
  const body = await req.json();
  const { token } = body;
  try {
    jwt.verify(token, process.env.ACCESS_SECRET);
    return Response.json({ valid: true });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return Response.json(
        { valid: false, error: "Something went wrong" },
        { status: 401 },
      );
    }
    return Response.json(
      { valid: false, error: "Something went wrong" },
      { status: 401 },
    );
  }
}
