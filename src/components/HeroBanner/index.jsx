"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Button from "../Button/Button";
import _map from "lodash/map";
import MaxWidthContainer from "../MaxWidthContainer/MaxWidthContainer";
import colorGenerator from "@/utils/colorGenerator";
import { HERO_BANNER_COLOR_CODES } from "@/constants/constant";

const HeroBanner = ({
  heroBannerData,
  bannerKeyframeData,
  bannerWidthData,
}) => {
  const [order, setOrder] = useState([]);
  const [resetKey, setResetKey] = useState(Date.now());
  const [screenWidth, setScreenWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );
  const [isMounted, setIsMounted] = useState(false);
  const intervalRef = useRef(null);

  const data = useMemo(() => ({ heroBannerData }), []);

  const fontSizes = ["28px", "32px", "42px", "52px", "62px", "78px"];
  const breakpoints = [350, 640, 768, 1024, 1280, Infinity];
  const lineHeights = {
    "28px": "34px",
    "32px": "38px",
    "42px": "50px",
    "52px": "62px",
    "62px": "74px",
    "78px": "90px",
  };
  const imageSizes = {
    "28px": "27px",
    "32px": "30px",
    "42px": "38px",
    "52px": "48px",
    "62px": "58px",
    "78px": "74px",
  };

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.pathname);
    };

    const handleOnLoad = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    // Push initial state to avoid accidental back navigation
    window.history.pushState(null, "", window.location.pathname);

    // Listen to popstate and hashchange
    window.addEventListener("popstate", handleBackButton);
    window.addEventListener("hashchange", handleBackButton);
    window.addEventListener("pageshow", handleOnLoad);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
      window.removeEventListener("hashchange", handleBackButton);
      window.removeEventListener("pageshow", handleOnLoad);
    };
  }, []);

  const fontSize = useMemo(() => {
    return fontSizes.find((_, i) => screenWidth < breakpoints[i]) || "78px";
  }, [screenWidth]);
  const containerWidth = order?.length ? order[0] : 0;
  const keyframes = bannerKeyframeData[fontSize];
  const lineHeight = lineHeights[fontSize];
  const imageSize = imageSizes[fontSize];
  const items = data?.heroBannerData?.slider;

  const updatedItemsData = colorGenerator(
    data?.heroBannerData?.slider,
    HERO_BANNER_COLOR_CODES,
  );

  useEffect(() => {
    setIsMounted(true);
    setScreenWidth(window.innerWidth);

    const handleResize = () => setScreenWidth(window.innerWidth);
    const updateOrderAndInterval = () => {
      const widths = _map(
        bannerWidthData[fontSize],
        (item) => item.estimatedWidth,
      );
      const newOrder = widths?.length > 0 && [...widths, widths[0]];

      if (newOrder?.length > 1) {
        setOrder(newOrder);
        if (intervalRef?.current) clearInterval(intervalRef?.current);
        setResetKey(Date?.now());

        intervalRef.current = setInterval(
          () => setOrder((prev) => [...prev?.slice(1), prev[0]]),
          2400,
        );
      }
    };

    updateOrderAndInterval();
    window.addEventListener("resize", handleResize);
    const syncAnimations = () => setTimeout(updateOrderAndInterval, 0);
    document.addEventListener("visibilitychange", syncAnimations);

    return () => {
      clearInterval(intervalRef?.current);
      window?.removeEventListener("resize", handleResize);
      document?.removeEventListener("visibilitychange", syncAnimations);
    };
  }, [fontSize, items]);

  if (!isMounted) {
    return (
      <div className="xl:h-[614px] lg:h-[582px] md:h-[558px] sm:h-[457px] max-[498]:h-[451px] max-[359]:h-[475px] max-[350]:h-[499px] h-[487px] lg:w-full bg-[#FFF7E9]"></div>
    );
  }

  const renderHeadingItem = ({ heading, icon }, isHiddenSm, isFlexSm) => (
    <span
      className={`${
        isHiddenSm ? "flex sm:hidden" : isFlexSm ? "hidden sm:flex" : "flex"
      } items-center gap-2`}
    >
      <span
        className="whitespace-nowrap"
        style={{ fontSize: fontSize, lineHeight: lineHeight }}
      >
        {heading}
      </span>
      {icon && (
        <span
          className="flex items-center justify-center"
          style={{ width: imageSize, height: imageSize }}
        >
          <img className="w-full h-full object-contain" src={icon} alt="icon" />
        </span>
      )}
    </span>
  );

  return (
    <section className="bg-[#FFF7E9]" id="financial-animation">
      <MaxWidthContainer extraClasses="flex flex-col items-center justify-center w-full ">
        {keyframes && <style jsx>{keyframes}</style>}
        <img
          className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px]"
          src={data?.heroBannerData?.media?.url}
          alt={data?.heroBannerData?.media?.alternativeText || "icon"}
          aria-hidden="true"
        />
        <h1
          className="flex flex-col items-center tracking-[-0.04em] font-extralight min-[350px] mx-auto mt-[25px] md:mt-[50px]"
          style={{ fontSize: fontSize, lineHeight: lineHeight }}
        >
          <span className="flex gap-2 md:gap-4 items-end mb-1 md:mb-4">
            <span className="whitespace-nowrap">
              {data?.heroBannerData?.headingVariant1}
            </span>

            <span
              className="flex items-center justify-center"
              style={{ width: imageSize, height: imageSize }}
            >
              <img
                className="w-full h-full object-contain"
                src={data?.heroBannerData?.icon?.url}
                alt={
                  data?.heroBannerData?.icon?.alternativeText ||
                  "hero banner icon"
                }
              />
            </span>

            {renderHeadingItem(
              { heading: data?.heroBannerData?.headingVariant2 },
              false,
              true,
            )}
          </span>
          <span className="flex gap-2">
            {renderHeadingItem(
              { heading: data?.heroBannerData?.headingVariant2 },
              true,
            )}
            {renderHeadingItem(
              { heading: data?.heroBannerData?.headingVariant3 },
              true,
            )}
          </span>
          <span className="flex flex-col gap-2 sm:flex-row items-center overflow-hidden">
            {renderHeadingItem(
              { heading: data?.heroBannerData?.headingVariant3 },
              false,
              true,
            )}
            {order?.length > 0 && order[0] && (
              <span
                key={resetKey}
                className="animate-sequence flex items-center justify-center overflow-hidden transition-all duration-700"
                style={{
                  width: `${containerWidth}px`,
                  height: lineHeight,
                }}
                role="list"
                aria-label="Financial tools list"
              >
                {_map(updatedItemsData, (item, i) => (
                  <span
                    key={i}
                    className={`flex items-center item-${i}`}
                    style={{ height: lineHeight }}
                    role="listitem"
                  >
                    <span
                      className="flex justify-center items-center rounded-lg lg:rounded-2xl overflow-hidden"
                      style={{ width: imageSize, height: imageSize }}
                    >
                      <img
                        src={item?.icon?.url}
                        className="w-full h-full object-contain"
                        alt={item?.icon?.alternativeText}
                      />
                    </span>
                    <span
                      className="font-semibold whitespace-nowrap  ps-2"
                      style={{
                        fontSize: fontSize,
                        lineHeight: lineHeight,
                        color: item?.color,
                      }}
                    >
                      {item?.heading}
                    </span>
                  </span>
                ))}
              </span>
            )}
          </span>
        </h1>
        <div className="flex flex-col gap-10 justify-center items-center max-w-[688px] mt-10">
          <p className="text-center">{data?.heroBannerData?.description}</p>
          <div className="flex gap-2 pr-4 md:pr-0">
            {_map(data?.heroBannerData?.cta, (item, index) => (
              <Button
                key={index}
                buttonData={item}
                extraClasses=" py-[18px] px-11 text-[16px] font-bold"
              ></Button>
            ))}
          </div>
        </div>
      </MaxWidthContainer>
    </section>
  );
};

export default HeroBanner;
