"use client";
import React, { useState } from "react";
import crossIcon from "../../../public/modules/assets/images/crossIcon.png";

const ReportIssue = ({ reportIssueData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = (e) => {
    setIsModalOpen(false);
  };
  const openModal = (e) => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        className="w-fit py-2 px-4 rounded-full default-btn transition-all duration-700 fixed -translate-y-0 border-2 shadow-2xl border-white bottom-6 md:bottom-12 left-3 cursor-pointer z-999 text-xs md:text-sm"
        onClick={openModal}
      >
        {(reportIssueData && reportIssueData.title) || "Report an Issue"}
      </button>
      {isModalOpen && (
        <div className="z-999 h-screen bg-[#0000008A] w-screen fixed top-0 left-0 flex justify-between items-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-[300px] md:max-w-[500px] w-full relative text-center shadow-lg mx-auto ">
            <button
              onClick={closeModal}
              aria-label="Close session timeout modal"
              className="absolute top-5 right-5 cursor-pointer"
            >
              <img
                src={crossIcon.src}
                alt="Close"
                className="w-8 h-8"
                loading="lazy"
              />
            </button>

            {/* Icon */}
            <div className="mb-5 md:mb-[30px]">
              {reportIssueData && (
                <img
                  src={reportIssueData?.icon?.url}
                  alt={reportIssueData?.icon?.alternativeText || "report issue"}
                  className="mx-auto w-15 h-15 object-cover"
                  loading="lazy"
                />
              )}
            </div>

            {/* Heading */}
            <h2
              id="session-timeout-title"
              className="text-xl md:text-3xl font-semibold leading-11 mb-2 text-gray-900 uppercase"
            >
              {(reportIssueData && reportIssueData?.heading) ||
                "Report an Issue"}
            </h2>

            {/* Subtext */}

            <div className="flex flex-col items-center justify-center">
              <p
                id="session-timeout-description"
                className="text-gray-500 text-md"
              >
                {(reportIssueData && reportIssueData?.description) ||
                  "For any issues, please Mail to"}
              </p>

              {reportIssueData && (
                <a
                  href={`mailto:${reportIssueData && reportIssueData?.email}`}
                  className="text-gray-900 mb-3 text-xs hover:underline"
                >
                  {reportIssueData?.email}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportIssue;
