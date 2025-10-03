"use client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import checkIcon from "../../../public/verifiedUser.svg";
import clock from "../../../public/modules/clock.svg";
import _map from "lodash/map";
import _get from "lodash/get";

const CompleteProfile = ({
  userProfileDetails,
  setIsModalOpen,
  userModulesPageData,
}) => {
  const verificationLabels = _get(
    userModulesPageData,
    "profileCompletionSection.verificationLabels",
    {},
  );
  const isABG = userProfileDetails?.user === "ABG";
  const isNonABG = !isABG;

  const profileSteps = [
    {
      name: verificationLabels?.emailLabel || "Email",
      completed: !!userProfileDetails?.email,
      visible: true,
    },
    {
      name: verificationLabels?.isEmailVerifiedLabel || "Email Verification",
      completed: isABG,
      visible: isABG,
    },
    {
      name: verificationLabels?.mobileLabel || "Mobile Number",
      completed: !!userProfileDetails?.mobile,
      visible: true,
    },
    {
      name: verificationLabels?.isMobileVerifiedlabel || "Mobile Verification",
      completed: isNonABG,
      visible: isNonABG,
    },
    {
      name: verificationLabels?.dobLabel || "Date Of Birth",
      completed: !!userProfileDetails?.DOB,
      visible: true,
    },
    {
      name: verificationLabels?.genderLabel || "Gender",
      completed: !!userProfileDetails?.gender,
      visible: true,
    },
    {
      name: verificationLabels?.companyNameLabel || "Company Name",
      completed: !!userProfileDetails?.companyName,
      visible: true,
    },
    {
      name: verificationLabels?.workLocationLabel || "Work Location",
      completed: !!userProfileDetails?.workLocation,
      visible: true,
    },
    {
      name: verificationLabels?.ProfilePhotoLabel || "Profile Photo",
      completed: !!userProfileDetails?.userProfileImage?.url,
      visible: true,
    },
    {
      name: verificationLabels?.designationLabel || "Designation",
      completed: !!userProfileDetails?.designation,
      visible: !!userProfileDetails?.designation,
    },
  ].filter((step) => step.visible);

  const totalSteps = profileSteps?.length;
  const completedCount = profileSteps.filter((step) => step.completed).length;
  const percentage = Math.round((completedCount / totalSteps) * 100);

  return (
    <>
      <div className="lg:flex lg:flex-col bg-white p-6.5 rounded-[20px] shadow lg:max-w-md lg:mx-auto w-full complete-profile">
        <div className="flex lg:block gap-4 justify-between mb-3.5">
          <div className="flex items-start md:items-center text-start md:text-center">
            {" "}
            <h2 className="text-[22px] leading-[26px] font-medium md:mb-4">
              Complete Your Profile
            </h2>
          </div>

          <div className="flex items-center justify-center md:mb-6">
            <div className="lg:w-[140px] lg:h-[140px] w-[70px] h-[70px] text-[14px] leading-[20px] font-bold md:font-medium  md:text-[54px] md:leading-[32px]">
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  pathColor: "#70B865",
                  trailColor: "#d6d6d6",
                  textColor: "black",
                })}
              />
            </div>
          </div>
        </div>

        {/* Only show visible steps */}

        {userProfileDetails && (
          <ul className="text-left grid lg:grid-cols-2 grid-cols-1 gap-x-4 gap-y-2.5 grid-sec mb-3">
            {_map(profileSteps, (step, idx) =>
              step.visible ? (
                <li
                  key={idx}
                  className={`flex font-medium items-center ${
                    step.completed ? "text-black" : "text-[#828282]"
                  }`}
                >
                  <span className="w-4 h-4 md:w-6 md:h-6 flex-shrink- 0">
                    <img
                      className="w-full h-full object-cover"
                      src={step.completed ? checkIcon.src : clock.src}
                      alt={step.name}
                    />
                  </span>
                  <span
                    className="ml-3.5 md:ml-2 text-sm md:text-lg font-medium
 "
                  >
                    {step.name}
                  </span>
                </li>
              ) : null,
            )}
          </ul>
        )}

        <button
          className={`mt-6 lg:mt-8 px-4 py-2 rounded-full text-white cursor-pointer w-full ${
            percentage === 100
              ? "bg-green-600 hover:bg-green-700"
              : "bg-[#ca1f34] hover:bg-[#a71627]"
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          {percentage === 100 ? "Edit profile" : "Complete Profile"}
        </button>
      </div>
    </>
  );
};

export default CompleteProfile;
