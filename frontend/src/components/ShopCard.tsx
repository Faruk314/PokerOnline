import { ShopPackage } from "../types/types";
import { createCheckoutSession } from "../store/slices/payment";
import { useAppDispatch } from "../store/hooks";
import ChipStack from "./ChipStack";

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
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(createCheckoutSession(shopPackage.packageId));
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer rounded-2xl p-8 pt-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 hover:scale-[1.02] transition-all duration-500 shadow-2xl border border-white/10 group overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-red-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-yellow-500/30 transition-all duration-500"></div>

      {/* Premium Package Badge */}
      <div className="absolute -top-3 -left-3 z-10">
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full blur opacity-30 animate-pulse"></div>
          
          {/* Main Badge */}
          <div className="relative bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-full px-6 py-3 shadow-[0_10px_30px_rgba(202,138,4,0.4)] border-2 border-yellow-300/50">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-yellow-600/20 rounded-full"></div>
            
            {/* Text */}
            <span className="relative text-sm font-black tracking-widest text-gray-900 uppercase">
              {SHOP_PACKAGE_NAMES[index]}
            </span>
            
            {/* Corner Accents */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-300"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-yellow-300"></div>
          </div>
        </div>
      </div>

      {/* Chip Stack Container */}
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <ChipStack showAmount={false} pot={shopPackage.amount} />
      </div>

      {/* Amount Display */}
      <div className="text-center text-white text-3xl font-black mb-2">
        {shopPackage.amount.toLocaleString()}
        <span className="text-yellow-500 ml-2">CHIPS</span>
      </div>

      {/* Price Display */}
      <div className="text-center mb-6">
        <div className="text-gray-400 text-sm mb-1">ONLY</div>
        <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          ${shopPackage.price}
        </div>
        <div className="text-gray-500 text-xs mt-1">
          ${(shopPackage.price / (shopPackage.amount / 1000)).toFixed(3)} per 1K chips
        </div>
      </div>

      {/* Buy Button */}
      <button className="relative w-full py-4 rounded-xl text-white text-sm font-bold tracking-widest transition-all duration-300 group overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 shadow-[0_0_30px_rgba(202,138,4,0.4)] hover:shadow-[0_0_40px_rgba(202,138,4,0.6)] hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
          BUY NOW
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </span>
      </button>

      {/* Best Value Badge */}
      {shopPackage.amount > 100000 && (
        <div className="absolute top-4 right-4">
          <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold px-3 py-2 rounded-full shadow-lg animate-pulse">
            <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-30"></div>
            <span className="relative">🔥 BEST VALUE</span>
          </div>
        </div>
      )}

      {/* Popular Badge for mid-tier packages */}
      {shopPackage.amount >= 50000 && shopPackage.amount <= 100000 && (
        <div className="absolute top-4 left-4">
          <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg">
            <div className="absolute -inset-1 bg-blue-400 rounded-full blur opacity-30"></div>
            <span className="relative">⭐ POPULAR</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopCard;
