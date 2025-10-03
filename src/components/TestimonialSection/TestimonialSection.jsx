import { TESTIMONIAL_CARD_POSITIONS } from "@/constants/constant";
import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";
import StyledHeading from "../StyledHeading/StyledHeading";
import TestimonialCard from "../TestimonialSection/TestimonialCard";
import _map from "lodash/map";
import TestimonialCarousel from "../Slider/TestimonialCarousel";

const TestimonialSection = ({ testimonialSectionData }) => {
  const { mainHeading, sectionID, successStoryOverlayCards, backgroundImage } =
    testimonialSectionData;

  return (
    <section className="relative w-full">
      <MaxWidthContainer id={sectionID} extraClasses="mb-3 lg:mb-[7rem]">
        <StyledHeading
          styledHeadingData={mainHeading}
          extraClasses="md:text-sectionheading max-md:text-heading leading-10 md:leading-15 font-bold text-center mb-10 lg:mb-[7rem]"
        />
        <div className="relative w-full flex gap-6 justify-center items-center mb-6 lg:mb-0">
          <div className="relative flex justify-center w-full h-full lg:w-[574px] lg:h-[372px] z-0 rounded-xl">
            <img
              src={backgroundImage?.url}
              alt={backgroundImage?.alternativeText}
              className="object-cover rounded-[32px]"
            />
          </div>

          <div className="hidden lg:block">
            {_map(successStoryOverlayCards, (cardData, index) => (
              <div
                key={index}
                className={`w-[260px] rounded-2xl p-4 z-10 ${TESTIMONIAL_CARD_POSITIONS[index]}`}
              >
                <TestimonialCard floatingCardData={cardData} index={index} />
              </div>
            ))}
          </div>
        </div>

        <div className="block lg:hidden">
          <TestimonialCarousel
            successStoryCardData={successStoryOverlayCards}
          />
        </div>
      </MaxWidthContainer>
    </section>
  );
};

export default TestimonialSection;
