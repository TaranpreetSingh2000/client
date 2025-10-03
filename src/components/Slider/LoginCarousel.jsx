import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import _map from "lodash/map";

const SwiperCarousel = ({ swiperSlides }) => {
  return (
    <>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        loop
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        className="text-center"
      >
        {_map(swiperSlides, (data, index) => (
          <SwiperSlide key={index}>
            <img
              src={data?.media?.url}
              alt={data?.media?.alternativeText || "ABG Slide"}
              className="mx-auto bg-transparent"
            />
            <div className="flex flex-col items-center max-w-[344px]">
              <h2 className="text-xl font-medium mt-4 text-black">
                {data?.title}
              </h2>
              <p className="text-gray-700 mt-2 text-sm font-normal max-w-[292px]">
                {data?.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SwiperCarousel;
