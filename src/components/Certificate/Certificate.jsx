"use client";

import { useState } from "react";

const Certificate = () => {
  const totalModules = 5;
  const [completedModules, setCompletedModules] = useState(2);

  const handleContinue = () => {
    if (completedModules < totalModules) {
      setCompletedModules((prev) => prev + 1);
    }
  };

  const progressPercent = (completedModules / totalModules) * 100;

  return (
    <div className=" w-auto bg-white rounded-[20px] shadow-lg p-7.5 flex flex-col items-center ">
      <h2 className="font-medium text-[24px] leading-[32px] mb-2">
        {completedModules}/{totalModules} Modules are completed
      </h2>
      <p
        className="text-[#BDBDBD] font-medium text-[16px] leading-[32px]
"
      >
        Complete all modules to earn your certificate.
      </p>
      <img
        src="/modules/Certificate.svg"
        alt="Certificate"
        className="w-full mb-4 rounded shadow"
      />
      <p className="text-[#BDBDBD] font-medium text-[12px] leading-[32px] mb-2">
        Literacy Certificate
      </p>
      <div className="w-full md:w-[258px] bg-[#F2F1F1] rounded-full h-[7px] mb-4">
        <div
          className="bg-[#70B865] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <button
        onClick={handleContinue}
        disabled={completedModules === totalModules}
        className="font-bold text-[12px] leading-[100%] text-primary-100 w-full cursor-pointer flex items-center justify-center h-[40px] rounded-[70px] border border-solid border-primary-100 p-[10px] hover:bg-[#a71627] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {completedModules === totalModules ? "COMPLETED" : "CONTINUE LEARNING"}
      </button>
    </div>
  );
};

export default Certificate;
