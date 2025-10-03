"use client";
import Link from "next/link";
import ABCD_LOGO from "../../../public/ABCD_LOGO.webp";
import _map from "lodash/map";
import BaseButton from "../Button/BaseButton";
import TimeToTakeBreakModal from "../Modals/TimeToTakeBreakModal";
import { useState } from "react";

const ProfileHeader = ({ profileHeaderData }) => {
  const { desktopLogo, mobileLogo, redirectionLogoUrl, cta } =
    profileHeaderData;

  const [logoutConfirmationModal, setLogoutConfirmationModal] = useState(false);

  const handleProfileLogout = () => {
    setLogoutConfirmationModal(true);
  };

  return (
    <>
      <header className="profile-header sticky top-0 z-999 bg-white shadow-md">
        <div className="header-container max-w-[var(--breakpoint-large)] mx-auto flex items-center w-full">
          {/* Logo Section */}
          <div className="logo_container flex items-center justify-center bg-white w-33 md:w-[15%]">
            <Link
              href={redirectionLogoUrl ? redirectionLogoUrl : "/"}
              className="max-md:hidden md:h-[50px] lg:h-[64px]"
            >
              {desktopLogo ? (
                <img
                  src={desktopLogo?.url}
                  alt={desktopLogo?.alternativeText || "logo"}
                  className="object-contain h-full w-full"
                />
              ) : (
                <img
                  src={ABCD_LOGO.src}
                  alt="logo"
                  className="object-contain h-full w-full"
                />
              )}
            </Link>

            <Link
              href={redirectionLogoUrl ? redirectionLogoUrl : "/"}
              className="md:hidden max-md:w-[94px] max-md:h-[50px]"
            >
              {mobileLogo ? (
                <img
                  src={mobileLogo?.url}
                  alt={mobileLogo?.alternativeText || "logo"}
                  className="object-contain h-full w-full"
                />
              ) : (
                <img
                  src={ABCD_LOGO.src}
                  alt="logo"
                  className="object-contain h-full w-full"
                />
              )}
            </Link>
          </div>
          <nav className="links-container bg-primary-200 w-full rounded-bl-2xl px-4 md:px-14 py-3 md:py-4 md:min-h-16 flex flex-1 justify-end items-center ">
            {/* Call-to-Action Buttons */}
            <div className="flex gap-2 pr-4 md:pr-0">
              {_map(cta, (item, index) => (
                <BaseButton
                  key={index}
                  variant={item?.variant}
                  action={item?.action}
                  href={item?.url}
                  target={item?.openInNewTab}
                  label={item?.title}
                  imgSrc={item?.icon?.url}
                  className="px-5 py-2 md:px-6 md:py-1.6 text-[10px] md:text-sm font-bold"
                  onClick={handleProfileLogout}
                />
              ))}
            </div>
          </nav>
        </div>
      </header>

      {logoutConfirmationModal && (
        <TimeToTakeBreakModal setIsTimeTakeModal={setLogoutConfirmationModal} />
      )}
    </>
  );
};

export default ProfileHeader;
