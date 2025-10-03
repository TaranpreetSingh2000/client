import colorGenerator from "@/utils/colorGenerator";
import StyledHeading from "../StyledHeading/StyledHeading";
import TextArea from "../TextArea/TextArea";
import FinancialLiteracyProgramCard from "./FinancialLiteracyProgramCard";

import {
  ABOUT_FINANCIAL_LITERACY_COLOR_CODES,
  ABOUT_FINANCIAL_LITERACY_COLOR_CARDS_CODES,
  FINANCIAL_LITERACY_TAGS_POSITIONS,
} from "@/constants/constant";
import _map from "lodash/map";

const FinancialLiteracyProgramSection = ({ financialLiteracySectionData }) => {
  const { tag, financialCards, mainHeading, descriptionText, sectionID } =
    financialLiteracySectionData;
  const updatedAboutFinancialLiteracy = colorGenerator(
    tag,
    ABOUT_FINANCIAL_LITERACY_COLOR_CODES,
  );
  const updatedFinancialCardsData = colorGenerator(
    financialCards,
    ABOUT_FINANCIAL_LITERACY_COLOR_CARDS_CODES,
  );

  return (
    <section
      className="flex flex-col items-center justify-start w-full bg-white scroll-mt-30 md:scroll-mt-15"
      aria-labelledby="financial-literacy-section"
      id={sectionID}
    >
      <div className="green-half relative overflow-hidden max-w-[1000px] lg:mb-34 px-[8%] pb-10 pt-14 sm:px-22 sm:py-20 md:px-40">
        <div className="flex flex-col items-center text-center fade-in-up">
          {mainHeading && (
            <StyledHeading
              styledHeadingData={mainHeading}
              extraClasses="md:text-sectionheading md:leading-15 max-md:text-heading max-md:leading-11 mb-5 md:mb-10 tracking-[-1.2px]"
            />
          )}
          <TextArea
            textAreaData={descriptionText?.description}
            extraClasses="text-sm md:text-lg text-coregray-200 text-center font-normal leading-6 min-h-20 sm:min-h-40"
          />
        </div>
      </div>

      <div className="lg:relative lg:block grid max-md:grid-cols-2 md:grid-cols-3 max-md:6 gap-4 md:gap-10 lg:gap-0 py-8 lg:py-0 w-fit md:w-full px-4 max-w-[680px]">
        {_map(updatedAboutFinancialLiteracy, (item, index) => (
          <div
            key={index}
            className={`lg:absolute min-w-36 max-w-46 overflow-hidden flex items-center justify-start lg:justify-center fade-in-up
        rounded-full text-center ps-6 pe-6 md:ps-5 md:pe-4 py-3
          ${FINANCIAL_LITERACY_TAGS_POSITIONS[index].pos}
          `}
            style={{
              animationDelay: `${index > 0 ? (index + 1) * 200 : 0}ms`,
              opacity: 0,
              background: item?.color,
            }}
          >
            <div className={`flex items-center justify-center rounded-full `}>
              <div className="flex justify-center w-6 h-6 md:w-8 md:h-8 flex-shrink-0">
                <img
                  src={item?.icon?.url}
                  className="object-contain w-full h-full"
                  alt={item?.icon?.alternativeText || "icon"}
                />
              </div>
              <h3 className="font-semibold text-sm md:text-base px-2 text-coregray-300 leading-snug break-words overflow-hidden">
                {item?.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
      <FinancialLiteracyProgramCard
        financialLiteracyCardData={updatedFinancialCardsData}
      />
    </section>
  );
};

export default FinancialLiteracyProgramSection;
