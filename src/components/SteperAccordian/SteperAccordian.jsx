"use client";
import React, { useState, useRef, useEffect } from "react";
import downArrow from "../../../public/down_arrow.svg";
import _map from "lodash/map";
import _get from "lodash/get";
import colorGenerator from "@/utils/colorGenerator";
import { STEPPER_ACCORDION_COLOR_CODES } from "@/constants/constant";
import Link from "next/link";
import ReactDOM from "react-dom";
import crossIcon from "../../../public/modules/cross.png";
import {
  getYouTubeEmbedUrl,
  isYoutubeRegexChecker,
} from "@/utils/maskingUtils";

export default function SteperAccordian({ userModulesPageData }) {
  const [showIframe, setShowIframe] = useState(false);
  const stepperAccordionDataWithoutColors = _get(
    userModulesPageData,
    "keyModulesChapterSection",
    {},
  );

  const stepperAccordionData = colorGenerator(
    stepperAccordionDataWithoutColors,
    STEPPER_ACCORDION_COLOR_CODES,
  );

  const [checkedState, setCheckedState] = useState(
    _map(stepperAccordionData, (module) =>
      _map(module.lessons, (_, i) => (i === 0 ? false : null)),
    ),
  );

  const [openModuleIndex, setOpenModuleIndex] = useState(0);
  const containerRef = useRef(null);
  const [moduleHeights, setModuleHeights] = useState([]);
  const moduleRefs = useRef([]);

  const getTotalProgress = () => {
    let total = 0;
    let completed = 0;
    checkedState.forEach((module, idx) => {
      total += stepperAccordionData[idx]?.lessons?.length;
      completed += module.filter((c) => c === true).length;
    });
    return total ? completed / total : 0;
  };

  const toggleAccordion = (idx) => {
    setOpenModuleIndex((prev) => (prev === idx ? null : idx));
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const newHeights = _map(moduleRefs.current, (ref) =>
        ref ? ref.offsetHeight : 0,
      );
      setModuleHeights(newHeights);
    });

    moduleRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const progressHeight = containerRef.current
    ? containerRef.current.offsetHeight * getTotalProgress()
    : 0;

  return (
    <>
      {stepperAccordionData && (
        <div
          className="relative w-full max-w-[1280px] mx-auto "
          ref={containerRef}
        >
          <div className="absolute left-6 top-0 bottom-0 w-[3px] bg-gray-200 z-0 hidden">
            <div
              className="absolute top-0 w-full bg-red-500 transition-all duration-500"
              style={{ height: `${progressHeight}px` }}
            />
          </div>

          {_map(stepperAccordionData, (module, moduleIdx) => {
            const isOpen = openModuleIndex === moduleIdx;
            return (
              <div
                key={moduleIdx}
                className="relative items-start mb-2.5"
                ref={(el) => (moduleRefs.current[moduleIdx] = el)}
              >
                <div
                  className={`w-full bg-white rounded-[20px] shadow-md border-l-3 overflow-hidden`}
                  style={{ borderLeftColor: module.color }}
                >
                  <button
                    onClick={() => toggleAccordion(moduleIdx)}
                    className="w-full text-left p-7 flex flex-col lg:flex-row justify-between items-start"
                    aria-expanded={isOpen}
                    aria-controls={`module-content-${moduleIdx + 1}`}
                    id={`module-header-${moduleIdx + 1}`}
                  >
                    <div className="flex justify-between w-full lg:w-[unset]">
                      <div className="flex flex-col">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {moduleIdx + 1}. {module.title}
                        </h2>
                      </div>

                      <img
                        src={downArrow.src}
                        className={`ml-3 w-5 h-5 text-[#CA1F34] font-bold transition-transform self-center block lg:hidden duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex">
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500 items-center lg:m-0 mt-3.5">
                        {module?.stats?.map((stat, index) => (
                          <div
                            className="flex items-center bg-gray-100 px-2 py-1 rounded-full"
                            key={index}
                          >
                            <span className="w-4 h-4 flex-shrink-0">
                              <img
                                className="w-full h-full object-cover"
                                src={stat?.icon?.url}
                                alt={stat?.icon?.alternativeText || "clock"}
                              />
                            </span>
                            <span className="ps-1">{stat.title}</span>
                          </div>
                        ))}
                      </div>
                      <img
                        src={downArrow.src}
                        className={`ml-3 w-5 h-5 text-[#CA1F34] font-bold self-center hidden lg:block transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  <div
                    id={`module-content-${moduleIdx + 1}`}
                    role="region"
                    aria-labelledby={`module-header-${moduleIdx + 1}`}
                    aria-hidden={!isOpen}
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "pb-9" : ""} px-7 ${
                      isOpen ? "max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    <ul>
                      {_map(module?.moduleChapterList, (lesson, idx) => {
                        return (
                          <li key={idx}>
                            {isYoutubeRegexChecker(lesson?.url) ? (
                              <div
                                className="flex items-center justify-between p-5 text-sm text-gray-700 border-b-2 border-b-[#0000001A] group hover:bg-[#0000001A] transition-all duration-700 rounded-[10px] cursor-pointer"
                                onClick={() => setShowIframe(true)}
                              >
                                <div className="flex items-center gap-2 group-hover:ml-2.5 transition-all duration-1000">
                                  <span className="w-4 h-4 flex-shrink-0">
                                    <img
                                      className="w-full h-full object-cover"
                                      src={lesson?.icon?.url}
                                      alt={
                                        lesson?.icon?.alternativeText || "clock"
                                      }
                                    />
                                  </span>
                                  <span className="cursor-pointer">
                                    {lesson.title}
                                  </span>
                                  {showIframe &&
                                    ReactDOM.createPortal(
                                      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-h-screen z-999 h-screen bg-[#0000008A] w-screen flex flex-col items-center justify-center">
                                        <div className="hidden md:flex flex-col items-end p-4 rounded-lg">
                                          <button
                                            className="mb-2 cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setShowIframe(false);
                                            }}
                                          >
                                            <img src={crossIcon.src} alt="" />
                                          </button>
                                          <iframe
                                            src={getYouTubeEmbedUrl(
                                              lesson?.url,
                                            )}
                                            width="560"
                                            height="315"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            title="Lesson Video"
                                          />
                                        </div>
                                        <div className="flex flex-col items-end md:hidden p-4 rounded-lg">
                                          <button
                                            className="mb-2 cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setShowIframe(false);
                                            }}
                                          >
                                            <img src={crossIcon.src} alt="" />
                                          </button>

                                          <iframe
                                            src={getYouTubeEmbedUrl(
                                              lesson?.url,
                                            )}
                                            width="350"
                                            height="215"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            title="Lesson Video"
                                          />
                                        </div>
                                      </div>,
                                      document.getElementById("modal-root"),
                                    )}
                                  <span>
                                    <span className="w-4 h-4 flex-shrink-0 transition-all duration-700">
                                      <img
                                        className="w-full h-full object-cover"
                                        src={lesson?.checkIcon?.url}
                                        alt={
                                          lesson?.checkIcon?.alternativeText ||
                                          "chapter"
                                        }
                                      />
                                    </span>
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <Link
                                className="flex items-center justify-between p-5 text-sm text-gray-700 border-b-2 border-b-[#0000001A] group hover:bg-[#0000001A] transition-all duration-700 rounded-[10px]"
                                onClick={(e) => {
                                  if (
                                    lesson?.url == "#" ||
                                    lesson?.url == null
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                                href={lesson?.url ? lesson?.url : "#"}
                                target={`${lesson?.openInNewTab ? "_blank" : "_self"}`}
                                aria-label={lesson?.title}
                              >
                                <div className="flex items-center gap-2 group-hover:ml-2.5 transition-all duration-1000">
                                  <span className="w-4 h-4 flex-shrink-0">
                                    <img
                                      className="w-full h-full object-cover"
                                      src={lesson?.icon?.url}
                                      alt={
                                        lesson?.icon?.alternativeText || "clock"
                                      }
                                    />
                                  </span>
                                  <span>{lesson.title}</span>
                                  <span>
                                    <span className="w-4 h-4 flex-shrink-0 transition-all duration-700">
                                      <img
                                        className="w-full h-full object-cover"
                                        src={lesson?.checkIcon?.url}
                                        alt={
                                          lesson?.checkIcon?.alternativeText ||
                                          "chapter"
                                        }
                                      />
                                    </span>
                                  </span>
                                </div>
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
