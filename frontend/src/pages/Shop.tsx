import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchShopPackages } from "../store/slices/shop";
import Loader from "../components/Loader";
import ShopCard from "../components/ShopCard";

const Shop = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const shopLoading = useAppSelector((state) => state.shop.isLoading);
  const shopPackages = useAppSelector((state) => state.shop.shopPackages);

  useEffect(() => {
    dispatch(fetchShopPackages());
  }, [dispatch]);

  return (
    <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-y-auto overflow-x-hidden relative">
      {/* Animated Background Elements */}
      <Loader isLoading={shopLoading} />
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
        <div className="px-3 py-2 md:px-6 md:py-4 border-b border-white/10 bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <div className="flex items-center gap-3 md:gap-6">
                <button
                  onClick={() => navigate("/menu")}
                  className="relative group px-3 py-2 md:px-4 md:py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <IoArrowBack className="relative text-xl md:text-2xl text-gray-400 group-hover:text-yellow-400 transition-colors" />
                </button>

                <div className="hidden md:flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                  <h2 className="text-2xl font-black text-white">
                    THE{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                      STORE
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-visible">
        <div className="h-full flex flex-col items-center justify-start md:justify-center px-2 py-4 md:px-4 md:py-8">
          <div className="relative w-full max-w-6xl">
            {/* Page Header */}
            <div className="text-center mb-6 md:mb-12">
              <div className="inline-flex items-center gap-2 md:gap-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2 md:px-8 md:py-4 mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                  <h1 className="text-2xl md:text-4xl font-black text-white">
                    THE{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                      STORE
                    </span>
                  </h1>
                </div>
              </div>
              <p className="text-gray-400 text-sm md:text-lg">
                Boost your bankroll with premium chips
              </p>
            </div>

            {/* Grid Container with Enhanced Styling */}
            <div className="relative">
              {/* Animated Border Glow */}
              <div className="absolute -inset-8 bg-gradient-to-r from-yellow-600 via-red-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-gradient-x"></div>

              {/* Main Content */}
              <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-3xl border border-white/10 p-4 md:p-8 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-10 gap-4">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      Available Packages
                    </h2>
                    <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
                      Select your perfect chip package
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 bg-gray-900/50 px-3 py-2 rounded-full border border-white/5">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-semibold text-xs md:text-sm">Live Offers</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                  {shopPackages.map((shopPackage, index) => (
                    <div
                      key={shopPackage.packageId}
                      className="transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 h-full"
                    >
                      <ShopCard shopPackage={shopPackage} index={index} />
                    </div>
                  ))}
                </div>

                {/* Footer Note */}
                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                  <p className="text-gray-400 text-sm">
                    <span className="text-yellow-500 font-semibold">
                      Secure checkout
                    </span>{" "}
                    • Instant delivery • 24/7 Support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-20">
        <div className="bg-gradient-to-r from-yellow-600 to-red-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-2xl flex items-center gap-2 md:gap-3 animate-bounce">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white animate-pulse"></div>
          <span className="font-bold text-xs md:text-sm">Limited Time Offers</span>
        </div>
      </div>
    </section>
  );
};

export default Shop;
