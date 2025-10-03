"use client";

import "swiper/css";
import "swiper/css/navigation";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import _map from "lodash/map";
import Button from "../Button/Button";
import leftArrow from "../../../public/left_arrow.svg";
import rightArrow from "../../../public/right_arrow.svg";

const InfoCarousel = ({ recentCarousel, recentQnaHeading, expertCta }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  return (
    <div className={`max-w-full mx-auto relative z-20 md:mt-11`}>
      <div>
        {recentQnaHeading && (
          <h2 className="text-2xl font-bold mb-6 text-left">
            {recentQnaHeading?.title}
          </h2>
        )}

        <div>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1.2}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={false}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              640: { slidesPerView: 1.25 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3.2 },
            }}
          >
            {_map(recentCarousel, (qa, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <div className="bg-white px-4 py-6 md:p-6 rounded-2xl w-full h-full">
                  <h3 className="text-md md:text-xl font-semibold mb-2">
                    {qa?.heading}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {qa.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="flex justify-between items-end pr-4 md:px-4">
        <div className="swiper-pagination-custom-dots md:hidden pb-1.5">
          {_map(recentCarousel, (_item, index) => (
            <span
              key={index}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className={`w-2.5 h-2.5 rounded-full mx-1 cursor-pointer transition-all ${
                index === activeIndex
                  ? "swiper-pagination-bullet swiper-pagination-bullet-active"
                  : "swiper-pagination-bullet bg-gray-300"
              }`}
            />
          ))}
        </div>
        {expertCta && (
          <div className="mt-8 flex max-md:justify-end items-center gap-2">
            {_map(expertCta, (item, index) => (
              <Button
                key={index}
                buttonData={item}
                extraClasses="px-3 py-1.5 md:px-6 md:py-3 font-semibold"
              ></Button>
            ))}
          </div>
        )}

        {recentCarousel && recentCarousel?.length > 0 && (
          <div className="hidden md:flex gap-x-4">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex items-center justify-center w-[54px] h-[54px] border border-red-600 rounded-full text-red-600 transition z-10 cursor-pointer"
            >
              <img src={leftArrow.src} alt="arrow" className="w-4 h-4" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="flex items-center justify-center w-[54px] h-[54px]  border border-red-600 rounded-full text-red-600 transition z-10 cursor-pointer"
            >
              <img src={rightArrow.src} alt="arrow" className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoCarousel;
