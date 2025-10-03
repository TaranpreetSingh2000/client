"use client";
import React, { useState } from "react";
import UploadImage from "../../../public/modules/assets/images/upload.png";
import crossIcon from "../../../public/modules/assets/images/crossIcon.png";
import {
  updateProfileService,
  uploadProfileImageService,
} from "@/services/authenticationOtp.service";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decryptData } from "@/utils/decryption";
import { encryptData } from "@/utils/encryption";

const UploadImageConfirmationModal = ({
  setUploadImageConfirmationModal,
  setFile,
  file,
  setImageError,
  onProfileUpdate,
  setIsModalOpen,
}) => {
  const bearerToken = useSelector((state) => state.token.accessToken);
  let userId;
  const encryptedUserId = sessionStorage.getItem("aditya_birla_session_id");
  if (encryptedUserId) {
    userId = decryptData(JSON.parse(encryptedUserId));
  }

  const [uploadBtnStatus, setUploadBtnStatus] = useState(false);

  const handleUploadProfilePhoto = async () => {
    setUploadBtnStatus(true);
    setFile(file);

    try {
      if (file && typeof file !== "string") {
        const data = { image: file };
        const fileArrayBuffer = await file.arrayBuffer();
        const fileBase64 = btoa(
          new Uint8Array(fileArrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );

        const payload = {
          filename: file.name,
          type: file.type,
          imageBase64: fileBase64,
        };

        const encrypted = encryptData(payload);
        const imageResponse = await uploadProfileImageService(
          bearerToken,
          encrypted,
        );

        if (imageResponse?.status === 200 || imageResponse?.status === 201) {
          const decryptedPayload = decryptData(imageResponse?.data);
          if (decryptedPayload?.length > 0) {
            const imageData = {
              data: {
                userProfileImage: decryptedPayload[0].id,
              },
            };
            const updatePayload = { imageData, userId };
            await updateProfileService(bearerToken, updatePayload);
            toast.success("Profile photo updated successfully");
            setUploadBtnStatus(false);
            setIsModalOpen(false);
            onProfileUpdate();
            setUploadImageConfirmationModal(false);
          }
        } else if (imageResponse?.status !== 200) {
          setUploadBtnStatus(false);

          let errorMessage = null;

          if (imageResponse?.response?.data) {
            const decryptedImageError = decryptData(
              imageResponse.response.data,
            );
            errorMessage =
              decryptedImageError?.error?.message ||
              imageResponse.response.data?.error;
          }

          setImageError(
            errorMessage || "Something went wrong while uploading the image",
          );
          setFile(null);
        }
      }
    } catch (err) {
      setUploadBtnStatus(false);
      setImageError(
        err.response?.data?.error ||
          "Something went wrong while uploading the image",
      );
      setFile(null);
      console.error("Error uploading profile photo:", err);
    }
    setUploadImageConfirmationModal(false);
  };

  const handleCloseModal = () => {
    if (file) {
      setUploadImageConfirmationModal(false);
      return;
    }
    setFile(null);
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
            <img className="w-14" src={UploadImage.src} alt="UploadImage" />
          </div>

          {/* Title */}
          <h2 className="text-lg md:text-2xl font-medium text-lightblack-100 mb-4">
            Are you sure you want to upload this photo?{" "}
          </h2>

          {/* Buttons */}
          <div className="flex justify-center items-center gap-4">
            <button
              disabled={uploadBtnStatus}
              className={`default-btn cursor-pointer my-6 text-xs md:text-sm text-white px-8 md:px-14 py-3 rounded-full font-semibold hover:bg-[#ad0f22] transition ${uploadBtnStatus ? "opacity-50" : ""}`}
              onClick={handleUploadProfilePhoto}
            >
              {uploadBtnStatus ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadImageConfirmationModal;
