"use client";
import { useEffect, useState } from "react";
import _map from "lodash/map";
import { useDispatch } from "react-redux";
import { setExpert } from "@/redux/features/expertSlice";

const ExpertDetail = ({ expertSectionData }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (expertSectionData?.[0]?.name) {
      dispatch(setExpert(expertSectionData[0].name));
    }
  }, [dispatch, expertSectionData]);

  const [order, setOrder] = useState(
    Array.from({ length: expertSectionData?.length }, (_, index) => index),
  );

  const handleClick = (index) => {
    dispatch(setExpert(expertSectionData[index].name));
    if (order.indexOf(index) === 0) return;
    let newOrder = [...order];
    let change = newOrder.splice(0, newOrder.indexOf(index));
    newOrder = [...newOrder, ...change];
    setOrder(newOrder);
  };

  const topIndex = order[0];
  const topPerson =
    expertSectionData?.length > 0 ? expertSectionData[topIndex] : {};
  const words1 = topPerson?.experience?.split(" ");
  const firstWord1 = words1?.length > 0 && words1[0];
  const restWords1 = words1?.slice(1)?.join(" ");

  const words2 = topPerson?.trainedOver?.split(" ");
  const firstWord2 = words2?.length > 0 && words2[0];
  const restWords2 = words2?.slice(1)?.join(" ");

  return (
    <div className="askexpert flex items-center justify-center sm:px-6 lg:px-8 max-md:pb-10">
      <div className="md:flex grid grid-cols-2 md:flex-row items-center gap-5 md:gap-40 sm:px-5">
        <div className="relative flex items-center w-[125px] h-[140px] sm:w-[236px] sm:h-[304px]">
          {_map(expertSectionData, (person, index) => {
            const zIndex = order.indexOf(index);
            const isFront = zIndex === 0;
            return (
              <div
                key={index}
                className="absolute w-[93.64px] h-[124.55px] sm:w-[206px] sm:h-[274px] shadow-lg rounded-[9.09px] sm:rounded-[20px] transition-all duration-600 ease-in-out cursor-pointer"
                style={{
                  zIndex: zIndex == 0 ? 8 : zIndex == 1 ? 6 : -1,
                  transform: isFront
                    ? "translate(0, 0) rotate(0deg)"
                    : `translate(42px, 15px) rotate(10deg)`,
                }}
                onClick={() => handleClick(index)}
                aria-label={`${person?.name}`}
              >
                <img
                  src={person?.media?.url}
                  alt={person?.media?.alternativeText}
                  className="flex w-full h-full object-cover rounded-[9.09px] sm:rounded-[20px]"
                />
              </div>
            );
          })}
        </div>

        <div className="w-full md:w-[305px] lg:w-[405px] text-center md:text-left">
          <h2 className="text-xl leading-[20px] text-left sm:text-3xl md:text-5xl font-light tracking-[-0.0525rem] text-black mb-6">
            {topPerson?.name}
          </h2>

          <hr className="hidden sm:block opacity-10" />

          <div className="flex flex-col sm:flex-row justify-between text-left text-black py-1 md:py-3">
            <div className="mb-2 sm:mb-0">
              <p className="text-[12px] sm:text-[14px] leading-[26px] font-normal text-[#5D6167]">
                EXPERIENCE
              </p>
              <p className="leading-7 md:text-3xl font-medium">
                {words1?.length === 1 ? (
                  <span>
                    <span>{firstWord1}</span>
                  </span>
                ) : (
                  <span>
                    <span>
                      <span>{firstWord1} </span>
                    </span>
                    <span className=" font-light">{restWords1}</span>
                  </span>
                )}
              </p>
            </div>
            <hr className="hidden sm:block w-28 h-28 lg:w-14 lg:h-14 opacity-10 transform rotate-270 translate-x-10 lg:translate-x-0" />
            <hr className="block sm:hidden opacity-10 me-5 sm:me-0" />
            <div>
              <p className="text-[12px] sm:text-[14px] leading-[26px] font-normal text-[#5D6167]">
                TRAINED OVER
              </p>
              <p className="leading-7 md:text-3xl font-medium">
                {words2?.length === 1 ? (
                  <span>
                    <span>{firstWord2}</span>
                  </span>
                ) : (
                  <span>
                    <span>
                      <span>{firstWord2} </span>
                    </span>
                    <span className=" font-light">{restWords2}</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          <hr className="hidden sm:block opacity-10" />

          <p className="text-base leading-[26px] font-normal text-[#5D6167] pt-10 pe-10 md:block hidden">
            {topPerson?.description}
          </p>
        </div>
        <p className="col-span-2 text-[12px] max-md:text-sm md:leading-tight text-[#5D6167] block md:hidden">
          {topPerson?.description}
        </p>
      </div>
    </div>
  );
};

export default ExpertDetail;
