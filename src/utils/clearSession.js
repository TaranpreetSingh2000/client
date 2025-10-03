import { httpService } from "@/lib/httpService";
import { fetchUserLatestSession } from "@/services/authenticationOtp.service";
import { encryptData } from "./encryption";

export const clearUserSession = async (userId, accessToken) => {
  if (!userId || !accessToken) return;

  try {
    if (userId && accessToken) {
      await fetchUserLatestSession(userId, accessToken);
    }

    const payloadIV = encryptData(userId);

    const { data } = await httpService.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/client/profile/session-expire`,
      { payloadIV },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (data && data?.status === 200) {
      sessionStorage.removeItem("aditya_birla_session_id");
    }
  } catch (error) {
    console.error("Failed to clear user session:", error);
  }
};
