"use client";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputWithIcon from "@/components/Input/InputWithIcon/InputWithIcon";
import SelectWithIcon from "@/components/Input/SelectWithIcon/SelectWithIcon";
import { icons } from "@/lib/globalIcon";
import { isEmailValidChecker, isPhoneValidChecker } from "@/utils/maskingUtils";
import avatar from "../../../public/modules/avatar.svg";
import {
  deleteProfileImageService,
  updateProfileService,
} from "@/services/authenticationOtp.service";
import UploadImageConfirmationModal from "./UploadImageConfirmationModal";
import RemoveImageConfirmationModal from "./RemoveImageConfirmationModal";
import { decryptData } from "@/utils/decryption";

const UpdateProfile = ({
  isModalOpen,
  setIsModalOpen,
  userProfileDetails,
  onProfileUpdate,
}) => {
  const [error, setError] = useState(false);
  const [buttonVisibility, setButtonVisibilty] = useState(false);
  const dateRef = useRef(null);
  const visibleDateRef = useRef(null);
  const bearerToken = useSelector((state) => state.token.accessToken);
  const [nameError, setNameError] = useState();
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [workLocationError, setWorkLocationError] = useState();
  const [companyNameError, setCompanyNameError] = useState();
  const [uploadImageConfirmationModal, setUploadImageConfirmationModal] =
    useState(false);
  const [removeImageConfirmationModal, setRemoveImageConfirmationModal] =
    useState(false);
  const [uploadImage, setUploadImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  let userId;
  const encryptedUserId = sessionStorage.getItem("aditya_birla_session_id");
  if (encryptedUserId) {
    userId = decryptData(JSON.parse(encryptedUserId));
  }

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    workLocation: "",
    DOB: "",
    gender: "",
    email: "",
    mobile: "",
  });

  const [file, setFile] = useState(
    userProfileDetails?.userProfileImage?.url || null,
  );
  useEffect(() => {
    setButtonVisibilty(false);

    if (userProfileDetails) {
      setFormData({
        name: userProfileDetails.name || "",
        email: userProfileDetails.email || "",
        mobile: userProfileDetails.mobile || "",
        companyName: userProfileDetails.companyName || "",
        workLocation: userProfileDetails.workLocation || "",
        DOB: userProfileDetails.DOB || "",
        gender: userProfileDetails.gender,
      });

      if (userProfileDetails?.userProfileImage?.url) {
        setFile(userProfileDetails?.userProfileImage?.url);
      }
    }
  }, [userProfileDetails]);

  useEffect(() => {
    let objectUrl;
    if (file && typeof file !== "string") {
      objectUrl = URL.createObjectURL(file);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const handleInputChange = (e) => {
    setError("");
    setButtonVisibilty(false);
    const { name, value } = e.target;
    const onchangeFieldChecker =
      name === "name"
        ? value.replace(/^\s+/, "").replace(/[^a-zA-Z\s]/g, "")
        : name === "mobile"
          ? value.replace(/\D/g, "").slice(0, 10)
          : name === "email"
            ? value.replace(/^\s+/, "").toLowerCase()
            : value.replace(/^\s+/, "");
    setFormData((prev) => ({
      ...prev,
      [name]: onchangeFieldChecker,
    }));

    if (name === "name") {
      if (/^[a-zA-Z\s]{2,30}$/.test(onchangeFieldChecker)) {
        setNameError("");
      }
    } else if (name === "email") {
      if (isEmailValidChecker(onchangeFieldChecker)) {
        setEmailError("");
      }
    } else if (name === "mobile") {
      if (isPhoneValidChecker(onchangeFieldChecker)) {
        setMobileError("");
      }
    } else if (name === "companyName") {
      if (/^(?!\s*$)[A-Za-z0-9 ]{2,100}$/.test(onchangeFieldChecker)) {
        setCompanyNameError("");
      }
    } else if (name === "workLocation") {
      if (/^(?!\s*$)[A-Za-z\- ]{2,50}$/.test(onchangeFieldChecker)) {
        setWorkLocationError("");
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    if (name === "name") {
      if (value === "") {
        setNameError("");
        return;
      }
      if (!/^[a-zA-Z\s]{2,30}$/.test(trimmedValue)) {
        setNameError(
          "Please enter a valid Full Name (2-30 characters, letters and spaces only)",
        );
      } else {
        setNameError("");
      }
    } else if (name === "email") {
      if (value === "") {
        setEmailError("");
        return;
      }
      if (!isEmailValidChecker(trimmedValue)) {
        setEmailError("Please enter a valid Email ID");
      } else {
        setEmailError("");
      }
    } else if (name === "mobile") {
      if (value === "") {
        setMobileError("");
        return;
      }
      if (!isPhoneValidChecker(trimmedValue)) {
        setMobileError("Please enter a valid 10-digit mobile number");
      } else {
        setMobileError("");
      }
    } else if (name === "companyName") {
      if (value === "") {
        setCompanyNameError("");
        return;
      }
      if (!/^(?!\s*$)[A-Za-z0-9 ]{2,100}$/.test(trimmedValue)) {
        setCompanyNameError(
          "Please enter a valid Company Name (min 2 characters)",
        );
      } else {
        setCompanyNameError("");
      }
    } else if (name === "workLocation") {
      if (value === "") {
        setWorkLocationError("");
        return;
      }
      if (!/^(?!\s*$)[A-Za-z\- ]{2,50}$/.test(trimmedValue)) {
        setWorkLocationError("Please enter a valid Work Location");
      } else {
        setWorkLocationError("");
      }
    }
  };

  const handleProfileChange = (e) => {
    setUploadImageConfirmationModal(true);
    setUploadImage(e.target.files[0]);
    e.target.value = "";
    setImageError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonVisibilty(true);
    setError(""); // Clear previous error

    // Validate name
    if (!formData.name || !/^[a-zA-Z\s]{2,30}$/.test(formData.name.trim())) {
      setNameError(
        "Please enter a valid Full Name (2-30 characters, letters and spaces only)",
      );
      setButtonVisibilty(false);
      return;
    } else {
      setNameError("");
    }

    // Validate email if not empty
    if (formData.email && !isEmailValidChecker(formData.email)) {
      setEmailError("Please enter a valid Email ID");
      setButtonVisibilty(false);
      return;
    } else {
      setEmailError("");
    }

    // Validate mobile if not empty
    if (formData.mobile && !isPhoneValidChecker(formData.mobile)) {
      setMobileError("Please enter a valid 10-digit mobile number");
      setButtonVisibilty(false);
      return;
    } else {
      setMobileError("");
    }

    if (
      formData.companyName &&
      !/^(?!\s*$)[A-Za-z0-9 ]{2,100}$/.test(formData.companyName.trim())
    ) {
      setCompanyNameError(
        "Please enter a valid Company Name (min 2 characters)",
      );
      setButtonVisibilty(false);
      return;
    } else {
      setCompanyNameError("");
    }

    if (
      formData.workLocation &&
      !/^(?!\s*$)[A-Za-z\- ]{2,50}$/.test(formData.workLocation.trim())
    ) {
      setWorkLocationError("Please enter a valid Work Location");
      setButtonVisibilty(false);
      return;
    } else {
      setWorkLocationError("");
    }

    if (imageError) {
      setButtonVisibilty(false);
      return;
    }

    const payload = { formData, userId };

    try {
      const response = await updateProfileService(bearerToken, payload);
      const decryptedData = decryptData(response?.data);

      if (decryptedData && response.status === 200) {
        toast.success("Profile updated successfully");
        onProfileUpdate();
        setIsModalOpen(false);
        setButtonVisibilty(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Error updating profile");
      setFile(null);
    } finally {
      setTimeout(() => {
        setButtonVisibilty(false);
      }, 3000);
    }
  };

  if (!isModalOpen) return null;

  const isABG = userProfileDetails?.user === "ABG";
  const isNonABG = userProfileDetails?.user === "NON-ABG";

  return (
    <>
      <div className="flex flex-col items-end lg:px-5 xl:px-30">
        <button
          className="text-xs text-red-700 font-bold border border-red-700 cursor-pointer rounded-full px-6 py-2 mb-4"
          onClick={() => {
            setIsModalOpen(false);
            setImageError("");
          }}
        >
          CLOSE
        </button>

        <div className="flex flex-col w-full md:flex-row justify-center gap-5">
          <div className="flex flex-col items-center justify-center lg:gap-20 gap-4 p-6 md:p-2 w-full md:w-1/3 bg-white bg-[url('/modules/round123.png')] bg-no-repeat bg-left-top bg-cover border-2 border-white rounded-[20px]">
            <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full">
              <img
                name="image"
                className="w-full h-full rounded-full object-cover"
                src={
                  file
                    ? typeof file === "string"
                      ? file
                      : URL.createObjectURL(file)
                    : avatar.src
                }
              />
              {/* Desktop */}
              <label className="hidden lg:block default-btn text-white text-xs w-52 font-semibold cursor-pointer rounded-full py-3 lg:absolute left-2 right-0 md:bottom-0 text-center">
                UPDATE PROFILE PHOTO
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleProfileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>
              <button
                className={`hidden lg:block default-btn text-white text-xs w-52 font-semibold cursor-pointer rounded-full py-3 text-center lg:absolute left-2 right-0 -bottom-14 ${!file ? "opacity-70" : ""}`}
                onClick={() => setRemoveImageConfirmationModal(true)}
                disabled={!file}
              >
                REMOVE PROFILE PHOTO
              </button>
            </div>

            {/* Mobile */}
            <label className="lg:hidden default-btn text-white text-xs w-52 font-semibold cursor-pointer rounded-full py-3 text-center">
              UPDATE PROFILE PHOTO
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleProfileChange}
                ref={fileInputRef}
                className="hidden"
              />
            </label>

            <button
              className={`lg:hidden default-btn text-white text-xs w-52 font-semibold cursor-pointer rounded-full py-3 text-center ${!file ? "opacity-70" : ""}`}
              onClick={() => setRemoveImageConfirmationModal(true)}
              disabled={!file}
            >
              REMOVE PROFILE PHOTO
            </button>

            <div className="flex flex-col items-center space-y-2.5">
              {imageError && (
                <span className="text-red-600 text-xs font-medium">
                  {imageError}
                </span>
              )}
              <p className="text-xs text-center font-normal text-gray-500 px-10">
                At least 800x800 px recommended. JPG or PNG image only
              </p>
            </div>
          </div>

          <div className="bg-white w-full md:w-2/3 p-6 rounded-[20px] lg:p-16">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center md:items-start gap-4 pb-2 w-full"
            >
              <div className="w-full">
                <InputWithIcon
                  id="name"
                  placeholder="Enter your full name"
                  name="name"
                  onBlur={handleBlur}
                  value={formData.name}
                  onChange={handleInputChange}
                  iconSrc={icons.userIcon.src}
                />
                {nameError && nameError != "" && (
                  <div className="errors-span my-0.5">
                    <span className="text-red-600 text-xs font-medium">
                      {nameError}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full">
                <InputWithIcon
                  id="companyName"
                  placeholder="Enter your company name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  iconSrc={icons.companyIcon.src}
                />
                {companyNameError && companyNameError != "" && (
                  <div className="errors-span my-0.5">
                    <span className="text-red-600 text-xs font-medium">
                      {companyNameError}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full">
                <InputWithIcon
                  id="workLocation"
                  placeholder="Enter your work location"
                  name="workLocation"
                  onBlur={handleBlur}
                  value={formData.workLocation}
                  onChange={handleInputChange}
                  iconSrc={icons.companyIcon.src}
                />
                {workLocationError && workLocationError != "" && (
                  <div className="errors-span my-0.5">
                    <span className="text-red-600 text-xs font-medium">
                      {workLocationError}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full">
                <InputWithIcon
                  id="mobile"
                  type="text"
                  placeholder="Enter your mobile number"
                  name="mobile"
                  onBlur={handleBlur}
                  value={formData.mobile}
                  onChange={handleInputChange}
                  iconSrc={icons.phoneIcon.src}
                  disabled={isNonABG}
                  verified={formData?.mobile && isNonABG}
                />
                {mobileError && mobileError != "" && (
                  <div className="errors-span my-0.5">
                    <span className="text-red-600 text-xs font-medium">
                      {mobileError}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full">
                <InputWithIcon
                  id="email"
                  type="text"
                  placeholder="Enter your email address"
                  name="email"
                  onBlur={handleBlur}
                  value={formData.email}
                  onChange={handleInputChange}
                  iconSrc={icons.mailIcon.src}
                  disabled={isABG}
                  verified={formData?.email && isABG}
                />
                {emailError && emailError != "" && (
                  <div className="errors-span my-0.5">
                    <span className="text-red-600 text-xs font-medium">
                      {emailError}
                    </span>
                  </div>
                )}
              </div>
              <div
                className="relative w-full"
                onClick={() => dateRef.current?.showPicker()}
              >
                <input
                  type="date"
                  ref={dateRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    zIndex: 2,
                    cursor: "pointer",
                  }}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    setFormData((prev) => ({ ...prev, DOB: selectedDate }));
                    if (visibleDateRef.current) {
                      visibleDateRef.current.value = selectedDate;
                    }
                  }}
                />
                <input
                  type="text"
                  ref={visibleDateRef}
                  name="DOB"
                  value={formData.DOB}
                  placeholder="DOB"
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg text-xs bg-gray-100 text-gray-700 cursor-pointer"
                  readOnly
                />
                <span className="text-gray-600 w-3 h-3 absolute left-4 top-1/2 transform -translate-y-1/2">
                  <img
                    src={icons.calenderIcon.src}
                    alt="calendar icon"
                    className="mx-auto w-full h-full"
                    aria-hidden="true"
                  />
                </span>
              </div>

              <SelectWithIcon
                id="gender"
                name="gender"
                iconSrc={icons.genderIcon.src}
                value={formData.gender}
                onChange={handleInputChange}
                options={["male", "female", "other"]}
              />
              {error && (
                <div className="errors-span my-1">
                  <span className="text-red-600 text-sm font-medium">
                    {error}
                  </span>
                </div>
              )}
              <button
                type="submit"
                disabled={buttonVisibility}
                className={`default-btn mt-1 md:mt-0 text-white text-xs w-52 font-semibold cursor-pointer rounded-full py-3 ${buttonVisibility ? "opacity-50" : ""}`}
              >
                {buttonVisibility ? "UPDATING PROFILE..." : "UPDATE PROFILE"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {uploadImageConfirmationModal && (
        <UploadImageConfirmationModal
          setUploadImageConfirmationModal={setUploadImageConfirmationModal}
          setFile={setFile}
          file={uploadImage}
          setImageError={setImageError}
          setIsModalOpen={setIsModalOpen}
          onProfileUpdate={onProfileUpdate}
        />
      )}

      {removeImageConfirmationModal && (
        <RemoveImageConfirmationModal
          setRemoveImageConfirmationModal={setRemoveImageConfirmationModal}
          setFile={setFile}
          setImageError={setImageError}
          fileInputRef={fileInputRef}
          setIsModalOpen={setIsModalOpen}
          onProfileUpdate={onProfileUpdate}
        />
      )}
    </>
  );
};

export default UpdateProfile;
