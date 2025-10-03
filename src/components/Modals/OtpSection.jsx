"use client";
import { useState, useRef, useEffect } from "react";
import LoginCarousel from "../Slider/LoginCarousel";
import ProfileModal from "./ProfileModal";
import _map from "lodash/map";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatTime, maskEmail, maskPhoneNumber } from "@/utils/maskingUtils";
import {
  fetchUserDataId,
  generateOTPService,
  updateLoginTimestamp,
  validateOTPService,
} from "@/services/authenticationOtp.service";
import _get from "lodash/get";
import { encryptData } from "@/utils/encryption";

const OtpSection = ({
  allowedOtpLength = 6,
  goToLoginModal,
  closeAllModals,
  loginModalData,
  email,
  numValue,
  employeeType,
  setEmailError,
  setPhoneError,
  otpByparser,
}) => {
  const loginModalCarouselData = _get(
    loginModalData,
    "loginModal.carousel",
    [],
  );

  const [counter, setCounter] = useState(60);
  const [resendLink, setResendLink] = useState(false);
  const [error, setError] = useState("");
  const [loginModal, setLoginModal] = useState(false);
  const [trackResponse, setTrackResponse] = useState(true);
  const [inputWatcher, setInputWatcher] = useState(0);

  const modalRef = useRef(null);
  const userToken = useSelector((state) => state.userToken.userToken);
  const bearerToken = useSelector((state) => state.token.accessToken);
  const router = useRouter();

  const focusInput = (inputs, index) => {
    inputs[index].current.focus();
  };

  const otpInputs = Array(allowedOtpLength)
    .fill(null)
    .map(() => useRef(null));

  const handleInputChange = (inputs, index, value) => {
    // Move to the next input on changing value
    setError("");
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    inputs[index].current.value = sanitizedValue;

    if (sanitizedValue && index < inputs?.length - 1) {
      focusInput(inputs, index + 1);
    }
    setInputWatcher((prev) => prev + 1);
  };

  useEffect(() => {
    const allValues = otpInputs.map(
      (input) => input.current?.value.trim() || "",
    );
    const allFilled = allValues.every((val) => val !== "");
    setTrackResponse(!allFilled);
  }, [inputWatcher, otpInputs]);

  const handleKeyDown = (inputs, index, e) => {
    // On pressing the Arrow keys, focus will move on the left and right side
    if (e.key === "ArrowLeft" && index > 0) {
      focusInput(inputs, index - 1);
    } else if (e.key === "ArrowRight" && index < inputs?.length - 1) {
      focusInput(inputs, index + 1);
    }

    // Move to the previous input on Backspace
    if (e.key === "Backspace" && index > 0) {
      e.preventDefault();
      inputs[index].current.value = "";
      focusInput(inputs, index - 1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeAllModals();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeAllModals]);

  useEffect(() => {
    if (counter <= 0) {
      setResendLink(true);
      return;
    }
    const timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    if (otpInputs[0]?.current) {
      otpInputs[0].current.focus();
    }
  }, []);

  const handleSubmit = async () => {
    setTrackResponse(true);
    const allValues = otpInputs.map((input) => input.current?.value.trim());
    if (allValues.some((val) => val === "")) {
      setError("Please fill all OTP fields before submitting.");
      return;
    }

    const validateOTP = async () => {
      try {
        const response = await validateOTPService(
          email,
          numValue,
          allValues,
          userToken,
          bearerToken,
        );

        if (response?.data || response?.status === 200) {
          toast.success(response?.data?.message || "OTP verified successfully");
          setTrackResponse(false);

          const userIdResponseData = await fetchUserDataId(
            email,
            numValue,
            employeeType,
            bearerToken,
            setTrackResponse,
          );

          const userId = userIdResponseData?.documentId;
          if (userId) {
            await updateLoginTimestamp(bearerToken, userId);
            const encryptedUserId = encryptData(userId);
            sessionStorage.setItem(
              "aditya_birla_session_id",
              JSON.stringify(encryptedUserId),
            );
            router.push("/modules");
            setTimeout(() => {
              closeAllModals();
            }, 2000);
          } else {
            goToLoginModal();
          }
        } else {
          setTrackResponse(true);
          setError("Please enter a valid OTP");
        }
      } catch (err) {
        setTrackResponse(true);
        setError(err?.response?.data?.message || "Error in validating the OTP");
        return;
      }
    };

    const byParserLoginHandler = async () => {
      const enteredOTP = allValues.join("");

      if (enteredOTP !== "123456") {
        setTrackResponse(true);
        setError("Please enter a valid OTP");
        otpInputs.forEach((input) => {
          if (input.current) {
            input.current.value = "";
          }
        });
        return;
      }

      const response = await fetchUserDataId(
        email,
        numValue,
        employeeType,
        bearerToken,
        setTrackResponse,
      );

      const userId = response?.documentId;

      if (userId) {
        await updateLoginTimestamp(bearerToken, userId);
        const encryptedUserId = encryptData(userId);
        sessionStorage.setItem(
          "aditya_birla_session_id",
          JSON.stringify(encryptedUserId),
        );
        router.push("/modules");
        setTimeout(() => {
          closeAllModals();
        }, 2000);
      } else {
        goToLoginModal();
      }
    };
    if (otpByparser === false) {
      setError("");
      validateOTP();
    } else {
      setTrackResponse(true);
      byParserLoginHandler();
    }
  };

  const handleResendLink = () => {
    setTrackResponse(false);
    setError(true);
    setPhoneError("");
    setEmailError("");

    if (counter <= 0) {
      const generateOTP = async () => {
        try {
          const response = await generateOTPService(
            email,
            numValue,
            userToken,
            employeeType,
            bearerToken,
          );

          const fetchedResponse = _get(response, "data.data", {});
          const isABGUser = employeeType === "ABG Employee";
          const isSuccess = fetchedResponse?.submitResponses?.length > 0;

          if (isSuccess) {
            const maskedValue = isABGUser
              ? maskEmail(email)
              : maskPhoneNumber(numValue);
            toast.success(`OTP sent successfully to ${maskedValue}`);

            otpInputs.forEach((input) => {
              if (input?.current) {
                input.current.value = "";
              }
            });

            setCounter(60);
            setResendLink(false);
            setTrackResponse(true);
          } else {
            const errorMessage =
              fetchedResponse?.message || "Error generating OTP";
            isABGUser
              ? setEmailError(errorMessage)
              : setPhoneError(errorMessage);
            setTrackResponse(false);
          }
        } catch (err) {
          const errorMessage =
            err?.response?.data?.message || "Error in generating the OTP";
          const isABGUser = employeeType === "ABG Employee";
          isABGUser ? setEmailError(errorMessage) : setPhoneError(errorMessage);
          setTrackResponse(false);
        }
      };

      generateOTP();
    }
  };

  return (
    <div className="fixed inset-0 z-999 bg-black/75 bg-opacity-50 flex items-center justify-center">
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

          <form className="lg:flex-1 flex flex-col p-6 bg-white w-[300px] md:w-[340px] h-[440px] rounded-[20px]">
            <h3 className="text-sm font-medium mb-4 text-black">
              Enter the OTP for verification that has been sent to your{" "}
              {employeeType === "ABG Employee"
                ? maskEmail(email)
                : maskPhoneNumber(numValue)}
            </h3>

            <div className="grid grid-cols-6 place-items-center gap-4 ">
              {" "}
              {_map(otpInputs, (inputRef, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  ref={inputRef}
                  onChange={(e) =>
                    handleInputChange(otpInputs, index, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(otpInputs, index, e)}
                  onClick={() => focusInput(otpInputs, index)}
                  className="w-11 h-11 md:w-12 md:h-12 text-gray-800 text-center font-medium text-sm border-2 border-gray-200 rounded-md bg-zinc-100 px-2 py-1 focus:outline-none mx-2"
                />
              ))}
            </div>

            {otpByparser === false && (
              <div
                className={`${
                  counter > 0 ? "text-primary-100 " : "text-red-200"
                } my-5 text-right`}
              >
                <span
                  className={`text-sm font-semibold ${
                    counter > 0
                      ? "text-red-300 pointer-events-none"
                      : "text-primary-100 cursor-pointer"
                  }`}
                  onClick={handleResendLink}
                >
                  Resend OTP -{" "}
                </span>
                {formatTime(counter)}
              </div>
            )}

            {error && error !== "" && (
              <p className="text-primary-100 text-sm my-4">{error}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={trackResponse}
              className={`bg-primary-100 hover:bg-[#a71627] text-white w-full p-3 mt-auto md:mt-4 rounded-full font-semibold cursor-pointer text-sm transition ${trackResponse ? "opacity-50" : ""}`}
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>

      {loginModal && <ProfileModal />}
    </div>
  );
};

export default OtpSection;
