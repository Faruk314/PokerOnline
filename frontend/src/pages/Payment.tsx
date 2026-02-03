import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchShopPackages } from "../store/slices/shop";
import Loader from "../components/Loader";
import CustomCheckout from "../components/CustomCheckout";
import { ShopPackage } from "../types/types";

const Payment = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const shopLoading = useAppSelector((state) => state.shop.isLoading);
  const shopPackages = useAppSelector((state) => state.shop.shopPackages);

  const [selectedPackage, setSelectedPackage] = useState<ShopPackage | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchShopPackages());
  }, [dispatch]);

  useEffect(() => {
    if (shopPackages.length > 0 && packageId) {
      const pkg = shopPackages.find((p) => p.packageId === packageId);
      if (pkg) {
        setSelectedPackage(pkg);
      } else {
        navigate("/shop");
      }
    }
  }, [shopPackages, packageId, navigate]);

  const handleSuccess = () => {
    navigate("/payment-success");
  };

  const handleFailure = () => {
    navigate("/payment-canceled");
  };

  const handleClose = () => {
    navigate("/shop");
  };

  if (!selectedPackage) return null;

  return (
    <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-y-auto overflow-x-hidden relative">
      <Loader isLoading={shopLoading} />

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
        <div className="px-3 py-2 md:px-6 md:py-4 border-b border-white/10 bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <div className="flex items-center gap-3 md:gap-6">
                <button
                  onClick={() => navigate("/shop")}
                  className="relative group px-3 py-2 md:px-4 md:py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <IoArrowBack className="relative text-xl md:text-2xl text-gray-400 group-hover:text-yellow-400 transition-colors" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                  <h2 className="text-sm md:text-2xl font-black text-white">
                    SECURE{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                      CHECKOUT
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-visible pb-8">
        <div className="h-full flex flex-col items-center justify-start md:justify-center px-2 py-4 md:px-4 md:py-8">
          <div className="relative w-full max-w-6xl">
            {/* Page Header */}
            <div className="text-center mb-6 md:mb-12">
              <div className="inline-flex items-center gap-2 md:gap-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2 md:px-8 md:py-4 mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                  <h1 className="text-xl md:text-4xl font-black text-white">
                    SECURE{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                      CHECKOUT
                    </span>
                  </h1>
                </div>
              </div>
              <p className="text-gray-400 text-sm md:text-lg">
                Complete your purchase with confidence
              </p>
            </div>

            {/* Payment Container */}
            <div className="relative">
              {/* Animated Border Glow */}
              <div className="absolute -inset-4 md:-inset-10 bg-gradient-to-r from-yellow-600 via-red-600 to-purple-600 rounded-3xl blur-2xl opacity-15 animate-gradient-x"></div>

              {/* Main Content */}
              <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-3xl border border-white/10 p-4 md:p-10 shadow-2xl">
                {/* Single Column Layout for Better Spacing */}
                <div className="space-y-6 md:space-y-12">
                  {/* Header Section */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 md:gap-4 bg-gradient-to-r from-gray-900/40 to-gray-950/40 border border-white/10 rounded-2xl px-4 py-2 md:px-8 md:py-4 mb-4 md:mb-6">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                        <h1 className="text-lg md:text-3xl font-bold text-white">
                          Complete Your Purchase
                        </h1>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm md:text-lg">
                      You're purchasing{" "}
                      <span className="text-yellow-400 font-semibold">
                        {selectedPackage?.amount.toLocaleString()} chips
                      </span>
                    </p>
                  </div>

                  {/* Main Content Grid - Adjusted Ratios */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10">
                    {/* Left Column - Order & Security */}
                    <div className="lg:col-span-2 space-y-6 md:space-y-10 order-2 lg:order-1">
                      {/* Order Summary */}
                      <div className="bg-gradient-to-b from-gray-900/30 to-gray-950/30 border border-white/10 rounded-2xl p-4 md:p-10">
                        <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-10">
                          <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                          <h2 className="text-lg md:text-2xl font-bold text-white">
                            Order Summary
                          </h2>
                        </div>

                        <div className="space-y-4 md:space-y-8">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h3 className="text-base md:text-xl font-semibold text-white">
                                {selectedPackage.amount.toLocaleString()} Chips
                              </h3>
                              <p className="text-gray-400 text-sm md:text-base mt-1 md:mt-2">
                                Premium Poker Chips
                              </p>
                            </div>
                            <div className="text-left md:text-right">
                              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                ${selectedPackage.price}
                              </div>
                              <div className="text-gray-500 text-xs md:text-base mt-1 md:mt-2">
                                $
                                {(
                                  selectedPackage.price /
                                  (selectedPackage.amount / 1000)
                                ).toFixed(3)}{" "}
                                per 1K chips
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 md:space-y-5 pt-4 md:pt-8 border-t border-white/10">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm md:text-lg">
                                Subtotal
                              </span>
                              <span className="text-white text-sm md:text-lg">
                                ${selectedPackage.price}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm md:text-lg">
                                Processing Fee
                              </span>
                              <span className="text-white text-sm md:text-lg">$0.00</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm md:text-lg">Tax</span>
                              <span className="text-white text-sm md:text-lg">$0.00</span>
                            </div>
                            <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/10">
                              <span className="text-base md:text-xl font-bold text-white">
                                Total Amount
                              </span>
                              <span className="text-xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                ${selectedPackage.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Accepted Cards */}
                      <div className="bg-gradient-to-b from-gray-900/30 to-gray-950/30 border border-white/10 rounded-2xl p-4 md:p-10">
                        <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-10">
                          <h2 className="text-lg md:text-2xl font-bold text-white">
                            Accepted Cards
                          </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-6">
                          <div className="bg-white/10 rounded-xl md:rounded-2xl p-2 md:p-4 flex items-center justify-center hover:bg-white/15 transition-all duration-300">
                            <div className="text-white font-bold text-sm md:text-xl">
                              VISA
                            </div>
                          </div>
                          <div className="bg-white/10 rounded-xl md:rounded-2xl p-2 md:p-4 flex items-center justify-center hover:bg-white/15 transition-all duration-300">
                            <div className="text-white font-bold text-sm md:text-xl">
                              MasterCard
                            </div>
                          </div>
                          <div className="bg-white/10 rounded-xl md:rounded-2xl p-2 md:p-4 flex items-center justify-center hover:bg-white/15 transition-all duration-300">
                            <div className="text-white font-bold text-sm md:text-xl">
                              AMEX
                            </div>
                          </div>
                          <div className="bg-white/10 rounded-xl md:rounded-2xl p-2 md:p-4 flex items-center justify-center hover:bg-white/15 transition-all duration-300">
                            <div className="text-white font-bold text-sm md:text-xl">
                              Discover
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-8 text-center">
                          <p className="text-gray-300 text-xs md:text-base">
                            <span className="text-yellow-500 font-bold">
                              Powered by Stripe
                            </span>{" "}
                            • Industry leader in payment security
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Payment Form (3/5 width) */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                      <div className="bg-gradient-to-b from-gray-900/30 to-gray-950/30 border border-white/10 rounded-2xl p-4 md:p-10">
                        <CustomCheckout
                          packageId={selectedPackage.packageId}
                          amount={selectedPackage.amount}
                          price={selectedPackage.price}
                          onClose={handleClose}
                          onSuccess={handleSuccess}
                          onFailure={handleFailure}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
