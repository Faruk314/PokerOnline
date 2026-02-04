

const BottomInfo = () => {
  return (
    <div className="relative z-10 border-t border-white/10 bg-gradient-to-t from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 text-center md:text-left">
          <div className="text-gray-600 text-[10px] md:text-sm">
            Tables auto-refresh every 30 seconds • Double-click to join
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-gray-300 text-[10px] md:text-sm">
                Live Server
              </span>
            </div>
            <div className="text-gray-600 text-[10px] md:text-sm">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomInfo;
