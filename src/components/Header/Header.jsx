"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import largeScreenLogo from "../../../public/aditya-birla-capital.webp";
import smallScreenLogo from "../../../public/ABCD_LOGO.webp";
import _map from "lodash/map";
import Button from "../Button/Button";

const Header = ({ headerData }) => {
  const { redirectionLogoUrl, desktopLogo, mobileLogo, nav } = headerData;
  const [isActiveIndex, setIsActiveIndex] = useState(null);

  useEffect(() => {
    if (!nav?.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "40px 0px -10% 0px",
      threshold: 0.3,
    };

    const sectionElements = _map(nav, (item) =>
      document.getElementById(item.url?.replace("#", "")),
    ).filter((el) => el !== null);

    if (!sectionElements?.length) return;

    const handleIntersect = (entries) => {
      let found = false;

      entries.forEach((entry) => {
        if (entry.isIntersecting && !found) {
          const index = nav.findIndex(
            (item) => item?.url === `#${entry.target.id}`,
          );
          if (index !== -1) {
            setIsActiveIndex(index);
            found = true;
          }
        }
      });

      if (!found) {
        setIsActiveIndex(null);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, [nav]);

  return (
    <header className="sticky top-0 z-999 bg-white shadow-md">
      <div className="header-container max-w-[var(--breakpoint-large)] mx-auto flex items-center w-full">
        {/* Logo Section */}
        <div className="logo_container flex items-center justify-center md:justify-start bg-white w-33 md:w-[15%]">
          <Link
            href={redirectionLogoUrl ? redirectionLogoUrl : "/"}
            className="max-md:hidden md:h-[50px] lg:h-[64px]"
            aria-label={desktopLogo?.alternativeText}
          >
            {desktopLogo ? (
              <img
                src={desktopLogo?.url}
                alt={desktopLogo?.alternativeText || "image"}
                className="object-contain h-full w-full"
              />
            ) : (
              <img
                src={largeScreenLogo?.src}
                alt="Logo"
                className="object-contain h-full w-full"
              />
            )}
          </Link>
          <Link
            href={redirectionLogoUrl ? redirectionLogoUrl : "/"}
            className=" md:hidden w-[94px] h-[50px]"
            aria-label="Homepage"
          >
            {mobileLogo ? (
              <img
                src={mobileLogo?.url}
                alt={mobileLogo?.alternativeText || "image"}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={smallScreenLogo?.src}
                alt="Logo"
                className="object-contain h-full w-full"
              />
            )}
          </Link>
        </div>

        {/* Desktop Navigation Links */}

        <nav
          className="links-container bg-primary-200 w-full rounded-bl-2xl md:px-6 py-3 md:py-4 md:min-h-16 flex flex-1 justify-end md:justify-between items-center "
          aria-label="Main Navigation"
        >
          <ul className="hidden md:flex gap-5 lg:gap-6 ">
            {_map(nav, (item, index) => (
              <li
                key={index}
                className={`max-md:text-md mr-0 font-medium transition-all ease-in duration-400 ${isActiveIndex === index ? "text-white" : "text-default"}`}
                onClick={() => setIsActiveIndex(index)}
              >
                <Link
                  href={item?.url ? item?.url : "#"}
                  target={item?.openInNewTab ? "_blank" : "_self"}
                  aria-label={item?.title}
                  onClick={(e) => {
                    if (item?.url == "#" || item?.url == null) {
                      e.preventDefault();
                    }
                  }}
                >
                  {item?.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Call-to-Action Buttons */}
          <div className="flex gap-2 pr-4 md:pr-0">
            {_map(headerData?.cta, (item, index) => (
              <Button
                key={index}
                buttonData={item}
                extraClasses="px-3 py-2 md:px-5 md:py-1.5 text-[10px] md:text-sm font-bold"
              ></Button>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <nav
        className="mobile-navigation md:hidden py-5 px-3 border-t border-b border-gray-300 bg-white mobile-navigation"
        aria-label="Mobile Navigation"
      >
        <ul className="flex justify-around items-center gap-4 text-[#000000B2]">
          {headerData?.nav?.length &&
            _map(headerData?.nav, (item, index) => (
              <li
                key={index}
                className="text-center text-sm font-medium mr-0 whitespace-nowrap"
              >
                <Link
                  onClick={(e) => {
                    if (item?.url == "#" || item?.url == null) {
                      e.preventDefault();
                    }
                  }}
                  href={item?.url ? item?.url : "#"}
                  target={item.openInNewTab ? "_blank" : "_self"}
                  aria-label={item?.title}
                >
                  {item?.title}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
