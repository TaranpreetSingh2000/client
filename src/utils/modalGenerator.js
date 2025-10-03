import LoginModal from "@/components/Modals/LoginWrapper";
import OurExpertModal from "@/components/Modals/OurExpertModal";

const modalGenerator = (modalType, setIsModalOpen, isModalOpen) => {
  switch (modalType) {
    case "login_modal":
      return (
        <LoginModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
      );
    case "Ask_Expert_modal":
      return <OurExpertModal setIsModalOpen={setIsModalOpen} />;
    default:
      return null;
  }
};

export default modalGenerator;
