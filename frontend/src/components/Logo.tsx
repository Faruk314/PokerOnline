import pokerLogo from "../assets/images/pokerlogo.png";

const Logo = () => {
  return (
    <div className="flex flex-col items-center mb-6 md:mb-12">
      <div className="relative mb-4 md:mb-6">
        <div className="absolute -inset-6 bg-gradient-to-r from-yellow-500/30 to-red-500/30 rounded-full blur-2xl"></div>
        <img 
          src={pokerLogo} 
          className="relative h-16 w-16 md:h-24 md:w-24 drop-shadow-2xl animate-pulse"
          alt="Poker Logo"
        />
      </div>
      <div className="text-center">
        <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
            POKER
          </span>
          <span className="text-white"> ONLINE</span>
        </h1>
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 animate-pulse"></div>
          <p className="text-gray-400 text-[10px] md:text-sm uppercase tracking-[0.3em] font-semibold">
            PREMIUM TABLES
          </p>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
