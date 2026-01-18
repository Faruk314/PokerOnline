import { useEffect, useState, useRef } from "react";
import Logo from "./Logo";

interface Props {
  isLoading: boolean;
  minVisibleTime?: number;
}

const Loader = ({ isLoading, minVisibleTime = 500 }: Props) => {
  const [show, setShow] = useState(true);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isLoading) {
      setShow(true);
      startTimeRef.current = Date.now();
    } else {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(minVisibleTime - elapsed, 0);

      const timer = setTimeout(() => {
        setShow(false);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minVisibleTime]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex flex-col justify-center items-center h-[100vh] bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="relative">
        <Logo />
      </div>

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
