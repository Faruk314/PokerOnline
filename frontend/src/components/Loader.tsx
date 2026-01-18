import Logo from "./Logo";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <Logo />

      <div className="flex gap-4 mt-12">
        {["♠", "♥", "♦", "♣"].map((suit, idx) => (
          <div
            key={idx}
            className="text-2xl md:text-3xl animate-bounce text-white"
            style={{ animationDelay: `${idx * 0.2}s` }}
          >
            {suit}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
