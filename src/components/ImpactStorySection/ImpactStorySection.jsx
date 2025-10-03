"use client";
import React, { useState } from "react";
import StyledHeading from "../StyledHeading/StyledHeading";
import _map from "lodash/map";
import downArrow from "../../../public/down_arrow.svg";
import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";

const ImpactStorySection = ({ impactStorySectionData }) => {
  const { mainHeading, sectionID, card } = impactStorySectionData;
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-bgcoregray-100">
      <MaxWidthContainer id={sectionID}>
        <StyledHeading
          styledHeadingData={mainHeading}
          extraClasses="md:text-sectionheading max-md:text-heading  mb-5 md:mb-10"
        />

        {/* ✅ Mobile & Tablet View (Accordion UI) */}
        <div className="block lg:hidden">
          {_map(card, (item, index) => (
            <div
              key={index}
              className={`${index == 0 ? "border-t" : ""} border-b border-gray-300`}
            >
              <button
                className="w-full flex justify-between items-center py-4 gap-10 text-left text-lg font-semibold"
                onClick={() => toggleAccordion(index)}
              >
                {item.heading}
                <img
                  src={downArrow.src}
                  className={`transition-transform duration-700 ${
                    openId === index ? "rotate-180" : "rotate-0"
                  } text-red-500`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                  openId === index
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="py-3">
                  {item.image && (
                    <img
                      src={item?.image?.url}
                      alt={item?.image?.alternativeText}
                      className="w-full rounded-lg mb-3"
                    />
                  )}
                  <p className="text-gray-700 text-sm">{item?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Desktop View (Hover Animation) */}
        <div className="hidden lg:block max-w-6xl mx-auto py-4">
          {_map(card, (item, index) => (
            <div
              key={index}
              className="py-10 px-12 border-b border-[#0000001A] flex items-center gap-5 group relative overflow-x-hidden"
            >
              <h3 className="text-3xl max-w-[408px] w-full">{item?.heading}</h3>
              <div className="relative flex">
                {item?.image && (
                  <div className="transition-all duration-1000 ease-in-out opacity-100 translate-x-0 group-hover:opacity-0 group-hover:-translate-x-60">
                    <img
                      className="max-w-[357px] w-full rounded-lg"
                      src={item?.image?.url}
                      alt={item?.image?.alternativeText}
                    />
                  </div>
                )}
              </div>
              <div className="max-w-[400px] text-sm transition-all duration-1000 ease-in-out translate-x-[100%] opacity-0 group-hover:opacity-100  md:group-hover:-translate-x-40 lg:group-hover:-translate-x-60 absolute right-0">
                <p>{item?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </MaxWidthContainer>
    </div>
  );
};

export default ImpactStorySection;
