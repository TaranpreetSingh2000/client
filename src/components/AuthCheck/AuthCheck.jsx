"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptData } from "@/utils/decryption";

const AuthCheck = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  let userId;

  useEffect(() => {
    const encryptedUserId = sessionStorage.getItem("aditya_birla_session_id");
    if (encryptedUserId) {
      const parsedUserId = JSON.parse(encryptedUserId);
      userId = decryptData(parsedUserId);
    }

    if (!userId) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return isAuthenticated ? <>{children}</> : null;
};

export { AuthCheck };
