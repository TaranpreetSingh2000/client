import SubmissionModalIcon from "../../../public/SubmissionModalIcon.svg";

const SubmissionSucess = ({
  setIsOpen,
  successMessage,
  setIsModalOpen,
  descriptionMessage,
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="z-999 h-screen bg-[#0000008A] w-screen fixed top-0 left-0 flex justify-between items-center p-4"
    >
      <div className="bg-[#fdf3da] rounded-2xl text-center max-w-[400px] h-[400px] w-full mx-auto py-6 md:py-10 lg:py-20 px-5 md:px-[55px] flex flex-col justify-center items-center">
        {/* Close Button */}

        {/* Badge */}
        <div className="flex justify-center items-center mb-[26px]">
          <div className="w-full ">
            <img src={SubmissionModalIcon.src} alt="SubmissionModalIcon" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-1 mb-6">
          <h2 className="text-xl  font-medium text-black">
            {successMessage.message ? successMessage.message : successMessage}
          </h2>
        </div>

        {descriptionMessage && (
          <p className="text-gray-600 text-sm font-medium">
            {descriptionMessage}
          </p>
        )}

        <div>
          <button
            onClick={() => {
              setIsOpen(false);
              if (setIsModalOpen) {
                setIsModalOpen(false);
              }
            }}
            className="default-btn cursor-pointer my-6 text-sm text-white px-14 py-3 rounded-full font-semibold hover:bg-[#ad0f22] transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSucess;
