import React from "react";
import SessionTimeOutImage from "../../../public/modules/assets/images/SessionTimeOutImage.png";

const SessionTimeoutModal = () => {
  return (
    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-h-screen z-999 h-screen bg-[#0000008A] w-screen flex flex-col items-center justify-center">
      <div className="bg-white rounded-[32px] shadow-xl w-full max-w-[360px] md:max-w-[665px] px-5 pt-[60px] pb-10 relative text-center">
        {/* Close Button */}
        <button className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-black cursor-pointer"></button>

        {/* Icon */}
        <div className="mb-[30px] ">
          <img
            className="block mx-auto"
            src={SessionTimeOutImage.src}
            alt="SessionTimeOutImage"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-4xl font-semibold text-lightblack-100 mb-4 uppercase">
          session timeout
        </h2>

        {/* Description */}
        <p className="text-gray-500 mb-10">
          Your session is about to expire. You will be automatically logged
          out.{" "}
        </p>

        {/* Buttons */}
        {/* <div className="flex justify-center gap-4">
          <button
            onClick={handleOnLogout} // Trigger the logout logic
            disabled={isLoggingOut} // Disable the button during logout
            className={`bg-white border border-[#ca1f34] cursor-pointer my-6 text-xs md:text-sm text-[#ad0f22] px-14 py-3 rounded-full font-semibold transition ${isLoggingOut ? "opacity-50" : ""}`}
          >
            {isLoggingOut ? "Logging out..." : "LOGOUT"}
          </button>
          <button
            onClick={handleOnClose}
            className="default-btn cursor-pointer my-6 text-xs md:text-sm text-white px-14 py-3 rounded-full font-semibold hover:bg-[#ad0f22] transition"
          >
            RENEW SESSION
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SessionTimeoutModal;
