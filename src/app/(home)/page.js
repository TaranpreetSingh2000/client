import ProgramAdvantageSection from "@/components/ProgramAdvantageSection/AdvantageSection";
import DownloadAppSection from "@/components/DownloadAppSection/DownloadAppSection";
import FAQSection from "@/components/FAQSection/FAQSection";
import FinancialLiteracyMattersSection from "@/components/FinancialLiteracyMattersSection/FinancialLiteracyMattersSection";
import FinancialLiteracyProgramSection from "@/components/FinancialLiteracyProgramSection/FinancialLiteracyProgramSection";
import ParallaxSection from "@/components/ParallaxSection/ParallaxSection";
import StepsToWealth from "@/components/StepsToWealth/StepsToWealth";
import { fetchHomePageData } from "@/services/homepage.service";
import _get from "lodash/get";
import HeroBanner from "@/components/HeroBanner";
import AskExpertSection from "@/components/AskExpertSection/AskExpertSection";
import KeyModuleAccordion from "@/components/KeyModuleAccordion";
import { bannerWidthGenertor } from "@/utils/bannerWidthGenertor";
import bannerKeyframeGenertor from "@/utils/bannerKeyframeGenerator";
import TestimonialSection from "@/components/TestimonialSection/TestimonialSection";
import NewsSection from "@/components/NewsSection/NewsSection";
import NewsLetterSection from "@/components/NewsLetterSection/NewsLetterSection";
import ImpactStorySection from "@/components/ImpactStorySection/ImpactStorySection";
import TokenGenerator from "@/components/TokenGenerator/TokenGenerator";

export default async function Home() {
  const homepageData = await fetchHomePageData();
  const heroBannerData = _get(homepageData, "home.heroBanner", {});
  const financialLiteracySectionData = _get(
    homepageData,
    "home.aboutFinancialLiteracySection",
    {},
  );
  const financialLiteracyMattersSectionData = _get(
    homepageData,
    "home.financialLiteracyMattersSection",
    {},
  );
  const advantageSectionData = _get(
    homepageData,
    "home.advantagesProgramSection",
    {},
  );
  const stepsToWealthData = _get(homepageData, "home.roadMapWealthSection", {});
  const keyModuleAccordionData = _get(
    homepageData,
    "home.keyModulesSection",
    {},
  );
  const platformSectionData = _get(
    homepageData,
    "home.platformResourcesSection",
    {},
  );
  const testimonialSectionData = _get(
    homepageData,
    "home.successStoryTestimonialSection",
    {},
  );
  const askExpertSectionData = _get(homepageData, "home.askExpertSection", {});
  const impactStorySectionData = _get(
    homepageData,
    "home.storyOfImpactSection",
    {},
  );
  const newsSectionData = _get(homepageData, "home.impactNewsSection", {});
  const downloadAppSectionData = _get(
    homepageData,
    "home.downloadAppSection",
    {},
  );
  const faqSectionData = _get(homepageData, "home.faqSection", {});

  const bannerKeyframeData = heroBannerData?.slider
    ? bannerKeyframeGenertor(heroBannerData?.slider)
    : [];
  const bannerWidthData = heroBannerData?.slider
    ? bannerWidthGenertor(heroBannerData?.slider)
    : [];

  const newsLetterSectionData = _get(
    homepageData,
    "home.financialNewsletterSection",
    {},
  );

  return (
    <>
      <TokenGenerator />
      {heroBannerData && (
        <HeroBanner
          heroBannerData={heroBannerData}
          bannerKeyframeData={bannerKeyframeData}
          bannerWidthData={bannerWidthData}
        />
      )}

      {financialLiteracySectionData && (
        <FinancialLiteracyProgramSection
          financialLiteracySectionData={financialLiteracySectionData}
        />
      )}
      {financialLiteracyMattersSectionData && (
        <FinancialLiteracyMattersSection
          financialLiteracyMattersSectionData={
            financialLiteracyMattersSectionData
          }
        />
      )}

      {advantageSectionData && (
        <ProgramAdvantageSection advantageSectionData={advantageSectionData} />
      )}

      {stepsToWealthData && (
        <StepsToWealth stepsToWealthData={stepsToWealthData} />
      )}
      {keyModuleAccordionData && (
        <KeyModuleAccordion keyModuleAccordionData={keyModuleAccordionData} />
      )}
      {platformSectionData && (
        <ParallaxSection platformSectionData={platformSectionData} />
      )}
      {askExpertSectionData && (
        <AskExpertSection askExpertSectionData={askExpertSectionData} />
      )}
      {impactStorySectionData && (
        <ImpactStorySection impactStorySectionData={impactStorySectionData} />
      )}
      {testimonialSectionData && (
        <TestimonialSection testimonialSectionData={testimonialSectionData} />
      )}
      {newsSectionData && <NewsSection newsSectionData={newsSectionData} />}
      {downloadAppSectionData && (
        <DownloadAppSection downloadAppSectionData={downloadAppSectionData} />
      )}
      {newsLetterSectionData && (
        <NewsLetterSection newsLetterSectionData={newsLetterSectionData} />
      )}
      {faqSectionData && <FAQSection faqSectionData={faqSectionData} />}
    </>
  );
}
