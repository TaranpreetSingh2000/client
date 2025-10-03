"use client";
import _map from "lodash/map";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import { useRef, useState } from "react";

const TestimonialCarousel = ({ successStoryCardData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const totalLength = successStoryCardData?.reduce(
    (sum, obj) => sum + obj.sucessStoryInnerCardSection.length,
    0,
  );
  const totalCardsArr = Array.from({ length: totalLength }, (_, i) => i);

  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        slidesPerView={1.15}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={false}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        breakpoints={{
          640: { slidesPerView: 1.25 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3.1 },
        }}
      >
        {successStoryCardData?.length > 0 &&
          successStoryCardData.flatMap((outerCardData) =>
            _map(outerCardData?.sucessStoryInnerCardSection, (card) => (
              <SwiperSlide className="!h-auto">
                <div
                  className="px-3 py-3 rounded-2xl flex gap-4 w-full h-full"
                  style={{
                    backgroundColor: "#E0E0E066",
                    borderColor: "#E0E0E066",
                  }}
                >
                  <div className="w-33 h-10 overflow-hidden rounded-full">
                    <img
                      src={card?.icon?.url}
                      alt={card?.icon?.alternativeText}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <div>
                    <div className="mb-2">
                      <h3 className="text-sm font-semibold">{card?.title}</h3>
                      <p className="text-xs text-gray-500">{card?.tag}</p>
                    </div>

                    <p className="text-gray-600 text-xs">{card?.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            )),
          )}
      </Swiper>

      <div className="swiper-pagination-custom-dots lg:hidden pb-1.5 justify-center flex mt-10">
        {_map(totalCardsArr, (_item, index) => (
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
    </div>
  );
};

export default TestimonialCarousel;
