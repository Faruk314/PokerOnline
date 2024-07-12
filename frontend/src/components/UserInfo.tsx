import chip from "../assets/images/chip.png";
import person from "../assets/images/person.png";
import { useAppSelector } from "../store/hooks";

const UserInfo = () => {
  const { loggedUserInfo } = useAppSelector((state) => state.auth);

  return (
    <div className="h-[5rem] flex space-x-4 text-white font-bold">
      <img src={person} className="border-2 h-full z-[20] rounded-xl" />

      <div>
        <span>{loggedUserInfo?.userName}</span>
        <div className="flex items-center space-x-2">
          <img src={chip} className="w-4 h-4" />
          <span>13,000,000</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
