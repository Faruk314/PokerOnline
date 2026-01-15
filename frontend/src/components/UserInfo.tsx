import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import chip from "../assets/images/chip.png";
import person from "../assets/images/person.png";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchChips } from "../store/slices/game";

const UserInfo = () => {
  const { loggedUserInfo } = useAppSelector((state) => state.auth);
  const { totalCoins } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchChips());
  }, [dispatch]);

  return (
    <div className="flex items-center space-x-4 text-white">
      {/* User Avatar */}
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/30 to-red-500/30 rounded-2xl blur-md"></div>
        <img
          src={person}
          className="relative h-16 w-16 border-2 border-white/20 rounded-xl shadow-2xl"
          alt="User Avatar"
        />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white"></div>
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
            {loggedUserInfo?.userName}
          </h3>
          <div className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full">
            PLAYER
          </div>
        </div>

        {/* Chip Balance */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 shadow-lg">
          <div className="relative">
            <img src={chip} className="w-6 h-6" alt="Chip" />
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {totalCoins?.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400">CHIPS</span>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="relative group ml-2 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 shadow-[0_0_15px_rgba(202,138,4,0.4)] hover:shadow-[0_0_25px_rgba(202,138,4,0.6)] hover:scale-110 transition-all duration-300 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <span className="relative text-white font-bold text-2xl">+</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
