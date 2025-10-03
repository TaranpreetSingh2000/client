"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UserIcon from "../../../public/userIcon.png";
import MessageIcon from "../../../public/messageIcon.png";
import PhoneIcon from "../../../public/phoneIcon.png";
import SubmissionSucess from "./SubmissionSucess";
import { httpService } from "@/lib/httpService";
import { isEmailValidChecker, isPhoneValidChecker } from "@/utils/maskingUtils";
import { encryptData } from "@/utils/encryption";
import { decryptData } from "@/utils/decryption";

const OurExpertModal = ({ setIsModalOpen }) => {
  const [data, setData] = useState([]);
  const [expertModal, setExpertModal] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [descriptionMessage, setDescriptionMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    question: "",
    expertName: "",
  });
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [textAreaError, setTextAreaError] = useState("");
  const messagePathRef = useRef(null);

  const selectedExpert = useSelector((state) => state.expert);
  const bearerToken = useSelector((state) => state.token.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpService.get("/api/client/fetch-ask-expert", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        if (response?.data && response?.status === 200) {
          const decryptedExpertResponse = decryptData(
            response?.data?.expertDetail,
          );
          const expertDataPath =
            decryptedExpertResponse?.home?.askExpertSection;
          const experts = expertDataPath?.expertSection || [];
          messagePathRef.current = expertDataPath;

          const matchedExpert = experts.find(
            (item) => item.name === selectedExpert,
          );

          if (matchedExpert) {
            setData(matchedExpert);
            setFormData((prev) => ({
              ...prev,
              expertName: matchedExpert.name,
            }));
          }
        }
      } catch (error) {
        const { message } = error?.response?.data || {
          message: "Something went wrong, Please refresh your page",
        };
        setError(message);
      }
    };

    fetchData();
  }, []);

  const handleInputOnBlur = (e) => {
    if (e.target.name == "name") {
      if (e.target.value.trim()?.length < 2) {
        setNameError(
          "Please enter a valid Full Name (2-30 characters, letters and spaces only)",
        );
      }
    } else if (e.target.name == "email") {
      if (!isEmailValidChecker(e.target.value)) {
        setEmailError("Please enter a valid Email ID");
      }
    } else if (e.target.name == "phone") {
      if (!isPhoneValidChecker(e.target.value)) {
        setPhoneError("Please enter a valid 10-digit mobile number");
      }
    } else if (e.target.name == "question") {
      if (
        e.target.value.trim()?.length < 5 ||
        e.target.value.trim()?.length >= 500
      ) {
        setTextAreaError(
          "Please enter a valid question (5–500 characters, letters and spaces only).",
        );
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const onchangeFieldChecker =
      name === "name"
        ? value.replace(/^\s+/, "").replace(/[^a-zA-Z\s]/g, "")
        : name === "phone"
          ? value.replace(/\D/g, "").slice(0, 10)
          : name === "email"
            ? value.replace(/^\s+/, "").toLowerCase()
            : value.replace(/^\s+/, "");
    setFormData((prev) => ({
      ...prev,
      [name]: onchangeFieldChecker,
    }));

    if (name === "name") {
      // Clear name error if valid
      if (onchangeFieldChecker.trim()?.length >= 2) {
        setNameError("");
      }
    } else if (name === "email") {
      if (isEmailValidChecker(onchangeFieldChecker)) {
        setEmailError("");
      }
    } else if (name === "phone") {
      if (isPhoneValidChecker(onchangeFieldChecker)) {
        setPhoneError("");
      }
    } else if (name === "question") {
      if (
        onchangeFieldChecker.trim()?.length >= 5 &&
        onchangeFieldChecker.trim()?.length <= 500
      ) {
        setTextAreaError("");
      }
    }
  };

  const validateForm = () => {
    if (formData.name.trim()?.length < 2) {
      setNameError(
        "Please enter a valid Full Name (2-30 characters, letters and spaces only)",
      );
      return false;
    }
    if (!isEmailValidChecker(formData.email)) {
      setEmailError("Please enter a valid Email ID");
      return false;
    }
    if (!isPhoneValidChecker(formData.phone)) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (formData.question.trim()?.length < 5) {
      setTextAreaError(
        "Please enter a valid question (5–500 characters, letters and spaces only)",
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsOpen(false);
    let validForm = validateForm();
    if (!validForm) {
      return;
    }

    const payload = { data: formData };

    const payloadIV = encryptData(payload);

    try {
      const response = await httpService.post(
        "/api/client/ask-expert",
        payloadIV,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );

      if (response?.data && response?.status === 200) {
        const decryptedAskExpertResponse = decryptData(
          response?.data?.askExpertDetail,
        );
        const jsonResponse =
          decryptedAskExpertResponse?.askexpertdata?.data
            ?.createAskExpertResponse;
        const message = messagePathRef.current;
        setSuccessMessage(
          message?.askExpertSuccessMessage || jsonResponse?.message,
        );
        setDescriptionMessage(
          message?.asExpertDescriptionMessage ||
            "Your question has been successfully submitted.Our experts are reviewing your query and will get back to you shortly with professional advice tailored to your needs.\n Stay tuned for insightful guidance!",
        );
        setExpertModal(false);
        setIsOpen(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          question: "",
          expertName: "",
        });
      }
    } catch (error) {
      const { message } = error?.response?.data || {
        message: "Something went wrong, Please refresh your page",
      };
      setError(message);
    }
  };
  return (
    <>
      {expertModal && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="z-999 h-screen bg-[#0000008A] w-screen fixed top-0 left-0 flex justify-between items-center py-8 md:py-0"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFF4D9] rounded-2xl flex w-[300px] md:w-full md:max-w-[700px] lg:max-w-[880px] xl:max-w-[1080px] max-h-[588px] justify-evenly flex-col md:flex-row mx-auto my-auto py-0 md:py-16"
          >
            {/* Left Section: Text and Image */}
            <div className="w-[300px] md:max-w-[320px] lg:max-w-[380px] sm:w-full flex flex-row-reverse gap-4 md:gap-13 md:flex-col md:justify-around justify-between items-center px-4 md:px-0 py-[34.5px] md:py-12">
              <div>
                <h2 className="text-xl text-[#000000] leading-[22px] font-medium text-left md:text-center">
                  Ask Our Experts
                </h2>
                <p className="text-[#5D6167] md:text-center text-xs md:text-sm mt-2 max-w-[207px] text-left md:max-w-[301px] w-full">
                  Get professional advice tailored to your needs. Our experts
                  will reach out to you shortly.
                </p>
              </div>
              <div className="flex justify-center overflow-hidden w-[74px] h-[74px] md:w-[280px] md:h-[252px] lg:w-[378px] lg:h-[252px] rounded-2xl">
                <img
                  src={data?.media?.url}
                  alt="Expert"
                  className="object-cover h-full md:w-full md:h-full"
                />
              </div>
            </div>

            {/* Right Section: Form */}
            <div className="w-full md:max-w-[303px] lg:max-w-[403px] bg-white py-[30px] px-4 md:p-6 rounded-b-[20px] md:rounded-[20px] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div className="relative">
                  <label className="flex items-center pl-4 p-1 md:p-2 border border-[#E8E8E8] rounded-lg bg-[#F4F4F4] gap-4">
                    <img src={UserIcon.src} className="w-4" alt="UserIcon" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Full Name"
                      className="w-full outline-none placeholder:text-xs"
                      value={formData.name}
                      maxLength={30}
                      onChange={handleChange}
                      onBlur={handleInputOnBlur}
                    />
                  </label>
                  {nameError && nameError != "" && (
                    <span className="text-red-600 text-[11px] font-medium">
                      {nameError}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <label className="flex items-center pl-4 p-1 md:p-2 border border-[#E8E8E8] rounded-lg bg-[#F4F4F4] gap-4">
                    <img
                      className="w-4"
                      src={MessageIcon.src}
                      alt="MessageIcon"
                    />
                    <input
                      type="text"
                      name="email"
                      placeholder="Email ID"
                      className="w-full outline-none placeholder:text-xs"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleInputOnBlur}
                    />
                  </label>
                  {emailError && emailError != "" && (
                    <span className="text-red-600 text-[11px] font-medium">
                      {emailError}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <label className="flex items-center pl-4 p-1 md:p-2 border border-[#E8E8E8] rounded-lg bg-[#F4F4F4] gap-4">
                    <img className="w-4" src={PhoneIcon.src} alt="PhoneIcon" />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter Phone Number"
                      className="w-full outline-none placeholder:text-xs"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleInputOnBlur}
                    />
                  </label>
                  {phoneError && phoneError != "" && (
                    <span className="text-red-600 text-[11px] font-medium">
                      {phoneError}
                    </span>
                  )}
                </div>
                <div className="mb-5 mt-4">
                  <label className="text-[#111111CC] text-sm">
                    Consult With Our Experts
                  </label>
                  <textarea
                    name="question"
                    placeholder="Type Your Question"
                    className="w-full p-2 mt-1 border border-[#E8E8E8] rounded-lg bg-[#F4F4F4] outline-none h-24 placeholder:text-xs"
                    value={formData.question}
                    onChange={handleChange}
                    onBlur={handleInputOnBlur}
                    maxLength={500}
                  />
                  {textAreaError && textAreaError != "" && (
                    <span className="text-red-600 text-[11px] font-medium">
                      {textAreaError}
                    </span>
                  )}
                </div>

                {error && error != "" && (
                  <div className="errors-span my-2">
                    <span className="text-red-600 text-[11px] font-medium">
                      {error}
                    </span>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full text-xs default-btn cursor-pointer text-[#F7F7F7] font-bold p-3.5 rounded-[70px]"
                >
                  SUBMIT YOUR QUESTION
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <SubmissionSucess
          setIsOpen={setIsOpen}
          successMessage={successMessage}
          setIsModalOpen={setIsModalOpen}
          descriptionMessage={descriptionMessage}
        />
      )}
    </>
  );
};

export default OurExpertModal;
