

const FooterStats = () => {
  return (
    <div className="mt-8 md:mt-16 pt-4 md:pt-8 border-t border-white/10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        <div className="text-center">
          <div className="text-xl md:text-3xl font-bold text-blue-500 mb-1 md:mb-2">
            24/7
          </div>
          <div className="text-gray-400 text-xs md:text-sm">
            Active Support
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-3xl font-bold text-green-500 mb-1 md:mb-2">
            100%
          </div>
          <div className="text-gray-400 text-xs md:text-sm">Secure Games</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-3xl font-bold text-purple-500 mb-1 md:mb-2">
            Fast
          </div>
          <div className="text-gray-400 text-xs md:text-sm">Matchmaking</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-3xl font-bold text-yellow-500 mb-1 md:mb-2">
            Fair
          </div>
          <div className="text-gray-400 text-xs md:text-sm">
            Random Dealing
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterStats;
