"use client";
import Link from "next/link";

const BaseButton = ({
  variant = "default",
  href = "#",
  onClick,
  label,
  imgSrc,
  imgAlt = "button image",
  className = "",
  target = false,
  action = "link",
}) => {
  const baseStyles =
    "rounded-full flex justify-center items-center md:gap-2 gap-1 cursor-pointer";
  const outlineStyles = "outline-btn";
  const bgWhiteStyles = "bgWhite-btn";
  const defaultBtn = "default-btn";

  const typeStyles = {
    outline: `${baseStyles} ${outlineStyles}`,
    white_background: `${baseStyles} ${bgWhiteStyles}`,
    default: `${baseStyles} ${defaultBtn}`,
  };

  const finalClass = `${typeStyles[variant] || ""} ${className}`.trim();

  const buttonContent = (
    <>
      {imgSrc && (
        <img src={imgSrc} alt={imgAlt} className="h-4 w-4 object-contain" />
      )}
      <span>{label}</span>
    </>
  );
  if (action == "link") {
    return (
      <Link
        href={href == null ? "#" : href}
        target={target ? "_blank" : "_self"}
        className={finalClass}
        onClick={(e) => {
          if (href == "#" || href == null) {
            e.preventDefault();
          }
        }}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={finalClass}>
      {buttonContent}
    </button>
  );
};

export default BaseButton;
