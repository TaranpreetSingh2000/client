import axios from "axios";
import { store } from "@/redux/store/store";
import { setToken } from "@/redux/features/tokenSlice";
import { decryptData } from "@/utils/decryption";

const COMMON_CONFIG = {
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: process.env.NEXT_PUBLIC_API_URL,
};

export const httpService = axios.create({
  ...COMMON_CONFIG,
});

export const nextHttpService = axios.create({
  ...COMMON_CONFIG,
  withCredentials: true,
});

httpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await nextHttpService.post("api/refresh");
        const { sessionId } = response.data;
        const decryptedNewToken = decryptData(sessionId);
        originalRequest.headers["Authorization"] =
          `Bearer ${decryptedNewToken}`;
        httpService.defaults.headers.common["Authorization"] =
          `Bearer ${decryptedNewToken}`;
        store.dispatch(setToken(decryptedNewToken));
        return httpService(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
