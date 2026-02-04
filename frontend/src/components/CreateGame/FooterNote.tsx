

const FooterNote = () => {
  return (
    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10">
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-[10px] md:text-xs text-gray-500">
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></div>
          <span>Secure Connection</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></div>
          <span>Instant Setup</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500"></div>
          <span>Live Support</span>
        </div>
      </div>
    </div>
  );
};

export default FooterNote;
