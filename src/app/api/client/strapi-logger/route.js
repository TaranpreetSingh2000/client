async function logToStrapi({
  unique_id,
  api_name,
  http_status,
  http_method,
  identifier,
  request,
  response,
}) {
  try {
    const strapiLog = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/api-logs`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            unique_id,
            api_name,
            http_status,
            http_method,
            identifier,
            request,
            response,
          },
        }),
      },
    );

    if (!strapiLog.ok) {
      console.error("Failed to log to Strapi:", await strapiLog.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error logging to Strapi:", error.message);
    return false;
  }
}

export default logToStrapi;
