import { useEffect } from "react";
import chip from "../assets/images/chip.png";
import person from "../assets/images/person.png";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchChips } from "../store/slices/game";

const UserInfo = () => {
  const { loggedUserInfo } = useAppSelector((state) => state.auth);
  const { totalChips } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchChips());
  }, [dispatch]);

  return (
    <div className="h-[5rem] flex space-x-4 text-white font-bold">
      <img src={person} className="border-2 h-full z-[20] rounded-xl" />

      <div>
        <span>{loggedUserInfo?.userName}</span>
        <div className="flex items-center space-x-2">
          <img src={chip} className="w-4 h-4" />
          <span>{totalChips}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
