"use client";

import React, { useState } from "react";
import StyledHeading from "../StyledHeading/StyledHeading";
import TextArea from "../TextArea/TextArea";
import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";
import _map from "lodash/map";
import BaseButton from "../Button/BaseButton";
import SubmissionSucess from "../Modals/SubmissionSucess";
import { useSelector } from "react-redux";
import { httpService } from "@/lib/httpService";
import { isEmailValidChecker } from "@/utils/maskingUtils";
import { encryptData } from "@/utils/encryption";
import { decryptData } from "@/utils/decryption";

const NewsLetterSection = ({ newsLetterSectionData }) => {
  const {
    mainHeading,
    description,
    inputField,
    newsletterCta,
    newsletterSuccessMessage,
    newsletterErrorMessage,
    sectionID,
  } = newsLetterSectionData;

  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const bearerToken = useSelector((state) => state.token.accessToken);

  const handleNewsLetterSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsOpen(false);

    if (email.trim() === "") {
      setError("Email is required");
      return;
    }

    if (!isEmailValidChecker(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const payload = {
      data: { email },
    };

    const payloadCV = encryptData(payload);

    try {
      const response = await httpService.post(
        "/api/client/newsletter",
        payloadCV,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );

      if (response?.data && response.status === 200) {
        const decryptedNewsletterResponse = decryptData(
          response?.data?.newsletterDetail,
        );
        const jsonResponse = decryptedNewsletterResponse?.newsletterdata?.data;
        if (jsonResponse?.createSubscriberResponse.success === false) {
          setError(
            newsletterErrorMessage ||
              jsonResponse?.createSubscriberResponse?.message,
          );
        } else {
          setSuccessMessage(
            newsletterSuccessMessage || jsonResponse?.createSubscriberResponse,
          );
          setIsOpen(true);
        }
      }
      setEmail("");
    } catch (error) {
      const { message } = error?.response?.data || {
        message: "Something went wrong, Please refresh your page",
      };
      setIsOpen(false);
      setError(message);
    }
  };

  return (
    <section aria-label="Subscribe to Financial Newsletter">
      <MaxWidthContainer id={sectionID} extraClasses="!pt-2">
        <div className="financial_letter_section flex flex-col lg:flex-row items-center gap-5 justify-around max-w-8xl mx-auto py-10 px-4 md:py-9 md:p-8 md:px-10 lg:px-[100px] rounded-[20px] md:rounded-[36px]">
          <div className="w-full flex flex-col md:justify-center md:items-center lg:justify-start lg:items-start lg:w-1/2">
            {mainHeading && (
              <StyledHeading
                styledHeadingData={mainHeading}
                extraClasses="md:text-section-heading-sm md:leading-10 max-md:text-heading-sm max-md:leading-8 mb-4 md:mb-5 text-center lg:text-left"
              />
            )}
            <TextArea
              textAreaData={description?.description}
              extraClasses="text-xs text-center lg:text-left md:text-sm md:max-w-[419px] w-full text-coregray-200 font-normal leading-4"
            />
          </div>

          <div className="form relative flex flex-col justify-start w-full lg:w-1/2">
            <form
              method="POST"
              className="flex items-center bg-white rounded-full p-[2px]"
              aria-label="Subscribe to Financial Newsletter"
            >
              <input
                id={inputField?.inputFieldType || "email"}
                name={inputField?.inputFieldType || "email"}
                type={inputField?.inputFieldType}
                className="flex-1 pl-2 pr-1 md:pr-2 md:pl-5 text-xs md:text-sm outline-none rounded-l-full"
                placeholder={inputField?.inputFieldPlaceholder}
                aria-describedby="subscribe-desc"
                onChange={(e) => {
                  setEmail(e.target.value.toLowerCase());
                  setError("");
                }}
                value={email}
                required
              />
              <BaseButton
                variant={newsletterCta?.variant}
                action={newsletterCta?.action}
                href={newsletterCta?.url}
                target={newsletterCta?.openInNewTab}
                label={newsletterCta?.title}
                imgSrc={newsletterCta?.icon?.url}
                className="w-fit text-xs md:text-sm font-bold px-4 md:px-8 py-3 md:py-3 transition duration-300"
                onClick={handleNewsLetterSubmit}
              />
            </form>

            {error && (
              <span className="absolute -bottom-5 text-red-600 text-xs ml-4 font-medium">
                {error}
              </span>
            )}
          </div>
        </div>
        {isOpen && (
          <SubmissionSucess
            setIsOpen={setIsOpen}
            successMessage={successMessage}
          />
        )}
      </MaxWidthContainer>
    </section>
  );
};

export default NewsLetterSection;
