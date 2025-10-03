"use client";

import modalGenerator from "@/utils/modalGenerator";
import React, { useState } from "react";
import BaseButton from "./BaseButton";
import ReactDOM from "react-dom";

const Button = React.memo(({ buttonData, extraClasses, onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shouldRenderModal = buttonData?.action?.endsWith("modal");

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {buttonData?.action?.endsWith("modal") ? (
        <>
          <BaseButton
            variant={buttonData?.variant}
            action={buttonData?.action}
            href={buttonData?.url}
            target={buttonData?.openInNewTab}
            label={buttonData?.title}
            imgSrc={buttonData?.icon?.url}
            className={extraClasses ?? extraClasses}
            onClick={handleModal}
          ></BaseButton>
          {shouldRenderModal &&
            isModalOpen &&
            typeof window !== "undefined" &&
            ReactDOM.createPortal(
              modalGenerator(buttonData?.action, setIsModalOpen, isModalOpen),
              document.getElementById("modal-root"),
            )}
        </>
      ) : (
        <BaseButton
          variant={buttonData?.variant}
          action={buttonData?.action}
          href={buttonData?.url}
          target={buttonData?.openInNewTab}
          label={buttonData?.title}
          imgSrc={buttonData?.icon?.url}
          className={extraClasses ?? extraClasses}
          onClick={onClick}
        ></BaseButton>
      )}
    </>
  );
});

export default Button;
