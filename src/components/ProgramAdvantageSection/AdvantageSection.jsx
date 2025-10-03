import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";
import StyledHeading from "../StyledHeading/StyledHeading";
import TextArea from "../TextArea/TextArea";
import _map from "lodash/map";

const AdvantageSection = ({ advantageSectionData }) => {
  const { mainHeading, description, advantageCard, sectionID } =
    advantageSectionData;
  return (
    <section
      className="advantage-section relative"
      aria-labelledby="advantage-section-heading"
    >
      <MaxWidthContainer id={sectionID}>
        {/* Heading Section */}
        <div className="heading-section w-full mb-6">
          {mainHeading && (
            <StyledHeading
              id="advantage-section-heading"
              styledHeadingData={mainHeading}
              extraClasses="md:text-sectionheading md:leading-15 max-md:text-heading max-md:leading-11 mb-5 md:mb-10"
            />
          )}

          {description?.description && (
            <div className="text-center w-full text-sm md:text-lg md:max-w-xl mx-auto text-coregray-200 leading-6 mb-8">
              <TextArea textAreaData={description?.description} />
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 max-w-6xl mx-auto">
          {_map(advantageCard, (item, index) => (
            <article
              key={index}
              className="flex flex-col space-y-2 items-center p-4 bg-transparent rounded-md"
              aria-label={item?.heading}
            >
              <img
                src={item?.icon?.url}
                alt={item?.icon?.alternativeText || "icon"}
                loading="lazy"
                width="40"
                height="40"
                className="mb-4"
              />
              <h3 className="font-semibold text-center text-md md:text-lg text-gray-900">
                {item?.heading}
                {item?.tag && (
                  <span className="text-xs text-center text-gray-500 font-medium">
                    {" "}
                    {item?.tag}
                  </span>
                )}
              </h3>

              <TextArea
                textAreaData={item?.description}
                extraClasses="text-sm text-coregray-300 text-center"
              />
            </article>
          ))}
        </div>
      </MaxWidthContainer>
    </section>
  );
};

export default AdvantageSection;
