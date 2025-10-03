"use client";
import React, { useState } from "react";
import RemoveImage from "../../../public/modules/assets/images/SessionTimeOutImage.png";
import crossIcon from "../../../public/modules/assets/images/crossIcon.png";
import { deleteProfileImageService } from "@/services/authenticationOtp.service";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decryptData } from "@/utils/decryption";

const RemoveImageConfirmationModal = ({
  setRemoveImageConfirmationModal,
  setFile,
  fileInputRef,
  setImageError,
  onProfileUpdate,
  setIsModalOpen,
}) => {
  const bearerToken = useSelector((state) => state.token.accessToken);
  const encryptedUserId = sessionStorage.getItem("aditya_birla_session_id");

  const [removeBtnStatus, setRemoveBtnStatus] = useState(false);

  const handleRemoveProfilePhoto = async () => {
    setRemoveBtnStatus(true);
    try {
      const response = await deleteProfileImageService(
        bearerToken,
        encryptedUserId,
      );

      if (response?.status === 200) {
        setFile(null);
        setImageError("");

        toast.success("Profile photo removed successfully");
        setRemoveBtnStatus(false);
        setIsModalOpen(false);
        onProfileUpdate();
        setRemoveImageConfirmationModal(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      setImageError(error?.response?.data?.error);
      setRemoveBtnStatus(false);
      console.error("Error deleting profile image:", error);
    }
  };

  const handleCloseModal = () => {
    setRemoveImageConfirmationModal(false);
  };
  return (
    <>
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-h-screen z-999 h-screen bg-[#0000008A] w-screen flex flex-col items-center justify-center">
        <div className="bg-white rounded-[32px] shadow-xl w-full max-w-[360px] md:max-w-[665px] px-5 pt-[60px] pb-10 relative text-center">
          {/* Close Button */}
          <button
            className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-black cursor-pointer"
            onClick={handleCloseModal}
          >
            <img src={crossIcon.src} alt="crossImage" />
          </button>

          {/* Icon */}
          <div className="mb-[30px] flex justify-center">
            <img className="w-14" src={RemoveImage.src} alt="RemoveImage" />
          </div>

          {/* Title */}
          <h2 className="text-lg md:text-2xl font-medium text-lightblack-100 mb-4">
            Are you sure you want to remove this photo?{" "}
          </h2>

          {/* Buttons */}
          <div className="flex justify-center items-center gap-4">
            <button
              disabled={removeBtnStatus}
              className={`default-btn cursor-pointer my-6 text-xs md:text-sm text-white px-8 md:px-14 py-3 rounded-full font-semibold hover:bg-[#ad0f22] transition ${removeBtnStatus ? "opacity-50" : ""}`}
              onClick={handleRemoveProfilePhoto}
            >
              {removeBtnStatus ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoveImageConfirmationModal;
