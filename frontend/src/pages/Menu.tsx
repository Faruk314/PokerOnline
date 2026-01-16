import { useContext, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import UserInfo from "../components/UserInfo";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Logo from "../components/Logo";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout, reset } from "../store/slices/auth";
import toast from "../utils/toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import pokerLogo from "../assets/images/pokerlogo.png";
import { RiLogoutCircleRFill } from "react-icons/ri";

const Menu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { volumeOn, handleVolume } = useContext(AudioContext);
  const { isLoading, isError, isSuccess } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.showPokerError("There was a problem while logging out");
    }

    if (isSuccess) {
      navigate("/");
    }

    dispatch(reset());
  }, [isError, isSuccess, dispatch, navigate]);

  const handleExit = () => {
    dispatch(logout());
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-2xl blur-xl opacity-50"></div>
            <UserInfo />
          </div>

          <button
            onClick={handleVolume}
            className="relative group bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-xl border border-white/10 rounded-xl p-3 hover:scale-110 transition-all duration-300 shadow-2xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative text-2xl">
              {volumeOn ? (
                <FaVolumeUp className="text-yellow-400 group-hover:text-yellow-300 transition-colors" />
              ) : (
                <FaVolumeMute className="text-gray-400 group-hover:text-gray-300 transition-colors" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl px-4">
        {/* Logo Section */}
        <div className="relative mb-12 text-center">
          <div className="absolute -inset-8 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-full blur-3xl opacity-30"></div>
          <Logo />
        </div>

        {/* Menu Cards Container */}
        <div className="relative">
          {/* Animated Border Glow */}
          <div className="absolute -inset-6 bg-gradient-to-r from-yellow-600 via-red-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-gradient-x"></div>

          {/* Glassmorphism Container */}
          <div className="relative bg-gradient-to-b from-gray-900/50 to-gray-950/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-white mb-2">
                WELCOME TO THE{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  POKER ONLINE
                </span>
              </h1>
              <p className="text-gray-400 text-lg">Choose your next move</p>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Game Card */}
              <div className="group">
                <button
                  onClick={() => navigate("/create")}
                  className="relative w-full h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-red-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative h-full flex flex-col items-center justify-center p-6">
                    <div className="relative mb-6">
                      <div className="absolute -inset-6 bg-gradient-to-r from-yellow-500/30 to-red-500/30 rounded-full blur-2xl"></div>
                      <img
                        src={pokerLogo}
                        className="relative top-3 h-12 w-12 drop-shadow-2xl animate-pulse"
                        alt="Poker Logo"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Create Game
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Create your own poker table
                    </p>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Join Game Card */}
              <div className="group">
                <button
                  onClick={() => navigate("/join")}
                  className="relative w-full h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative h-full flex flex-col items-center justify-center p-6">
                    <div className="mb-4 text-4xl">👥</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Join Game
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Browse available tables
                    </p>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Shop Card */}
              <div className="group">
                <button
                  onClick={() => navigate("/shop")}
                  className="relative w-full h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/10 hover:border-green-500/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative h-full flex flex-col items-center justify-center p-6">
                    <div className="mb-4 text-4xl">💰</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Shop</h3>
                    <p className="text-gray-400 text-sm">Buy chips & items</p>

                    <div className="absolute top-4 right-4">
                      <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-30"></div>
                        <span className="relative">HOT</span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Exit Card */}
              <div className="group">
                <button
                  onClick={handleExit}
                  className="relative w-full h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative h-full flex flex-col items-center justify-center p-6">
                    <div className="mb-4 text-5xl">
                      <RiLogoutCircleRFill className="text-red-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Exit</h3>
                    <p className="text-gray-400 text-sm">
                      Leave the poker room
                    </p>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chips Animation */}
      <div className="fixed bottom-8 left-8 z-20 opacity-20">
        <div className="flex space-x-2 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
