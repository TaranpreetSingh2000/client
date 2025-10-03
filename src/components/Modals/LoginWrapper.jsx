import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import EmailCompanyForm from "./EmailCompanyForm";
import OtpSection from "./OtpSection";
import ProfileModal from "./ProfileModal";
import _get from "lodash/get";
import { useSelector } from "react-redux";
import { httpService } from "@/lib/httpService";
import { decryptData } from "@/utils/decryption";

const LoginModal = ({ setIsModalOpen, isModalOpen }) => {
  const [loginModalData, setLoginModalData] = useState({});
  const [otpModal, setOtpModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [numValue, setNumValue] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [consentCheck, setConsentCheck] = useState(false);
  const [employeeType, setEmployeeType] = useState("ABG Employee");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isEnableOtpByParser, setIsEnableOtpByParser] = useState(true);
  const bearerToken = useSelector((state) => state.token.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      const response = await httpService.get("/api/client/login-module", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      if (response?.data && response?.status === 200) {
        const decryptedLoginModuleData = decryptData(response?.data?.response);
        const loginModulePath = decryptedLoginModuleData?.loginModule;
        setIsEnableOtpByParser(
          loginModulePath?.enableParserOtp === true ? true : false,
        );
        setLoginModalData(loginModulePath);
      }
    };

    if (isModalOpen) {
      fetchData();
    }
  }, [isEnableOtpByParser]);

  const goToOtpModal = () => {
    setOtpModal(true);
    setLoginModal(false);
  };

  const goToLoginModal = () => {
    setOtpModal(false);
    setLoginModal(true);
  };

  const closeAllModals = () => {
    setIsModalOpen(false);
    setOtpModal(false);
    setLoginModal(false);
  };

  if (!isModalOpen) return null;

  const modalContent = (
    <>
      {!otpModal && !loginModal && (
        <EmailCompanyForm
          goToOtpModal={goToOtpModal}
          closeAllModals={closeAllModals}
          loginModalData={loginModalData}
          email={email}
          setEmail={setEmail}
          numValue={numValue}
          setNumValue={setNumValue}
          employeeType={employeeType}
          setEmployeeType={setEmployeeType}
          companyName={companyName}
          setCompanyName={setCompanyName}
          emailError={emailError}
          setEmailError={setEmailError}
          phoneError={phoneError}
          setPhoneError={setPhoneError}
          otpByparser={isEnableOtpByParser}
          consentCheck={consentCheck}
          setConsentCheck={setConsentCheck}
        />
      )}
      {otpModal && (
        <OtpSection
          goToLoginModal={goToLoginModal}
          closeAllModals={closeAllModals}
          loginModalData={loginModalData}
          email={email}
          numValue={numValue}
          employeeType={employeeType}
          setEmailError={setEmailError}
          setPhoneError={setPhoneError}
          otpByparser={isEnableOtpByParser}
        />
      )}
      {loginModal && (
        <ProfileModal
          closeAllModals={closeAllModals}
          loginModalData={loginModalData}
          email={email}
          numValue={numValue}
          employeeType={employeeType}
          companyName={companyName}
          consentCheck={consentCheck}
        />
      )}
    </>
  );
  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root"),
  );
};

export default LoginModal;
