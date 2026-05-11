import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSideBar";
import SideBar from "../components/SideBar";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen sm:px-[10%] sm:py-[5%] py-8 px-10">
      <div
        className={`border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid relative
        ${
          selectedUser
            ? "grid-cols-1 md:grid-cols-[1fr_2fr_1fr]"
            : "grid-cols-1 md:grid-cols-[1fr_2fr]"
        }`}
      >
        <SideBar />
        <ChatContainer />
        {selectedUser && <RightSideBar />}
      </div>
    </div>
  );
};

export default HomePage;