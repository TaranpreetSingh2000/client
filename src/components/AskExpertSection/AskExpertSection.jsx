import expertBg from "../../../public/expertBg.png";
import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";
import InfoCarousel from "../Slider/InfoCarousel";
import StyledHeading from "../StyledHeading/StyledHeading";
import ExpertDetail from "./ExpertDetail";

const AskExpertSection = ({ askExpertSectionData }) => {
  const {
    mainHeading,
    expertSection,
    recentCarousel,
    recentQnaHeading,
    expertCta,
    sectionID,
  } = askExpertSectionData;

  return (
    <section
      className=" bg-[#FFF4D9]"
      style={{
        backgroundImage: `url('${expertBg.src}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        top: "0px",
      }}
    >
      <MaxWidthContainer id={sectionID} extraClasses="!pr-0">
        {mainHeading && (
          <StyledHeading
            styledHeadingData={mainHeading}
            extraClasses="md:text-sectionheading md:leading-15 max-md:text-heading max-md:leading-11
 mb-[30px] md:mb-[80px] lg:mb-[132px]"
          />
        )}
        <ExpertDetail expertSectionData={expertSection} />
        <InfoCarousel
          recentCarousel={recentCarousel}
          expertCta={expertCta}
          recentQnaHeading={recentQnaHeading}
        />
      </MaxWidthContainer>
    </section>
  );
};

export default AskExpertSection;
