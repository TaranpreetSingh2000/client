"use client";
import { useState } from "react";
import TextArea from "../TextArea/TextArea";
const FooterDisclaimer = ({ footerDisclaimerData }) => {
  const { disclaimer } = footerDisclaimerData;
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <section
        id="footer-disclaimer-section"
        className="bg-[#fff4d9] border-t border-gray-200 py-1"
      >
        <div className="max-w-[var(--breakpoint-large)] mx-auto">
          <button
            aria-label="Footer Disclaimer"
            aria-expanded={isOpen}
            aria-controls="footer-disclaimer-description"
            onClick={toggleOpen}
            className="w-full flex justify-between items-center text-[#1C1C1C] transition-all cursor-pointer px-4 py-2"
          >
            <span className="text-coregray-300 max-md:text-xs md:text-sm font-bold">
              {disclaimer?.heading}
            </span>
            <span className="relative w-6 h-6 flex items-center justify-center">
              <span className="absolute w-4 h-[2px] bg-gray-600"></span>
              <span
                className={`absolute h-4 w-[2px] bg-gray-600 transition-transform duration-700 ${
                  isOpen ? "rotate-90" : "rotate-0"
                }`}
              ></span>
            </span>
          </button>
          <section
            id="footer-disclaimer-description"
            role="region"
            aria-hidden={!isOpen}
            className={`overflow-hidden transition-all px-4 duration-1000 ease-in-out ${
              isOpen
                ? "h-fit opacity-100 md:pb-4 md:pt-2 pt-1 pb-3"
                : "h-0 opacity-0"
            }`}
          >
            <div className="md:max-w-5xl text-xs flex flex-col md:gap-2 gap-1 w-full">
              <TextArea
                textAreaData={disclaimer?.description}
                extraClasses="text-gray-700 font-medium leading-normal md:leading-relaxed"
              />
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default FooterDisclaimer;
