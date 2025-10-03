import checkIcon from "../../../public/check.svg";
import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";
import _map from "lodash/map";
import Button from "../Button/Button";

const ProgramAdvantageSection = ({ downloadAppSectionData }) => {
  const { desktopMedia, mobileMedia, descriptionCard, sectionID } =
    downloadAppSectionData;
  return (
    <section aria-labelledby="Download the ABCD App">
      <MaxWidthContainer id={sectionID}>
        <div
          className="flex flex-col items-center bg-[#FFF4D9] max-w-8xl mx-auto rounded-4xl p-5 mb-5 lg:mb-0  md:flex-row
    md:gap-0 md:relative"
        >
          <div className="lg:ml-5 flex justify-center items-center w-full md:w-1/2 md:max-h-[598px] md:max-w-[590px] transform translate-y-[-4.8rem] md:translate-y-[-5rem] max-h-[349px] max-w-[256px]">
            {desktopMedia && (
              <img
                className="max-md:hidden "
                src={desktopMedia?.url}
                alt={desktopMedia?.alternativeText}
              />
            )}
            {mobileMedia && (
              <img
                className="md:hidden"
                src={mobileMedia?.url}
                alt={mobileMedia?.alternativeText}
              />
            )}
          </div>
          <div className="flex flex-col p-2 md:w-1/2 mt-[-3rem] md:mt-0">
            <h2 className="text-3xl font-extralight md:text-4xl lg:text-5xl mb-3 text-mainheading">
              {descriptionCard?.heading}
            </h2>
            <ul className="space-y-3 md:space-y-1 lg:space-y-3 md:py-2 lg:py-4  mb-4 md:mb-2">
              {_map(descriptionCard?.keyHeading, (item, index) => (
                <li
                  key={index}
                  className="flex font-normal items-start gap-2 text-base md:text-lg leading-5 md:leading-6"
                >
                  <img
                    src={checkIcon.src}
                    className="w-[20px] h-[20px] md:w-[22px] md:h-[22px]"
                    alt=""
                  />
                  <span>{item.heading}</span>
                </li>
              ))}
            </ul>
            <p className="text-md md:text-xl font-semibold mb-3">
              {descriptionCard?.subHeading}
            </p>

            <div className="flex flex-row gap-3 justify-start">
              {_map(descriptionCard?.cta, (item, index) => (
                <Button
                  key={index}
                  buttonData={item}
                  extraClasses="max-md:flex-1 text-[11px] font-semibold md:text-sm px-6 py-3 md:px-7 md:py-3"
                ></Button>
              ))}
            </div>
          </div>
        </div>
      </MaxWidthContainer>
    </section>
  );
};

export default ProgramAdvantageSection;
