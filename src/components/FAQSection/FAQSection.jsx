"use client";
import React, { useState } from "react";
import FAQAccordionItem from "./FAQAccordionItem";
import StyledHeading from "../StyledHeading/StyledHeading";
import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";
import _map from "lodash/map";

const FAQSection = ({ faqSectionData }) => {
  const { mainHeading, faqAccordion, sectionID } = faqSectionData;
  const [visibleCount, setVisibleCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <section className="faqsection relative">
      <div className="relative z-10">
        <MaxWidthContainer id={sectionID}>
          {/* Title */}
          {mainHeading && (
            <StyledHeading
              styledHeadingData={mainHeading}
              extraClasses="md:text-sectionheading md:leading-15 max-md:text-heading max-md:leading-11 mb-5 md:mb-10"
            />
          )}

          {/* FAQ Items */}
          <div className="space-y-4 md:px-40">
            {_map(faqAccordion?.slice(0, visibleCount), (faq, index) => (
              <FAQAccordionItem key={index} accordionItem={faq} />
            ))}
          </div>

          {/* Load More Button */}
          {faqAccordion?.length > 0 && visibleCount < faqAccordion?.length && (
            <div className="flex justify-center mt-8 sm:mt-10">
              <button
                aria-label="FAQ"
                className="px-6 md:px-8 py-3 bg-primary-100 cursor-pointer text-white font-semibold rounded-full hover:bg-[#ca1f36f8] transition-all"
                onClick={handleLoadMore}
              >
                LOAD MORE
              </button>
            </div>
          )}
        </MaxWidthContainer>
      </div>
    </section>
  );
};

export default FAQSection;
