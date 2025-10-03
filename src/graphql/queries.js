import { gql } from "@apollo/client";

const GET_HEADER_DATA = gql`
  query Header {
    header {
      mobileLogo {
        url
        alternativeText
      }
      redirectionLogoUrl
      nav {
        title
        url
        openInNewTab
      }
      cta {
        title
        icon {
          url
          alternativeText
        }
        url
        openInNewTab
        action
        variant
      }
    }
  }
`;

const GET_FOOTER_DATA = gql`
  query Footer {
    footer {
      disclaimer {
        heading
        description
      }
    }
    footernote {
      copyRightText
      socialMedia {
        socialIcon {
          url
          alternativeText
        }
        socialMediaUrl
      }
    }
  }
`;

const GET_HOMEPAGE_DATA = gql`
  query Home {
    home {
      heroBanner {
        media {
          url
          alternativeText
        }
        headingVariant1
        icon {
          url
          alternativeText
        }
        headingVariant2
        headingVariant3
        slider {
          icon {
            url
            alternativeText
          }
          heading
        }
        description
        cta {
          title
          icon {
            url
            alternativeText
          }
          url
          action
          openInNewTab
          variant
        }
        sectionID
      }
      aboutFinancialLiteracySection {
        mainHeading {
          heading
          color
          breakLine
        }
        descriptionText {
          description
        }
        tag {
          icon {
            url
            alternativeText
          }
          title
        }
        financialCards {
          heading
          subHeading
        }
        sectionID
      }
      financialLiteracyMattersSection {
        mainHeading {
          heading
          color
          breakLine
        }
        teaser {
          desktopMedia {
            url
            alternativeText
          }
          mobileMedia {
            url
            alternativeText
          }
          heading
          description
          cta {
            icon {
              url
              alternativeText
            }
            title
            url
            openInNewTab
            action
            variant
          }
        }
        sectionID
      }
      advantagesProgramSection {
        mainHeading {
          heading
          color
          breakLine
        }
        description {
          description
        }
        advantageCard {
          icon {
            url
            alternativeText
          }
          heading
          tag
          description
        }
        sectionID
      }
      roadMapWealthSection {
        mainHeading {
          heading
          color
          breakLine
        }

        roadmapCards {
          heading
          description
        }
        media {
          image {
            url
            alternativeText
          }
        }
        sectionID
      }
      keyModulesSection {
        mainHeading {
          heading
          color
          breakLine
        }
        description
        modules {
          title
          tag
          stats {
            icon {
              url
              alternativeText
            }
            title
          }
          modulesList {
            title
            url
            openInNewTab
          }
        }
        sectionID
      }
      platformResourcesSection {
        mainHeading {
          heading
          color
          breakLine
        }
        resourceCard {
          media {
            image {
              url
              alternativeText
            }
          }
          heading
        }
        sectionID
      }
      askExpertSection {
        mainHeading {
          heading
          color
          breakLine
        }
        expertSection {
          media {
            url
            alternativeText
          }
          name
          experience
          trainedOver
          description
        }
        recentQnaHeading {
          title
        }
        recentCarousel {
          heading
          description
        }
        expertCta {
          icon {
            url
            alternativeText
          }
          title
          url
          openInNewTab
          action
          variant
        }
        askExpertSuccessMessage
        asExpertDescriptionMessage
        sectionID
      }
      storyOfImpactSection {
        mainHeading {
          heading
          color
          breakLine
        }
        card {
          image {
            url
            alternativeText
          }
          heading
          description
        }
        sectionID
      }
      successStoryTestimonialSection {
        mainHeading {
          heading
          color
          breakLine
        }
        successStoryOverlayCards {
          sucessStoryInnerCardSection {
            icon {
              url
              alternativeText
            }
            title
            tag
            description
          }
        }
        backgroundImage {
          url
          alternativeText
        }
        sectionID
      }
      impactNewsSection {
        mainHeading {
          heading
          color
          breakLine
        }
        allImpactNewsSections {
          impactNewsWithImage {
            newsImage {
              url
              alternativeText
            }
            tag
            newsArticle {
              icon {
                url
                alternativeText
              }
              title
              heading
              description
              timeline
              url
              timelineIcon {
                url
                alternativeText
              }
            }
          }
          impactNewsWithoutImage1 {
            tag
            newsArticle {
              icon {
                url
                alternativeText
              }
              title
              heading
              description
              timeline
              url
              timelineIcon {
                url
                alternativeText
              }
            }
          }
          impactNewsWithoutImage2 {
            tag
            newsArticle {
              icon {
                url
                alternativeText
              }
              title
              heading
              description
              timeline
              url
              timelineIcon {
                url
                alternativeText
              }
            }
          }
        }
        sectionID
      }
      downloadAppSection {
        descriptionCard {
          heading
          subHeading
          keyHeading {
            heading
          }
          cta {
            icon {
              url
              alternativeText
            }
            title
            url
            openInNewTab
            action
            variant
          }
        }
        desktopMedia {
          url
          alternativeText
        }
        mobileMedia {
          url
          alternativeText
        }
        sectionID
      }
      financialNewsletterSection {
        mainHeading {
          heading
          color
          breakLine
        }
        description {
          description
        }
        inputField {
          inputFieldType
          inputFieldPlaceholder
        }
        newsletterCta {
          title
          icon {
            url
            alternativeText
          }
          url
          openInNewTab
          action
          variant
        }

        sectionID
        newsletterErrorMessage
        newsletterSuccessMessage
      }
      faqSection {
        mainHeading {
          heading
          color
          breakLine
        }
        faqAccordion {
          heading
          description
        }
        sectionID
      }
    }
  }
`;

const GET_EXPERT_DATA = gql`
  query Home {
    home {
      askExpertSection {
        expertSection {
          name
          media {
            url
            alternativeText
          }
        }
        askExpertSuccessMessage
        asExpertDescriptionMessage
      }
    }
  }
`;

const CREATE_NEWSLETTER_DATA = gql`
  mutation CreateSubscriber($data: SubscriberInput!) {
    createSubscriberResponse(data: $data) {
      success
      message
    }
  }
`;

const CREATE_ASK_OUR_EXPERT_DATA = gql`
  mutation CreateAskexpert($data: AskexpertInput!) {
    createAskExpertResponse(data: $data) {
      success
      message
    }
  }
`;

const GET_LOGIN_MODAL_DATA = gql`
  query LoginModule {
    loginModule {
      loginModal {
        carousel {
          media {
            url
            alternativeText
          }
          title
          description
        }
        domainList {
          label
          value
        }
      }
      enableParserOtp
      termsConditionCheckSection {
        label
        termsConditionLabel
        termsConditionLink
        openInNewTab
      }
    }
  }
`;

const GET_PROFILE_HEADER_DATA = gql`
  query ProfileHeader {
    profileHeader {
      redirectionLogoUrl
      cta {
        icon {
          url
          alternativeText
        }
        title
        url
        openInNewTab
        action
        variant
      }
      desktopLogo {
        url
        alternativeText
      }
      mobileLogo {
        url
        alternativeText
      }
    }
  }
`;

const GET_REPORT_ISSUE_DATA = gql`
  query ReportIssue {
    reportIssue {
      title
      icon {
        url
        alternativeText
      }
      heading
      description
      email
    }
  }
`;

// const GET_ABCDUSER_ACTIVE = gql`
//   query AbcdUserLogins($filters: AbcdUserLoginFiltersInput) {
//     abcdUserLogins(filters: $filters) {
//       isUserSessionActive
//       loginTimestamp
//       documentId
//     }
//   }
// `;
const GET_ABCDUSER_ACTIVE = gql`
  query ($filters: AbcdUserLoginFiltersInput) {
    abcdUserLoginsPrivateSession(filters: $filters) {
      iv
      ct
    }
  }
`;

const GET_ABCDUSER_LOGIN_ID = gql`
  query ($filters: AbcdUserLoginFiltersInput) {
    abcdUserLoginsPrivateSession(filters: $filters) {
      iv
      ct
    }
  }
`;

const GET_MODULESPAGE_DATA = gql`
  query UserModulesPage(
    $filters: ComponentMenuIconMenuFiltersInput
    $keyModulesChapterSectionFilters2: ComponentKeyModulesKeyModulesChaptersFiltersInput
  ) {
    userModulesPage {
      profileCompletionSection {
        verificationLabels {
          emailLabel
          isEmailVerifiedLabel
          mobileLabel
          isMobileVerifiedlabel
          dobLabel
          genderLabel
          companyNameLabel
          workLocationLabel
          ProfilePhotoLabel
          designationLabel
        }
      }
      profileTrackingSection
      financialLiteracyModulesSection {
        title
        stats {
          icon {
            url
            alternativeText
          }
          title
        }
        media {
          url
          alternativeText
        }
      }
      keyModulesChapterSection(filters: $keyModulesChapterSectionFilters2) {
        title
        stats {
          icon {
            url
            alternativeText
          }
          title
        }
        moduleChapterList(filters: $filters) {
          icon {
            url
            alternativeText
          }
          title
          url
          openInNewTab
          checkIcon {
            url
            alternativeText
          }
        }
      }
    }
  }
`;

const GET_LOGINLOGS_ID = gql`
  query Query($filters: LoginLogFiltersInput) {
    loginLogs(filters: $filters) {
      documentId
      createdAt
    }
  }
`;
export {
  GET_HEADER_DATA,
  GET_HOMEPAGE_DATA,
  GET_FOOTER_DATA,
  GET_EXPERT_DATA,
  CREATE_NEWSLETTER_DATA,
  CREATE_ASK_OUR_EXPERT_DATA,
  GET_LOGIN_MODAL_DATA,
  GET_PROFILE_HEADER_DATA,
  GET_REPORT_ISSUE_DATA,
  GET_ABCDUSER_ACTIVE,
  GET_ABCDUSER_LOGIN_ID,
  GET_MODULESPAGE_DATA,
  GET_LOGINLOGS_ID,
};
