export const fetchAuthTokens = async () => {
  try {
    const response = await fetch("/api/auth");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch auth tokens");
  }
};
