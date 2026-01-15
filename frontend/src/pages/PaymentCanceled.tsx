import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoRefresh } from "react-icons/io5";
import { FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[24rem] h-[24rem] max-w-96 max-h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] max-w-96 max-h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[40rem] h-full max-h-[40rem] bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-10 animate-bounce delay-300"></div>
        <div className="absolute bottom-1/3 right-1/5 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full opacity-10 animate-bounce delay-700"></div>
        <div className="absolute top-2/3 left-2/3 w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full opacity-10 animate-bounce delay-1200"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-white/10 bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigate("/menu")}
                  className="relative group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-red-500/30 transition-all duration-300"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <IoArrowBack className="relative text-xl text-gray-400 group-hover:text-red-400 transition-colors" />
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400 group-hover:from-red-300 group-hover:to-red-400 transition-all duration-300">
                    BACK TO MENU
                  </span>
                </button>

                <div className="hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">⚠️</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      Payment Canceled
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-gray-300 text-sm">
                    Transaction Canceled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            {/* Canceled Card */}
            <div className="relative w-full max-w-2xl">
              {/* Animated Border Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-3xl blur-2xl opacity-20 animate-gradient-x"></div>

              {/* Main Card */}
              <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
                {/* Canceled Icon */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute -inset-6 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-red-500 to-orange-600 flex items-center justify-center border-8 border-gray-900/50">
                      <FaTimesCircle className="text-6xl text-white" />
                    </div>
                  </div>
                </div>

                {/* Canceled Message */}
                <div className="text-center mb-10">
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                    PAYMENT{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600">
                      CANCELED
                    </span>
                  </h1>
                  <p className="text-gray-400 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
                    Your payment was canceled. No charges have been made to your
                    account.
                  </p>
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-gray-300">
                        Transaction Canceled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Common Issues */}
                <div className="mb-10">
                  <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                      <FaExclamationTriangle className="text-orange-500" />
                      Common Reasons for Cancellation
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                        <span className="text-gray-300">
                          Insufficient funds in your account
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                        <span className="text-gray-300">
                          Payment method declined by your bank
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                        <span className="text-gray-300">
                          Incorrect payment details entered
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                        <span className="text-gray-300">
                          Transaction timed out
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={() => navigate("/menu")}
                    className="relative group px-8 py-4 rounded-xl text-white text-base font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-gray-900/80 to-gray-950/80 border border-white/10 hover:border-red-500/30 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-3">
                      <IoArrowBack className="text-xl" />
                      BACK TO MENU
                    </span>
                  </button>

                  <button
                    onClick={() => navigate("/shop")}
                    className="relative group px-8 py-4 rounded-xl text-white text-base font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-3">
                      <IoRefresh className="text-xl" />
                      RETURN TO SHOP
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
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="relative z-10 border-t border-white/10 bg-gradient-to-t from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-600 text-sm">
              Payment canceled • No charges were made to your account
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-gray-300 text-sm">
                  Transaction ID: {Date.now().toString(36).toUpperCase()}
                </span>
              </div>
              <div className="text-gray-600 text-sm">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentCanceled;
