import StyledHeading from "../StyledHeading/StyledHeading";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";
import _map from "lodash/map";
import Button from "../Button/Button";

const FinancialLiteracyMattersSection = ({
  financialLiteracyMattersSectionData,
}) => {
  const { mainHeading, teaser, sectionID } =
    financialLiteracyMattersSectionData;
  const teaserCards = teaser?.slice(1, 3);
  const bgColors = ["#E9FFD8", "#FEF2F3"];

  return (
    <section className="w-full">
      <MaxWidthContainer id={sectionID}>
        {/* Main Section */}
        <div>
          <div aria-labelledby="financial-literacy-title">
            <StyledHeading
              styledHeadingData={mainHeading}
              extraClasses="md:text-sectionheading md:leading-15 max-md:text-heading max-md:leading-11 mb-5 md:mb-10"
            />
            {teaser?.length > 0 && (
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-[40px] bg-[#FBF7D3] px-2 md:px-1 rounded-[20px] md:rounded-4xl md:py-1">
                {/* Image Section */}
                <div className="w-full h-full md:max-w-[616px] lg:h-[518px] hidden md:flex justify-center rounded-3xl bg-white">
                  <img
                    src={teaser[0]?.desktopMedia?.url}
                    alt={teaser[0]?.desktopMedia?.alternativeText || "gif"}
                    className="w-full h-full rounded-4xl"
                  />
                </div>

                {teaser[0]?.mobileMedia && (
                  <div className="w-full h-full flex md:hidden justify-center mt-2">
                    <img
                      src={teaser[0]?.mobileMedia?.url}
                      alt={teaser[0]?.mobile?.alternativeText || "gif"}
                      className="w-full h-full rounded-2xl"
                    />
                  </div>
                )}
                {/* Text Section */}
                <div className="w-full text-left md:max-w-[472px] md:py-7 p-3">
                  <h3 className="lg:text-[40px] md:text-3xl text-2xl font-light text-[#1C1C1C] mb-4 tracking-[-0.02em] leading-7 md:leading-10">
                    {teaser[0]?.heading}
                  </h3>
                  <div className="text-[#1C1C1CB2] text-sm md:text-xl md:leading-[26px] font-normal mb-5 md:mb-10">
                    <BlocksRenderer content={teaser[0]?.description} />
                  </div>
                  <div className="flex flex-row gap-3 justify-start">
                    {_map(teaser[0]?.cta, (item, index) => (
                      <Button
                        key={index}
                        buttonData={item}
                        extraClasses="w-fit text-xs md:text-sm font-bold px-8 py-3 md:py-4 transition duration-300"
                      ></Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Teaser Cards Section */}
          <div className="py-8">
            <div className="teaser-cards-wrapper grid grid-cols-1 md:grid-cols-2 gap-6">
              {_map(teaserCards, (item, index) => (
                <div
                  key={index}
                  className="rounded-[20px] md:rounded-4xl border-3 p-1"
                  style={{
                    backgroundColor: bgColors[index],
                    borderColor: bgColors[index],
                  }}
                >
                  <div className="rounded-3xl p-5 w-full hidden md:flex justify-center md:h-[272px] lg:h-[497px] bg-white">
                    <img
                      src={item?.desktopMedia?.url}
                      alt={item?.desktopMedia?.alternativeText || "gif"}
                      className="w-full h-auto rounded-4xl"
                    />
                  </div>
                  {item?.mobileMedia && (
                    <div className="rounded-2xl md:rounded-3xl w-full md:hidden flex justify-center bg-white">
                      <img
                        src={item?.mobileMedia?.url}
                        alt={item?.mobileMedia?.alternativeText || "gif"}
                        className="w-full h-auto rounded-2xl"
                      />
                    </div>
                  )}
                  <div className="px-4 md:px-6 py-8 pt-6 md:pt-12 lg:pt-16">
                    <h2 className="text-2xl md:text-[32px] lg:text-[40px] font-light text-[#1C1C1C] leading-7 md:leading-10 max-w-[480px] mb-4">
                      {item?.heading}
                    </h2>
                    <div className="text-sm md:text-xl lg:text-2xl font-normal text-[#1C1C1CB2] max-w-[438px]">
                      <BlocksRenderer content={item?.description} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MaxWidthContainer>
    </section>
  );
};

export default FinancialLiteracyMattersSection;
