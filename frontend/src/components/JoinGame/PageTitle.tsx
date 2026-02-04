

const PageTitle = () => {
  return (
    <div className="mb-6 md:mb-12 text-center">
      <div className="inline-block mb-4 md:mb-6">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-2xl opacity-20 animate-gradient-x"></div>
        <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-white/10 px-4 py-3 md:px-8 md:py-6 shadow-2xl">
          <h1 className="text-2xl md:text-5xl font-black text-white mb-2 md:mb-3">
            JOIN{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              POKER TABLE
            </span>
          </h1>
          <p className="text-gray-400 text-xs md:text-lg max-w-2xl mx-auto">
            Browse available poker tables, find your perfect match, and join the
            action
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageTitle;
