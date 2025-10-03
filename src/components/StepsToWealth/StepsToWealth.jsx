import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";
import OverlappingCards from "../OverlappingCards/OverlappingCards";
import StyledHeading from "../StyledHeading/StyledHeading";

const StepsToWealth = ({ stepsToWealthData }) => {
  const { mainHeading, media, roadmapCards, sectionID } = stepsToWealthData;
  return (
    <section aria-labelledby="steps-to-wealth">
      <div className="w-full bg-[#F5F5F5] steps-to-wealth-section">
        <MaxWidthContainer id={sectionID}>
          <div className="steps-to-wealth-container w-full flex flex-col lg:flex-row justify-around items-center md:items-start gap-5 md:gap-15">
            {/* LEFT SECTION - Heading & Image */}
            <div className="heading-section flex flex-col xl:gap-6 items-center justify-center">
              {mainHeading && (
                <StyledHeading
                  styledHeadingData={mainHeading}
                  extraClasses="md:text-sectionheading md:leading-15 max-md:text-heading max-md:leading-11 mb-5 md:mb-10"
                />
              )}

              <div className="hidden w-full md:flex justify-center">
                <img
                  src={media?.image?.url}
                  alt={media?.image?.alternativeText || "image"}
                  className="mix-blend-darken object-contain w-full max-w-[440px] xl:max-w-[498px] h-[250px] "
                />
              </div>
            </div>

            {/* RIGHT SECTION - Cards */}
            <div className="overlapping-cards-section flex justify-center mt-0">
              {roadmapCards && (
                <OverlappingCards overlappingCardsData={roadmapCards} />
              )}
            </div>
          </div>
        </MaxWidthContainer>
      </div>
    </section>
  );
};

export default StepsToWealth;
