"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import StyledHeading from "../StyledHeading/StyledHeading";
import _map from "lodash/map";
import Link from "next/link";
import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";

function NewsSection({ newsSectionData }) {
  const { mainHeading, allImpactNewsSections, sectionID } = newsSectionData;

  const LogoSection = ({ iconUrl, iconName }) => (
    <div
      className="flex items-start gap-2"
      role="group"
      aria-label={`Logo section for ${iconName}`}
    >
      <div className="w-11 h-11 sm:w-8 sm:h-8 lg:w-11 lg:h-11 rounded-lg bg-slate-100/40">
        <img
          src={iconUrl?.url}
          alt={iconUrl?.alternativeText}
          className="w-full h-full p-1 object-contain"
        />
      </div>
      <p className="text-sm md:text-xs w-min lg:text-sm text-slate-700 font-medium">
        {iconName}
      </p>
    </div>
  );

  const CategoryTag = ({ categoryTag }) =>
    categoryTag && (
      <span
        className="text-[9px] text-black font-semibold bg-amber-400 px-2.5 py-1.5 w-fit rounded absolute top-2 right-2"
        aria-label={`Category: ${categoryTag}`}
      >
        {categoryTag}
      </span>
    );

  const CardContent = ({ title, description, timelineIcon, readTime }) => (
    <>
      <div className="my-3 pb-10 sm:pb-11">
        <h2 className="text-base/5 pb-1 text-stone-700 font-bold">{title}</h2>
        <p className="text-xs/4 lg:text-sm/4 font-normal text-stone-400 overflow-hidden line-clamp-2">
          {description}
        </p>
      </div>
      <footer
        className="absolute left-4 right-4 bottom-4 md:pt-2"
        aria-label="Article meta info"
      >
        <hr className="border-stone-100 mt-1 mb-4" />
        <div className="font-medium text-xs text-gray-500">
          <p className="flex items-center gap-2">
            {/* To be changed later */}
            <img
              src={timelineIcon?.url}
              alt={timelineIcon?.alternativeText}
              className="w-4 h-4"
              aria-hidden="true"
            />
            <span>{readTime}</span>
          </p>
        </div>
      </footer>
    </>
  );

  const NewsCard = ({ card, category, newsImage }) => (
    <article className="bg-white rounded-lg p-4 flex flex-col w-full h-full relative">
      <Link
        href={card?.url ? card?.url : "#"}
        target="_blank"
        onClick={(e) => {
          if (card?.url == "#" || card?.url == null) {
            e.preventDefault();
          }
        }}
      >
        {newsImage ? (
          <div className="relative mb-4 h-52 w-full">
            <img
              src={newsImage?.url}
              alt={newsImage?.alternativeText}
              className="w-full h-full object-cover rounded-2xl"
            />

            {category && category?.length > 1 ? (
              <CategoryTag categoryTag={category} />
            ) : (
              ""
            )}
          </div>
        ) : category && category?.length > 1 ? (
          <CategoryTag categoryTag={category} />
        ) : (
          ""
        )}
        <LogoSection iconUrl={card?.icon} iconName={card?.title} />

        <CardContent
          title={card?.heading}
          description={card?.description}
          timelineIcon={card?.timelineIcon}
          readTime={card?.timeline}
        />
      </Link>
    </article>
  );

  return (
    <div className="bg-coregray-100">
      <section className="relative">
        <MaxWidthContainer id={sectionID} extraClasses="mb-[3rem]">
          <StyledHeading
            styledHeadingData={mainHeading}
            extraClasses="md:text-sectionheading text-center max-md:text-heading mb-5 md:mb-10 text-left"
          />
          {/* for mobile view - swiper usage */}
          <div className="md:hidden mb-4">
            <Swiper
              pagination={{
                clickable: true,
                el: ".swiper-pagination",
                renderBullet: (index, className) => `
              <span class="${className} swiper-pagination-bullet"></span>`,
              }}
              modules={[Pagination, FreeMode]}
              slidesPerView={1.07}
              freeMode={true}
              spaceBetween={20}
              className="mySwiper"
            >
              {_map(allImpactNewsSections, (group, groupIndex) => {
                const {
                  impactNewsWithImage,
                  impactNewsWithoutImage1,
                  impactNewsWithoutImage2,
                } = group;
                return (
                  <div key={groupIndex} className="">
                    {/* Slide 1: newsWithImage card */}
                    <SwiperSlide
                      key={`image-${groupIndex}`}
                      className="!h-auto"
                    >
                      <NewsCard
                        card={impactNewsWithImage?.newsArticle}
                        newsImage={impactNewsWithImage?.newsImage}
                        category={impactNewsWithImage?.tag}
                      />
                    </SwiperSlide>
                    {/* Slide 2: Stacked non-image cards */}
                    <SwiperSlide
                      key={`noimage-${groupIndex}`}
                      className="grid grid-rows-2 gap-4 !h-auto sm:!h-full"
                    >
                      <div className="grid grid-rows-2 gap-4 h-full">
                        {_map(
                          [impactNewsWithoutImage1, impactNewsWithoutImage2],
                          (card, index) => (
                            <NewsCard
                              key={index}
                              card={card?.newsArticle}
                              category={card?.tag}
                            />
                          ),
                        )}
                      </div>
                    </SwiperSlide>
                  </div>
                );
              })}
            </Swiper>
            {/* Custom Pagination */}
            <div className="swiper-pagination absolute !bottom-5 items-center left-0 right-0 md:hidden flex justify-center gap-1.8"></div>
          </div>
          {/* Desktop view */}
          <div className="hidden md:flex gap-2 lg:gap-4 flex-row">
            {_map(allImpactNewsSections, (group, index) => {
              const {
                impactNewsWithImage,
                impactNewsWithoutImage1,
                impactNewsWithoutImage2,
              } = group;
              return (
                <div key={index} className="flex gap-2 lg:gap-4 w-full">
                  {/* Left: With image */}
                  <div className="w-1/2">
                    <NewsCard
                      card={impactNewsWithImage?.newsArticle}
                      newsImage={impactNewsWithImage?.newsImage}
                      category={impactNewsWithImage?.tag}
                      imageHeight="h-44 lg:h-52"
                    />
                  </div>
                  {/* Right: Two stacked cards */}
                  <div className="flex flex-col gap-2 lg:gap-4 w-1/2">
                    {_map(
                      [impactNewsWithoutImage1, impactNewsWithoutImage2],
                      (card, index) => (
                        <div key={index} className="flex-1">
                          <NewsCard
                            card={card?.newsArticle}
                            category={card?.tag}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </MaxWidthContainer>
      </section>
    </div>
  );
}

export default NewsSection;
