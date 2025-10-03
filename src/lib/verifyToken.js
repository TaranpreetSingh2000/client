import axios from "axios";
const verifyToken = async (token) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/verify-token`,
      { token },
    );
    const data = response.data;
    return data.valid;
  } catch (err) {
    console.error(err, "errror");
    return false;
  }
};
export { verifyToken };
