import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoHome, IoSearch } from "react-icons/io5";
import {
  FaExclamationTriangle,
  FaMapSigns,
  FaQuestionCircle,
} from "react-icons/fa";
import Logo from "../components/Logo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Poker Chips */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full opacity-10 animate-bounce delay-300"></div>
        <div className="absolute bottom-1/3 right-1/5 w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-10 animate-bounce delay-700"></div>
        <div className="absolute top-2/3 left-2/3 w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full opacity-10 animate-bounce delay-1200"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10">
        <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigate("/")}
                  className="relative group px-4 py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <IoHome className="relative text-2xl text-gray-400 group-hover:text-yellow-400 transition-colors" />
                </button>

                <div className="hidden md:flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                  <h2 className="text-2xl font-black text-white">
                    PAGE{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                      NOT FOUND
                    </span>
                  </h2>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                  <span className="text-gray-300 text-sm">
                    Navigation Error
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center px-4 py-8">
          <div className="relative w-full max-w-6xl">
            {/* Page Header with Logo */}
            <div className="text-center mb-12">
              <Logo />
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                  <h1 className="text-4xl font-black text-white">
                    PAGE{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                      NOT FOUND
                    </span>
                  </h1>
                </div>
              </div>
              <p className="text-gray-400 text-lg">
                Oops! The page you're looking for seems to have vanished into
                the digital void.
              </p>
            </div>

            {/* Grid Container with Enhanced Styling */}
            <div className="relative">
              {/* Animated Border Glow */}
              <div className="absolute -inset-8 bg-gradient-to-r from-yellow-600 via-red-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-gradient-x"></div>

              {/* Main Content */}
              <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                {/* 404 Display */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute -inset-8 bg-gradient-to-r from-yellow-500/30 to-red-500/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative">
                      <div className="text-[8rem] md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 leading-none">
                        404
                      </div>
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        <FaExclamationTriangle className="text-4xl text-red-500 animate-bounce" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-3 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                      <span className="text-gray-300">
                        Navigation Error Detected
                      </span>
                    </div>
                  </div>
                </div>

                {/* Possible Reasons */}
                <div className="mb-10">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                      <FaQuestionCircle className="text-yellow-400" />
                      What might have happened?
                    </h3>
                    <p className="text-gray-400">
                      The page could be missing or you might have followed a
                      broken link
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-yellow-500/30 transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 mb-4">
                        <span className="text-3xl">🔗</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        Broken Link
                      </h4>
                      <p className="text-gray-400 text-sm">
                        The link you followed may be outdated or incorrect
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-red-500/30 transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 mb-4">
                        <FaMapSigns className="text-3xl text-red-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        Wrong Address
                      </h4>
                      <p className="text-gray-400 text-sm">
                        You might have typed the URL incorrectly
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/30 transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 mb-4">
                        <IoSearch className="text-3xl text-amber-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        Page Moved
                      </h4>
                      <p className="text-gray-400 text-sm">
                        The page might have been moved or deleted
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={() => navigate(-1)}
                    className="relative group px-8 py-4 rounded-xl text-white text-base font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-gray-900/80 to-gray-950/80 border border-white/10 hover:border-yellow-500/30 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-3">
                      <IoArrowBack className="text-xl" />
                      GO BACK
                    </span>
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="relative group px-8 py-4 rounded-xl text-white text-base font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-3">
                      <IoHome className="text-xl" />
                      GO TO HOMEPAGE
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Footer Note */}
                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                  <p className="text-gray-400 text-sm">
                    <span className="text-yellow-500 font-semibold">
                      Poker Online
                    </span>{" "}
                    • Premium Tables • 24/7 Support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
