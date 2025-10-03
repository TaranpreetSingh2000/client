"use client";
import { httpService } from "@/lib/httpService";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const UserRemover = () => {
  const accessToken = useSelector((state) => state.token.accessToken);

  useEffect(() => {
    const encryptedUserId = sessionStorage.getItem("aditya_birla_session_id");
    if (!encryptedUserId || !accessToken) return;

    const clearSession = async () => {
      const payloadIV = encryptedUserId;
      try {
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
        console.error("Failed to fetch profile:", error);
      }
    };

    clearSession();
  }, [accessToken]);
};

export default UserRemover;
