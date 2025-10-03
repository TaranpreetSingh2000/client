"use client";
import { useEffect, useState } from "react";

const TestimonialCard = ({ floatingCardData }) => {
  const { sucessStoryInnerCardSection } = floatingCardData;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("down");
  const [visible, setVisible] = useState({
    image: true,
    title: true,
    desc: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % sucessStoryInnerCardSection?.length;
      const goingDown = nextIndex > index;
      setDirection(goingDown ? "down" : "up");

      // Fade out all together
      setVisible({ image: false, title: false, desc: false });

      // After fade out, change data and fade in
      setTimeout(() => {
        setIndex(nextIndex);
        setVisible({ image: true, title: true, desc: true });
      }, 500); // match timing with transition
    }, 4000); // slower loop for relaxed feel

    return () => clearInterval(interval);
  }, [index]);

  const { icon, title, tag, description } = sucessStoryInnerCardSection[index];

  // 🔥 Smoothened animation with natural easing
  const transitionStyle = (isVisible, delay = 0) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translateY(0)"
      : `translateY(${direction === "down" ? "-10px" : "10px"})`,
    transition: `opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
    overflow: "hidden",
  });
  return (
    <div
      className="relative flex items-start gap-[12px] p-4 rounded-[20px] border-[0.75px] backdrop-blur-[8px]"
      style={{
        width: "364px",
        minHeight: "150px",
        backgroundColor: "#E0E0E066",
        borderColor: "#E0E0E066",
      }}
    >
      <div
        style={transitionStyle(visible.image, 0)}
        className="w-[52px] h-[52px] overflow-hidden rounded-full"
      >
        <img
          src={icon?.url}
          alt={icon?.alternativeText}
          width={52}
          height={52}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col overflow-hidden">
        <div
          className="overflow-hidden"
          style={{
            ...transitionStyle(visible.title, 100),
            width: "268px",
            height: "36px",
            marginBottom: "4px",
          }}
        >
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{tag}</p>
        </div>

        <p
          className="text-gray-700 text-xs overflow-hidden"
          style={{
            ...transitionStyle(visible.desc, 200),
            width: "268px",
            minHeight: "72px",
            marginTop: "4px",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;
