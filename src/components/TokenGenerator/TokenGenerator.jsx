"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/features/tokenSlice";
import { fetchAuthTokens } from "@/services/fetchAuthTokens.service";
import { decryptData } from "@/utils/decryption";

const TokenGenerator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      try {
        const fetchToken = await fetchAuthTokens();
        const decryptedToken = decryptData(fetchToken?.sessionId);
        dispatch(setToken(decryptedToken));
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };
    getToken();
  }, []);

  return null;
};

export default TokenGenerator;
