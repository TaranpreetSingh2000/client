"use client";
import { useState } from "react";
import downArrow from "../../../public/down_arrow.svg";
import _map from "lodash/map";
import Link from "next/link";
import colorGenerator from "@/utils/colorGenerator";
import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";
import StyledHeading from "../StyledHeading/StyledHeading";
import TextArea from "../TextArea/TextArea";
import { KEY_MODULES_COLOR_CODES } from "@/constants/constant";

// Mobile Component (below 768px)
const MobileView = ({ modules, openModule, toggleModule }) => {
  return (
    <div className="block md:hidden">
      {_map(modules, (module, index) => (
        <div
          key={index}
          className={`border-l-2 bg-white rounded-2xl shadow-md mb-4 px-3 py-5`}
          style={{ borderLeftColor: module.color }}
        >
          <button
            onClick={() => toggleModule(index)}
            className="w-full flex flex-col"
          >
            <div className="flex justify-between items-center mb-3 w-full">
              <div className="flex gap-2">
                <span className="text-[20px] leading-[28px] font-medium text-left">
                  {index + 1}.
                </span>
                <div className="flex flex-col w-full">
                  <span className="text-[20px] leading-[28px] font-medium text-left">
                    {module?.title}
                  </span>
                  <span className="text-[#5D6167] text-[14px] leading-[16px] font-normal text-left">
                    {module?.tag}
                  </span>
                </div>
              </div>

              <img
                src={downArrow.src}
                size={20}
                className={`transition-transform duration-300 ${
                  openModule === index ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2 ">
              {_map(module?.stats, (item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-600 whitespace-nowrap"
                >
                  {item?.icon && (
                    <span className="w-4 h-4 flex-shrink-0">
                      <img
                        src={item?.icon?.url}
                        alt={item?.icon?.alternativeText}
                        className="object-cover w-full h-full"
                      />
                    </span>
                  )}
                  <span>{item?.title}</span>
                </div>
              ))}
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openModule === index ? "max-h-[500px]" : "max-h-0"
            }`}
          >
            {module?.modulesList?.length > 0 && (
              <ul className="bg-white w-full mt-5 ">
                {_map(module?.modulesList, (lesson, i) => (
                  <li
                    key={i}
                    className={`py-3 px-4 ${i < module?.modulesList.length - 1 ? "border-b border-gray-200" : ""} text-gray-700 text-xs text-left`}
                  >
                    <Link
                      onClick={(e) => {
                        if (lesson?.url == "#" || lesson?.url == null) {
                          e.preventDefault();
                        }
                      }}
                      href={lesson?.url ? lesson?.url : "#"}
                      target={lesson?.openInNewTab ? "_blank" : "_self"}
                    >
                      {i + 1}. {lesson?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Desktop Component (768px and above)
const DesktopView = ({ modules, openModule, toggleModule }) => {
  return (
    <div className="hidden md:block md:px-6">
      {_map(modules, (module, index) => (
        <div
          key={index}
          className={`border-l-3 bg-white rounded-[20px] shadow-md mb-2.5 py-5.5 px-10`}
          style={{ borderLeftColor: module.color }}
        >
          <button
            onClick={() => toggleModule(index)}
            className="w-full flex justify-between items-center cursor-pointer"
          >
            <div className="flex gap-2">
              <span className="text-[28px] leading-[32px] font-medium text-left">
                {index + 1}.
              </span>
              <div className="flex flex-col w-full">
                <span className="text-[28px] leading-[32px] font-medium text-left">
                  {module?.title}
                </span>
                <span className="text-[#5D6167] text-base font-normal text-left">
                  {module?.tag}
                </span>
              </div>
            </div>
            <div className="flex gap-2 items-center justify-between max-w-[630px] w-full">
              <div className="flex items-normal gap-2 w-full">
                {_map(module?.stats, (item, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm text-gray-600"
                  >
                    {item?.icon && (
                      <span className="w-4 h-4">
                        <img
                          src={item?.icon?.url}
                          alt={item?.icon?.alternativeText || "icon"}
                          className="object-cover w-full h-full"
                        />
                      </span>
                    )}
                    <span>{item?.title}</span>
                  </span>
                ))}
              </div>
              <img
                src={downArrow.src || "arrow"}
                size={20}
                className={`transition-transform duration-700 ${
                  openModule === index ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-700 ease-in-out ${
              openModule === index ? "max-h-[500px]" : "max-h-0"
            } pe-3`}
          >
            {module?.modulesList?.length > 0 && (
              <ul className="bg-white max-w-[639px] w-full ml-auto pb-10">
                {_map(module?.modulesList, (lesson, i) => (
                  <li
                    key={i}
                    className="py-4 px-6 border-b border-gray-200 text-gray-700 text-sm text-left"
                  >
                    <Link
                      onClick={(e) => {
                        if (lesson?.url == "#" || lesson?.url == null) {
                          e.preventDefault();
                        }
                      }}
                      href={lesson?.url ? lesson?.url : "#"}
                      target={lesson?.openInNewTab ? "_blank" : "_self"}
                    >
                      {i + 1}. {lesson?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Component
const KeyModuleAccordion = ({ keyModuleAccordionData }) => {
  const { modules, sectionID, mainHeading, description } =
    keyModuleAccordionData;
  const [openModule, setOpenModule] = useState(0);
  const toggleModule = (id) => {
    setOpenModule(openModule === id ? null : id);
  };

  const modulesData = colorGenerator(modules, KEY_MODULES_COLOR_CODES);

  return (
    <section
      aria-label="Key Modules"
      className="w-full bg-gradient-to-b from-[#ffffff] to-[#eeeeee]"
    >
      <MaxWidthContainer id={sectionID}>
        {mainHeading && (
          <StyledHeading
            styledHeadingData={mainHeading}
            extraClasses="md:text-sectionheading md:leading-15 max-md:text-heading max-md:leading-11 mb-5 md:mb-10"
          />
        )}
        <div>
          <TextArea
            textAreaData={description}
            extraClasses="md:max-w-[640px] text-center mx-auto"
          />
        </div>
        <div className="lg:mt-[60px] md:mt-9 mt-6">
          <MobileView
            modules={modulesData}
            openModule={openModule}
            toggleModule={toggleModule}
          />
          <DesktopView
            modules={modulesData}
            openModule={openModule}
            toggleModule={toggleModule}
          />
        </div>
      </MaxWidthContainer>
    </section>
  );
};

export default KeyModuleAccordion;
