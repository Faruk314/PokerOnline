import { useNavigate } from "react-router-dom";
import { ShopPackage } from "../types/types";

// Import shop images
import smallChip from "../assets/images/shopImages/smallChip.png";
import mediumChip from "../assets/images/shopImages/mediumChip.png";
import bigChip from "../assets/images/shopImages/bigChip.png";
import biggestChip from "../assets/images/shopImages/biggestChip.png";

interface Props {
  shopPackage: ShopPackage;
  index: number;
}

const SHOP_PACKAGE_NAMES = [
  "Pocket Change",
  "Small Stack",
  "Lucky Stack",
  "Big Stack",
  "High Roller",
  "Jackpot Chest",
] as const;

const ShopCard = ({ shopPackage, index }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/payment/${shopPackage.packageId}`);
  };

  // Determine which image to use based on package amount
  const getShopImage = (amount: number) => {
    if (amount <= 10000) return smallChip;
    if (amount <= 50000) return mediumChip;
    if (amount <= 100000) return bigChip;
    return biggestChip;
  };

  const shopImage = getShopImage(shopPackage.amount);

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer rounded-xl md:rounded-2xl p-3 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 hover:scale-[1.02] transition-all duration-500 shadow-xl md:shadow-2xl border border-white/10 group overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-red-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-yellow-500/30 transition-all duration-500"></div>

      {/* Package Name - Glassmorphism Style */}
      <div className="relative mb-2 md:mb-6">
        <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-lg md:rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative bg-gradient-to-b from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl px-2 py-2 md:px-6 md:py-4">
          <div className="flex flex-col items-center gap-1 md:gap-2">
            {/* Main Package Name */}
            <div className="flex items-center justify-center gap-1 md:gap-3">
              <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 text-[10px] sm:text-xs md:text-lg font-black tracking-widest uppercase text-center leading-tight">
                {SHOP_PACKAGE_NAMES[index]}
              </h3>
              <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 animate-pulse delay-300"></div>
            </div>

            {/* Package Indicators */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 mt-1 md:mt-0">
              {/* Best Value Indicator */}
              {shopPackage.amount > 100000 && (
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                  <span className="text-[8px] md:text-xs text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 font-semibold whitespace-nowrap">
                    🔥 BEST VALUE
                  </span>
                </div>
              )}

              {/* Popular Indicator */}
              {index === 3 && (
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  <span className="text-[8px] md:text-xs text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 font-semibold whitespace-nowrap">
                    ⭐ POPULAR
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shop Image Container */}
      <div className="relative mb-2 md:mb-6 flex justify-center">
        <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-40 md:h-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-full blur-lg opacity-30 animate-pulse"></div>
          <img
            src={shopImage}
            alt={`${shopPackage.amount.toLocaleString()} chips`}
            className="relative w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Amount Display */}
      <div className="text-center text-white text-lg sm:text-xl md:text-3xl font-black mb-1 md:mb-2 leading-tight">
        {shopPackage.amount.toLocaleString()}
        <div className="text-yellow-500 text-[10px] sm:text-xs md:text-base md:inline-block block md:ml-2">CHIPS</div>
      </div>

      {/* Price Display */}
      <div className="text-center mb-3 md:mb-6">
        <div className="text-gray-400 text-[10px] md:text-sm mb-0.5 md:mb-1">ONLY</div>
        <div className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          ${shopPackage.price}
        </div>
        <div className="text-gray-500 text-[8px] md:text-xs mt-0.5 md:mt-1 hidden sm:block">
          ${(shopPackage.price / (shopPackage.amount / 1000)).toFixed(3)} per 1K
          chips
        </div>
      </div>

      {/* Buy Button */}
      <button className="relative w-full py-2 md:py-4 rounded-lg md:rounded-xl text-white text-[10px] sm:text-xs md:text-sm font-bold tracking-widest transition-all duration-300 group overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 shadow-[0_0_15px_rgba(202,138,4,0.3)] md:shadow-[0_0_30px_rgba(202,138,4,0.4)] hover:shadow-[0_0_40px_rgba(202,138,4,0.6)] hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
          BUY NOW
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
  );
};

export default ShopCard;
