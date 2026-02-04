const Background = () => {
  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[24rem] h-[24rem] max-w-96 max-h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] max-w-96 max-h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[40rem] h-full max-h-[40rem] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-20 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg opacity-10 animate-bounce delay-300 rotate-12"></div>
        <div className="absolute bottom-1/3 right-1/5 w-16 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg opacity-10 animate-bounce delay-700 -rotate-6"></div>
        <div className="absolute top-2/3 left-2/3 w-18 h-26 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg opacity-10 animate-bounce delay-1200 rotate-3"></div>
      </div>
    </>
  );
};

export default Background;
