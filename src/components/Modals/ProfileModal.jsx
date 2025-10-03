"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "swiper/css";
import "swiper/css/pagination";
import userIcon from "../../../public/user.png";
import calenderIcon from "../../../public/calender.png";
import genderIcon from "../../../public/gender.png";
import _map from "lodash/map";
import { useSelector } from "react-redux";
import { httpService } from "@/lib/httpService";
import LoginCarousel from "../Slider/LoginCarousel";
import _get from "lodash/get";
import { encryptData } from "@/utils/encryption";
import { decryptData } from "@/utils/decryption";
export default function ProfileModal({
  closeAllModals,
  loginModalData,
  email,
  numValue,
  companyName,
  consentCheck,
}) {
  const loginModalCarouselData = _get(
    loginModalData,
    "loginModal.carousel",
    [],
  );

  const [fullName, setFullName] = useState("");
  const [trackResponse, setTrackResponse] = useState(false);
  const dateRef = useRef(null);
  const visibleDateRef = useRef(null);
  const modalRef = useRef(null);
  const router = useRouter();
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [dateError, setDateError] = useState("");
  const [genderError, setGenderError] = useState("");

  const bearerToken = useSelector((state) => state.token.accessToken);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeAllModals();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTrackResponse(true);

    let isValid = true;

    if (!/^[a-zA-Z\s]{2,30}$/.test(fullName.trim())) {
      setNameError(
        "Please enter a valid Full Name (2-30 characters, letters and spaces only)",
      );
      isValid = false;
    }

    if (!dateRef?.current?.value) {
      setDateError("Please enter the DOB");
      isValid = false;
    }

    if (new Date(dateRef?.current?.value) > new Date()) {
      setDateError("Invalid DOB");
      isValid = false;
    }
    if (!gender) {
      setGenderError("Please select the gender");
      isValid = false;
    }

    if (!isValid) {
      setTrackResponse(false);
      return;
    }

    const storeData = async () => {
      const contactField = email ? { email: email } : { mobile: numValue };
      let bodyData;

      // Check if email exists
      if (contactField?.email) {
        bodyData = {
          data: {
            name: fullName,
            gender,
            DOB: dateRef?.current?.value,
            companyName,
            email: contactField?.email.toLowerCase(),
            consent: consentCheck || true,
            user: "ABG",
            isUserSessionActive: true,
            loginTimestamp: Date.now().toString(),
          },
        };
      } else {
        bodyData = {
          data: {
            name: fullName,
            gender,
            DOB: dateRef?.current?.value,
            mobile: contactField?.mobile,
            consent: consentCheck || true,
            user: "NON-ABG",
            isUserSessionActive: true,
            loginTimestamp: Date.now().toString(),
          },
        };
      }
      const encryptedPayload = encryptData(bodyData);
      try {
        const response = await httpService.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client/profile/create`,
          encryptedPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearerToken}`,
            },
          },
        );

        if (response) {
          const decryptedData = decryptData(response?.data?.data);
          if (decryptedData?.documentId) {
            const encryptedUserId = encryptData(decryptedData?.documentId);
            sessionStorage.setItem(
              "aditya_birla_session_id",
              JSON.stringify(encryptedUserId),
            );
            router.push("/modules");
            setTimeout(() => {
              closeAllModals();
            }, 2000);
          }
        }
      } catch (err) {
        console.log(err.message || "Error Submitting Data");
        setTrackResponse(false);
      }
    };

    storeData();
  };
  const handleInputsOnBlur = () => {
    const isValidName = /^[a-zA-Z\s]{2,30}$/.test(fullName.trim());
    if (!isValidName) {
      setNameError(
        "Please enter a valid Full Name (2-30 characters, letters and spaces only)",
      );
      return false;
    }
    return true;
  };

  const handleDateBlur = () => {
    if (!dateRef?.current?.value) {
      setDateError("Please enter the DOB");
    } else if (new Date(dateRef?.current?.value) > new Date()) {
      setDateError("Invalid DOB");
    } else {
      setDateError("");
    }
  };

  const handleGenderBlur = () => {
    if (!gender) {
      setGenderError("Please select your gender.");
    } else {
      setGenderError("");
    }
  };

  return (
    <div className="fixed inset-0 z-999 bg-black/75 bg-opacity-50  flex items-center justify-center">
      <div
        ref={modalRef}
        className="flex rounded-xl lg:max-w-4xl xl:max-w-5xl w-full mx-4 relative items-center justify-center h-auto lg:bg-[#FFF4D9] p-6"
      >
        <div className="p-8 rounded-xl lg:max-w-5xl flex gap-20 items-center flex-col md:flex-row">
          {/* Left Section - Swiper */}
          <div className="lg:flex-1 max-w-sm lg:block hidden">
            {/* <LoginCarousel carousel={carousel} /> */}
            {loginModalCarouselData?.length > 0 ? (
              <LoginCarousel swiperSlides={loginModalCarouselData} />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-[300px] h-[300px] bg-[#fff4d9] animate-pulse rounded-2xl shadow-sm" />
                <div className="h-4 bg-[#fff4d9] rounded w-2/4 shadow-sm"></div>
              </div>
            )}
            <div className="custom-pagination flex justify-center mt-4 gap-2" />
          </div>

          {/* Right Section - Form */}
          <div className="lg:flex-1 p-6 bg-white w-[300px] md:w-[340px] h-[440px] rounded-[20px]">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <h3 className="text-[20px] font-medium mb-4 text-black">
                Complete Your Profile
              </h3>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg text-sm bg-gray-100"
                  value={fullName}
                  onBlur={handleInputsOnBlur}
                  maxLength={30}
                  onChange={(e) => {
                    setFullName(
                      e.target.value
                        .replace(/^\s+/, "")
                        .replace(/[^a-zA-Z\s]/g, ""),
                    );
                    setError("");
                    if (/^[a-zA-Z\s]{2,30}$/.test(e.target.value))
                      setNameError("");
                    setTrackResponse(false);
                  }}
                />
                <span className="absolute left-3 top-3 text-gray-600">
                  <Image
                    src={userIcon}
                    alt="user icon"
                    width={15}
                    height={15}
                    className="mx-auto"
                  />
                </span>
                {nameError && nameError != "" && (
                  <p className="text-primary-100 text-sm mb-2">{nameError}</p>
                )}
              </div>

              <div className="flex gap-2">
                <div
                  className="relative w-1/2"
                  onClick={() => dateRef.current?.showPicker()}
                >
                  <input
                    type="date"
                    ref={dateRef}
                    onBlur={handleDateBlur}
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
                      if (visibleDateRef.current) {
                        visibleDateRef.current.value = e.target.value;
                        setError("");
                        setDateError("");
                        setTrackResponse(false);
                      }
                    }}
                  />
                  <input
                    type="text"
                    ref={visibleDateRef}
                    placeholder="DOB"
                    className="w-full p-3 pl-9 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-pointer"
                    // onFocus={() => dateRef.current?.showPicker()}
                    readOnly
                  />
                  <span className="absolute left-3 top-3 text-gray-600">
                    <Image
                      src={calenderIcon}
                      alt="calender icon"
                      width={20}
                      height={20}
                      className="mx-auto"
                    />
                  </span>
                  {dateError && dateError != "" && (
                    <p className="text-primary-100 text-sm mb-2">{dateError}</p>
                  )}
                </div>
                <div className="relative w-1/2">
                  <select
                    className="w-full p-3 pl-8 h-[46px] border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-pointer webkit-padding"
                    value={gender}
                    onBlur={handleGenderBlur}
                    onChange={(e) => {
                      setGender(e.target.value);
                      setError("");
                      if (e.target.value) setGenderError("");
                      setTrackResponse(false);
                    }}
                  >
                    <option value="" disabled hidden>
                      Gender
                    </option>

                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <span className="absolute left-2 top-3 text-gray-600">
                    <Image
                      src={genderIcon}
                      alt="gender icon"
                      width={20}
                      height={20}
                      className="mx-auto"
                    />
                  </span>
                  {genderError && (
                    <p className="text-primary-100 text-sm mt-1">
                      {genderError}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <p className="text-primary-100 text-sm my-4">{error}</p>
              )}

              <button
                disabled={trackResponse}
                type="submit"
                className={`bg-primary-100 hover:bg-[#a71627] text-white w-full mt-auto p-3 rounded-full font-semibold text-sm transition cursor-pointer ${trackResponse ? "opacity-50" : ""}`}
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
