"use client";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { httpService } from "@/lib/httpService";
import { decryptData } from "@/utils/decryption";

const useFetch = () => {
  const [profileData, setProfileData] = useState(null);
  const bearerToken = useSelector((state) => state.token.accessToken);
  const fetchProfile = useCallback(async () => {
    const encryptedUserId = sessionStorage.getItem("aditya_birla_session_id");
    if (!encryptedUserId || !bearerToken) return;

    try {
      const { data } = await httpService.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/profile/fetch-profile`,
        { userId: encryptedUserId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );

      const decryptedData = decryptData(data?.data);
      setProfileData(decryptedData?.length > 0 ? decryptedData[0] : []);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }, [bearerToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profileData, refetch: fetchProfile };
};

export default useFetch;
