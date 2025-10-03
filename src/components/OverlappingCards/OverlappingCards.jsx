"use client";
import { STEP_TO_UNLOCK_CARD_COLOR_CODES } from "@/constants/constant";
import colorGenerator from "@/utils/colorGenerator";
import { useState } from "react";
import _map from "lodash/map";

const OverlappingCards = ({ overlappingCardsData }) => {
  const [expandedCard, setExpandedCard] = useState(0);
  const [isVisble, setIsVisible] = useState({ id: 0, state: true });

  const handleCardClick = (index) => {
    if (expandedCard !== index) {
      setExpandedCard(index);
    }
    setTimeout(() => {
      setIsVisible({ id: index, state: true });
    }, 300);
  };

  const updatedOverlappingCardsData = colorGenerator(
    overlappingCardsData,
    STEP_TO_UNLOCK_CARD_COLOR_CODES,
  );

  return (
    <div
      className={`flex justify-center items-center bg-gray-100 md:p-0 xl:p-2 `}
    >
      <div className="relative hidden md:flex gap-[20px]">
        {_map(updatedOverlappingCardsData, (card, index) => (
          <div
            key={index}
            className={`card bg-white rounded-[40px] shadow-lg cursor-pointer transition-all duration-1000 ease-in-out overflow-hidden
                ${expandedCard === index ? "md:w-[400px] lg:w-[400px] expanded-card" : "md:w-[143px] lg:w-[163px]"}
                min-h-[400px] flex flex-col justify-between p-9 relative
                ${index !== updatedOverlappingCardsData?.length - 1 ? "-mr-[51px]" : ""}
              `}
            style={{
              zIndex: (updatedOverlappingCardsData?.length - index) * 5,
              borderRight: `4px solid ${card.color}`,
            }}
            onClick={() => handleCardClick(index)}
          >
            <div className="flex h-full w-full relative">
              <div
                className={`flex flex-col justify-between items-start gap-4 w-full h-full overflow-visible transition-all duration-1000
                    ${expandedCard === index ? "ml-4" : ""}
                  `}
              >
                <div
                  className="text-7xl mb-3 font-light tracking-normal text-center "
                  style={{ color: "rgba(139, 21, 27, 0.11)" }}
                >
                  0{index + 1}
                </div>
                <div className="flex relative w-full ">
                  <h2
                    className="text-2xl font-medium leading-[32px] text-black"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    {card?.heading}
                  </h2>
                  {expandedCard === index && (
                    <div
                      className={`text-sm text-coregray-200 absolute left-10 px-4 w-full max-w-6xl text-wrap bottom-0 transition-opacity duration-1000 ease-in-out ${
                        isVisble.id === index && isVisble.state
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      {card?.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:hidden items-center w-full gap-1">
        {_map(updatedOverlappingCardsData, (card, index) => (
          <div
            key={index}
            className="w-full relative   bg-white rounded-[16px] px-3 py-6 border-b-[3px] shadow-sm mb-[-1rem] lg:mb-0"
            style={{
              borderBottom: `3px solid ${card.color} `,
              zIndex: (updatedOverlappingCardsData.length - index) * 10,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="text-5xl font-light"
                style={{ color: "rgba(139, 21, 27, 0.11)" }}
              >
                0{index + 1}
              </div>

              <div className="flex flex-col items-start space-y-2">
                <h2 className="text-xl font-medium text-subheading">
                  {card.heading}
                </h2>
                <p className="text-coregray-200 font-normal text-sm leading-tight">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OverlappingCards;
