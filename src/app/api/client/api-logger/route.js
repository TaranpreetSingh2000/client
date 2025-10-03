async function apiLogger({
  uniqueId,
  apiName,
  httpStatus,
  httpMethod,
  channel,
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
            uniqueId,
            apiName,
            httpStatus,
            channel,
            httpMethod,
            identifier,
            request,
            response,
          },
        }),
      },
    );

    if (!strapiLog.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

export default apiLogger;
