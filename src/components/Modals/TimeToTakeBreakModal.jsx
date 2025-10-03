"use client";
import React, { useState } from "react";
import TakeBreakImage from "../../../public/modules/assets/images/TakeBreakImage.png";
import crossIcon from "../../../public/modules/assets/images/crossIcon.png";
import { useDispatch, useSelector } from "react-redux";
import { clearUserSession } from "@/utils/clearSession";
import { clearUserTokens } from "@/redux/features/userTokenSlice";
import { decryptData } from "@/utils/decryption";

const TimeToTakeBreakModal = ({ setIsTimeTakeModal }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const accessToken = useSelector((state) => state.token.accessToken);
  let userId;
  const encryptedUserId = sessionStorage.getItem("aditya_birla_session_id");
  if (encryptedUserId) {
    userId = decryptData(JSON.parse(encryptedUserId));
  }

  const dispatch = useDispatch();

  const handleOnLogout = async () => {
    setIsTimeTakeModal(false);
    try {
      await clearUserSession(userId, accessToken);
      dispatch(clearUserTokens());
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const handleOnClose = () => {
    setIsTimeTakeModal(false);
  };

  return (
    <>
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-h-screen z-999 h-screen bg-[#0000008A] w-screen flex flex-col items-center justify-center">
        <div className="bg-white rounded-[32px] shadow-xl w-full max-w-[360px] md:max-w-[665px] px-5 pt-[60px] pb-10 relative text-center">
          {/* Close Button */}
          <button
            onClick={handleOnClose}
            className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-black cursor-pointer"
          >
            <img src={crossIcon.src} alt="crossImage" />
          </button>

          {/* Icon */}
          <div className="mb-[30px] ">
            <img
              className="block mx-auto"
              src={TakeBreakImage.src}
              alt="TakeBreakImage"
            />
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-4xl font-bold text-lightblack-100 mb-4">
            Time To Take A Break?
          </h2>

          {/* Description */}
          <p className="text-gray-500 mb-10">
            Logging out will close your session. Be sure to save any work before
            you go.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleOnLogout}
              disabled={isLoggingOut}
              className={`bg-white border border-[#ca1f34] cursor-pointer my-6 text-xs md:text-sm text-[#ad0f22] px-8 md:px-14 py-3 rounded-full font-semibold transition ${isLoggingOut ? "opacity-50" : ""}`}
            >
              {isLoggingOut ? "Logging out..." : "LOGOUT"}
            </button>
            <button
              onClick={handleOnClose}
              className="default-btn cursor-pointer my-6 text-xs md:text-sm text-white px-8 md:px-14 py-3 rounded-full font-semibold hover:bg-[#ad0f22] transition"
            >
              STAY LOGGED IN
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeToTakeBreakModal;
