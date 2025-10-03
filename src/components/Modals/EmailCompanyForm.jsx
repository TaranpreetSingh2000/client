"use client";
import React, { useEffect, useRef, useState } from "react";
import companyIcon from "../../../public/companyname.png";
import phoneIcon from "../../../public/phone.png";
import _get from "lodash/get";
import mailIcon from "../../../public/mail.png";
import LoginCarousel from "../Slider/LoginCarousel";
import { useDispatch, useSelector } from "react-redux";
import { setUserToken } from "@/redux/features/userTokenSlice";
import _map from "lodash/map";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import {
  companyAuthorizationvalidationChecker,
  isEmailValidChecker,
  isPhoneValidChecker,
  maskEmail,
} from "@/utils/maskingUtils";
import { maskPhoneNumber } from "@/utils/maskingUtils";
import {
  fetchUserDataActive,
  generateOTPService,
  generateUserToken,
} from "@/services/authenticationOtp.service";
import { clearUserSession } from "@/utils/clearSession";
import { encryptData } from "@/utils/encryption";
import { decryptData } from "@/utils/decryption";

const EmailCompanyForm = ({
  goToOtpModal,
  closeAllModals,
  loginModalData,
  email,
  setEmail,
  numValue,
  setNumValue,
  employeeType,
  setEmployeeType,
  setCompanyName,
  emailError,
  setEmailError,
  phoneError,
  setPhoneError,
  otpByparser,
  consentCheck,
  setConsentCheck,
}) => {
  const loginModalCarouselData = _get(
    loginModalData,
    "loginModal.carousel",
    [],
  );
  const domainList = _get(loginModalData, "loginModal.domainList", []);
  const termsConditionSection = _get(
    loginModalData,
    "termsConditionCheckSection",
    {},
  );

  const [company, setCompany] = useState("");
  const [trackResponse, setTrackResponse] = useState(false);
  const [emailFieldError, setEmailFieldError] = useState("");
  const [phoneFieldError, setPhoneFieldError] = useState("");
  const emailRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const bearerToken = useSelector((state) => state.token.accessToken);
  // const userToken = useSelector((state) => state.userToken.userToken);

  const fetchUserToken = async () => {
    try {
      const response = await generateUserToken(employeeType, bearerToken);

      if (response?.data && response?.status === 200) {
        const decryptedUserTokenResponse = decryptData(response?.data?.token);
        dispatch(
          setUserToken({
            userToken: decryptedUserTokenResponse?.access_token,
            isUserAuthenticated: false,
          }),
        );
        return decryptedUserTokenResponse?.access_token;
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emailRef.current && !emailRef.current.contains(e.target)) {
        closeAllModals();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNumChange = (e) => {
    setPhoneError("");
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setNumValue(value);
    if (isPhoneValidChecker(e.target.value)) {
      setPhoneFieldError("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      if (employeeType === "ABG Employee") {
        setEmailError("");
      } else {
        setPhoneError("");
      }
    }
  };

  const handleInputsOnBlur = () => {
    if (employeeType === "ABG Employee") {
      if (!isEmailValidChecker(email)) {
        setEmailFieldError("Enter a valid email ID");
      }
    } else {
      if (!isPhoneValidChecker(numValue)) {
        setPhoneFieldError("Enter a valid number");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPhoneError("");
    setTrackResponse(true);

    let validTokenResponse = false;
    let token;

    if (employeeType === "ABG Employee") {
      if (!isEmailValidChecker(email)) {
        setEmailFieldError("Enter a valid email ID.");
        setTrackResponse(false);
        return;
      }

      const validCompanyResponse = companyAuthorizationvalidationChecker(
        email,
        domainList,
      );

      setCompanyName(validCompanyResponse?.label);
      if (!validCompanyResponse || validCompanyResponse.value !== company) {
        setEmailError("Login Error: Enter correct email ID/Company Name.");
        setTrackResponse(false);
        return;
      }
    } else {
      if (!isPhoneValidChecker(numValue)) {
        setPhoneFieldError("Enter a valid number.");
        setTrackResponse(false);
        return;
      }
    }

    if (employeeType && otpByparser === false) {
      validTokenResponse = true;
      token = await fetchUserToken();
    }

    const response = await fetchUserDataActive(
      email,
      numValue,
      employeeType,
      bearerToken,
    );

    const THIRTY_MINUTES = 30 * 60 * 1000;
    const currentTime = Date.now();
    const loginTimestamp = Number(response?.loginTimestamp);
    const isSessionExpired = currentTime - loginTimestamp > THIRTY_MINUTES;

    if (response?.isUserSessionActive) {
      if (isSessionExpired) {
        // Session expired after 30 minutes
        await clearUserSession(response?.documentId, bearerToken);
      } else {
        // Session is valid
        if (
          employeeType === "ABG Employee" ||
          employeeType === "Non ABG Employee"
        ) {
          const encryptedUserId = encryptData(response?.documentId);
          sessionStorage.setItem(
            "aditya_birla_session_id",
            JSON.stringify(encryptedUserId),
          );
          router.push("/modules");
          setTimeout(() => {
            closeAllModals();
          }, 2000);
          setTrackResponse(true);
          return;
        }
      }
    }

    //Validations
    if (employeeType === "ABG Employee") {
      if (!isEmailValidChecker(email)) {
        setEmailError("Enter a valid email ID.");
        setTrackResponse(false);
        return;
      }

      const validCompanyResponse = companyAuthorizationvalidationChecker(
        email,
        domainList,
      );

      setCompanyName(validCompanyResponse?.label);
      if (!validCompanyResponse || validCompanyResponse.value !== company) {
        setEmailError("Login Error: Enter correct email ID/Company Name.");
        setTrackResponse(false);
        return;
      }
    } else {
      if (!isPhoneValidChecker(numValue)) {
        setPhoneError("Enter a valid number.");
        setTrackResponse(false);
        return;
      }
    }

    //Generate OTP
    const generateOTP = async () => {
      try {
        const response = await generateOTPService(
          email,
          numValue,
          token,
          employeeType,
          bearerToken,
        );

        const fetchedResponse = _get(response, "data.data", {});
        const isABGUser = employeeType === "ABG Employee";
        const isSuccess = fetchedResponse;

        if (isSuccess) {
          const maskedValue = isABGUser
            ? maskEmail(email)
            : maskPhoneNumber(numValue);
          toast.success(`OTP sent successfully to ${maskedValue}`);
          goToOtpModal();
        } else {
          const errorMessage =
            fetchedResponse?.message || "Error in generating the OTP";
          isABGUser ? setEmailError(errorMessage) : setPhoneError(errorMessage);
          setTrackResponse(false);
        }
      } catch (err) {
        const errorMessage =
          "Error generating OTP" || err?.response?.data?.message;
        const isABGUser = employeeType === "ABG Employee";

        isABGUser ? setEmailError(errorMessage) : setPhoneError(errorMessage);
        setTrackResponse(false);
      }
    };

    //OTP Bypasser
    if (otpByparser === false && validTokenResponse === true) {
      generateOTP();
    } else {
      goToOtpModal();
    }
  };

  return (
    <div className="fixed inset-0 z-999 bg-black/75 bg-opacity-50 flex items-center justify-center">
      <div
        ref={emailRef}
        className="flex rounded-xl lg:max-w-4xl xl:max-w-5xl w-full mx-4 relative items-center justify-center h-auto lg:bg-[#FFF4D9] p-6"
      >
        <div className="md:p-8 rounded-xl lg:max-w-5xl flex gap-20 items-center flex-col md:flex-row">
          {/* Left Section - Swiper */}
          <div className="flex-1 max-w-sm lg:block hidden">
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
          <form
            onSubmit={handleSubmit}
            className="flex-1 px-5 py-10 md:px-7.5 md:py-15 bg-white w-[300px] md:w-[340px] h-[440px] rounded-[20px] flex flex-col"
          >
            <h3 className="text-[20px] leading-[22px] font-medium mb-4 text-black">
              Kickstart your Journey to Money Mastery
            </h3>

            {/* Employee Type Toggle */}
            <div className="lg:flex gap-4 mb-4 text-sm font-medium">
              {_map(["ABG Employee", "Non ABG Employee"], (type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer text-sm font-medium"
                  style={{
                    opacity: ``,
                  }}
                >
                  <input
                    type="radio"
                    name="employeeType"
                    value={type}
                    checked={employeeType === type}
                    onChange={(e) => {
                      setEmployeeType(e.target.value);
                      setConsentCheck(false);
                    }}
                    className="accent-primary-100 cursor-pointer w-4 h-4"
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* Dynamic Fields */}
            {employeeType === "ABG Employee" ? (
              <>
                <div className="relative mb-4 group">
                  <span className="absolute left-3 top-3 group-focus-within:hidden w-4 h-4">
                    <img
                      src={mailIcon.src}
                      alt="Mail Icon"
                      className="object-contain h-full w-full"
                    />
                  </span>
                  <input
                    type="text"
                    placeholder="Company Mail ID"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.toLowerCase());
                      setEmailError("");
                      if (isEmailValidChecker(e.target.value)) {
                        setEmailFieldError("");
                      }
                    }}
                    onKeyDown={() => setEmailError("")}
                    onBlur={handleInputsOnBlur}
                    required
                    className="w-full pl-10 bg-zinc-100 p-3 border border-gray-300 rounded-lg text-sm leading-[14px] font-medium focus:outline-none focus:placeholder-transparent group-focus-within:pl-3"
                    style={{
                      color: "rgba(17, 17, 17, 0.5)",
                    }}
                  />
                  {emailFieldError && emailFieldError != "" && (
                    <p className="text-primary-100 text-sm mb-2">
                      {emailFieldError}
                    </p>
                  )}
                </div>

                <div className="relative mb-4">
                  <span className="absolute left-3 top-3 group-focus-within:hidden w-4 h-4">
                    <img
                      src={companyIcon.src}
                      alt="Company Icon"
                      className="object-contain h-full w-full"
                    />
                  </span>

                  <select
                    value={company}
                    required
                    onChange={(e) => {
                      setCompany(e.target.value);
                      setEmailError("");
                    }}
                    className="w-full px-10 p-3 bg-zinc-100 border border-gray-300 rounded-lg text-[12px] leading-[14px] font-medium appearance-none cursor-pointer"
                    style={{
                      color: "rgba(17, 17, 17, 0.5)",
                    }}
                  >
                    <option value="" disabled hidden>
                      Your Company Name
                    </option>

                    {domainList?.length > 0 ? (
                      _map(domainList, (comp) => (
                        <option key={comp.label} value={comp.value}>
                          {comp.label}
                        </option>
                      ))
                    ) : (
                      <option value="">No data found</option>
                    )}
                  </select>

                  <svg
                    className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                <div className="relative mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      id="terms"
                      onChange={(e) => {
                        setConsentCheck(e.target.checked);
                      }}
                      required
                      className="accent-primary-100 cursor-pointer border-2 border-red-500"
                    />
                    <label htmlFor="terms" className="cursor-pointer">
                      {termsConditionSection?.label || "I agree to the"} {""}
                      <a
                        href={termsConditionSection?.termsConditionLink}
                        target={
                          termsConditionSection?.openInNewTab
                            ? "_blank"
                            : "_self"
                        }
                        className="text-primary-100 font-bold underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {termsConditionSection?.termsConditionLabel ||
                          "Terms and Conditions."}
                      </a>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative mb-4 group">
                  <span className="absolute left-3 top-3 group-focus-within:hidden w-4 h-4">
                    <img
                      src={phoneIcon.src}
                      alt="Phone Icon"
                      className="object-contain h-full w-full"
                    />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter Phone Number"
                    value={numValue}
                    onChange={handleNumChange}
                    onBlur={handleInputsOnBlur}
                    onKeyDown={handleKeyDown}
                    required
                    className="w-full p-3 pl-10 text-gray-500 bg-zinc-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:placeholder-transparent group-focus-within:pl-3"
                  />
                  {phoneFieldError && phoneFieldError != "" && (
                    <p className="text-primary-100 text-sm mb-2">
                      {phoneFieldError}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm mb-4">
                  <input
                    type="checkbox"
                    id="terms"
                    onChange={(e) => {
                      setConsentCheck(e.target.checked);
                    }}
                    required
                    className="accent-primary-100 cursor-pointer border-2 border-red-500"
                  />
                  <label htmlFor="terms" className="cursor-pointer">
                    {termsConditionSection?.label || "I agree to the"} {""}
                    <a
                      href={termsConditionSection?.termsConditionLink}
                      target={
                        termsConditionSection?.openInNewTab ? "_blank" : "_self"
                      }
                      className="text-primary-100 font-bold underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {termsConditionSection?.termsConditionLabel ||
                        "Terms and Conditions."}
                    </a>
                  </label>
                </div>
              </>
            )}

            {employeeType === "ABG Employee" && emailError && (
              <p className="text-primary-100 text-sm mb-2">{emailError}</p>
            )}
            {employeeType === "Non ABG Employee" && phoneError && (
              <p className="text-primary-100 text-sm mb-2">{phoneError}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={trackResponse || !consentCheck}
                className={`bg-primary-100 hover:bg-[#a71627] text-white w-full p-3 cursor-pointer rounded-full font-semibold text-sm transition ${trackResponse || !consentCheck ? "opacity-50" : ""}`}
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailCompanyForm;
