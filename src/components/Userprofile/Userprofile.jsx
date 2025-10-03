import editIcon from "../../../public/modules/editIcon.svg";
import avatar from "../../../public/modules/avatar.svg";

const Userprofile = ({ userProfileDetails, setIsModalOpen }) => {
  return (
    <div
      className="flex w-full bg-white border-2 border-white rounded-[20px] bg-[url('/modules/mobileRound123.png')] lg:bg-[url('/modules/round.jpg')] bg-no-repeat lg:bg-left-top bg-cover  h-full md:h-[unset]
 "
    >
      <div className="flex lg:flex-row flex-col gap-4 md:gap-[52px] py-[24px] px-5 lg:px-12 items-center w-full">
        <div className="relative w-[115px] h-[115px] md:w-[177px] md:h-[177px]">
          <span>
            <img
              src={userProfileDetails?.userProfileImage?.url || avatar.src}
              alt="Profile Image not available"
              className="rounded-full w-full h-full object-cover"
            />
          </span>
          <span
            className="absolute w-10 h-10 bottom-[15px] right-[-11px] md:bottom-4 md:right-0 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <img src={editIcon.src} alt="" />
          </span>
        </div>
        <div className="flex flex-col space-y-1 text-center lg:text-left">
          <h1 className="font-medium text-[26px] leading-[30px] break-all">
            {userProfileDetails?.name}
          </h1>

          <div className="details mt-2">
            <p className="font-normal text-[12px] leading-[20px] text-[#5D6167]">
              {userProfileDetails?.companyName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userprofile;
