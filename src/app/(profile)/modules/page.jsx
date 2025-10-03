"use client";
import SteperAccordian from "@/components/SteperAccordian/SteperAccordian";
import Userprofile from "@/components/Userprofile/Userprofile";
import MaxWidthContainer from "@/components/MaxWidthContainer/MaxWidthContainer";
import useFetch from "@/hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import TokenGenerator from "@/components/TokenGenerator/TokenGenerator";
import UpdateProfile from "@/components/Modals/UpdateProfile";
import TimeToTakeBreakModal from "@/components/Modals/TimeToTakeBreakModal";
import FinancialLiteracy from "@/components/FinancialLiteracy/FinancialLiteracy";
import CompleteProfile from "@/components/CompleteProfile/CompleteProfile";
import { clearUserSession } from "@/utils/clearSession";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { httpService } from "@/lib/httpService";
import { clearUserTokens } from "@/redux/features/userTokenSlice";
import Certificate from "@/components/Certificate/Certificate";
import SessionTimeoutModal from "@/components/Modals/SessionTimeoutModal";
import { decryptData } from "@/utils/decryption";
import { encryptData } from "@/utils/encryption";

const page = () => {
  const { profileData, refetch } = useFetch();
  const [userProfileDetails, setUserProfileDetails] = useState({});
  const [isTimeTakeModal, setIsTimeTakeModal] = useState(false);
  const [sessionTimeModal, setSessionTimeModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userModulesPageData, setUserModulesPageData] = useState({});
  const [profileCompletionPhase, setProfileCompletionPhase] = useState(false);
  const bearerToken = useSelector((state) => state.token.accessToken);
  const dispatch = useDispatch();
  const pathname = usePathname();
  let user;
  let userId;

  const encryptedUserId = sessionStorage.getItem("aditya_birla_session_id");
  if (encryptedUserId) {
    userId = decryptData(JSON.parse(encryptedUserId));
  }

  const timeoutRef = useRef(null);

  if (profileData) {
    user = profileData?.user;
  }

  useEffect(() => {
    if (pathname !== "/modules") {
      clearUserSession(userId, bearerToken);
    }
  }, [pathname]);

  const startInactivityTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(
      () => {
        setSessionTimeModal(true);
        setTimeout(() => {
          clearUserSession(userId, bearerToken);
          dispatch(clearUserTokens());
          window.location.href = "/";
        }, 5000);

        startInactivityTimer();
      },
      30 * 60 * 1000,
    );
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "mouseup",
      "click",
      "keydown",
      "keyup",
      "scroll",
      "wheel",
      "touchstart",
      "touchmove",
      "touchend",
      "pointermove",
      "pointerdown",
      "pointerup",
      "focus",
    ];

    const handleUserActivity = () => {
      startInactivityTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    startInactivityTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, startInactivityTimer);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      setIsTimeTakeModal(true);
      window.history.pushState(null, "", window.location.pathname);
    };

    // Push initial state to avoid accidental back navigation
    window.history.pushState(null, "", window.location.pathname);

    // Listen to popstate and hashchange
    window.addEventListener("popstate", handleBackButton);
    window.addEventListener("hashchange", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
      window.removeEventListener("hashchange", handleBackButton);
    };
  }, []);

  useEffect(() => {
    const filters = {
      showTo: {
        in: [user, "BOTH"],
      },
    };

    const keyModulesChapterSectionFilters2 = {
      showTo: {
        in: [user, "BOTH"],
      },
    };

    const variables = {
      filters,
      keyModulesChapterSectionFilters2,
    };

    const payloadVariablesIV = encryptData(variables);
    const fetchData = async () => {
      const response = await httpService.post(
        "/api/client/user-modules-page",
        payloadVariablesIV,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );

      const decryptedResponse = decryptData(response?.data?.profileTracker);
      setUserModulesPageData(decryptedResponse?.userModulesPage);
      setProfileCompletionPhase(
        decryptedResponse?.userModulesPage?.profileTrackingSection,
      );
    };

    if (profileData) {
      setUserProfileDetails(profileData);
    }

    fetchData();
  }, [profileData]);

  return (
    <>
      <TokenGenerator />
      {!profileData ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary-100"></div>
        </div>
      ) : (
        <>
          <div className={`bg-gray-100 ${isModalOpen ? "block" : "hidden"} `}>
            <MaxWidthContainer>
              <UpdateProfile
                userProfileDetails={userProfileDetails}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                onProfileUpdate={refetch}
              />
            </MaxWidthContainer>
          </div>
          <div className={`bg-gray-100 ${isModalOpen ? "hidden" : "block"}`}>
            <MaxWidthContainer>
              <div className="grid lg:grid-cols-3 grid-cols-1 gap-[25px]">
                <div className="lg:flex lg:col-span-2 min-h-[290px] md:min-h-[unset]">
                  <Userprofile
                    userProfileDetails={userProfileDetails}
                    setIsModalOpen={setIsModalOpen}
                  />
                </div>

                <div className="lg:flex lg:row-span-2">
                  <CompleteProfile
                    userProfileDetails={userProfileDetails}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    userModulesPageData={userModulesPageData}
                  />
                </div>

                {userModulesPageData?.financialLiteracyModulesSection && (
                  <div className="lg:flex lg:col-span-2">
                    <FinancialLiteracy
                      userModulesPageData={userModulesPageData}
                    />
                  </div>
                )}
              </div>
            </MaxWidthContainer>

            <MaxWidthContainer>
              <div className="flex flex-col md:flex-row lg:pt-0 gap-[1.5rem]">
                {userModulesPageData?.keyModulesChapterSection && (
                  <div className="lg:w-[66%] w-full flex flex-col gap-[2rem]">
                    <SteperAccordian
                      userModulesPageData={userModulesPageData}
                    />
                  </div>
                )}
                {profileCompletionPhase === true && (
                  <div className="lg:w-[32%] w-full flex flex-col gap-[2rem]">
                    <Certificate />
                  </div>
                )}
              </div>
            </MaxWidthContainer>
          </div>
        </>
      )}

      {isTimeTakeModal && (
        <TimeToTakeBreakModal setIsTimeTakeModal={setIsTimeTakeModal} />
      )}

      {sessionTimeModal && <SessionTimeoutModal />}
    </>
  );
};

export default page;
