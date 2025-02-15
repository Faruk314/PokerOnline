import { useEffect, useRef } from "react";
import { ITime } from "../types/types";

interface Props {
  time: ITime;
}

const TimeBar = ({ time }: Props) => {
  const timeBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startTime = new Date(time.startTime);
    const endTime = new Date(time.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      console.error("Invalid date objects:", { startTime, endTime });
      return;
    }

    const updateTimeBar = () => {
      const now = new Date().getTime();
      const totalDuration = endTime.getTime() - startTime.getTime();
      const remainingTime = endTime.getTime() - now;

      const newWidth = Math.max((remainingTime / totalDuration) * 100, 0);

      if (timeBarRef.current) {
        timeBarRef.current.style.width = `${newWidth}%`;
      }
    };

    updateTimeBar();

    const intervalId = setInterval(updateTimeBar, 1000);

    return () => clearInterval(intervalId);
  }, [time.startTime, time.endTime]);

  return (
    <div className="h-[0.5rem] xl:h-[0.65rem] w-full bg-transparent border">
      <div
        ref={timeBarRef}
        className="bg-green-600 w-full h-full transition-all duration-200"
      ></div>
    </div>
  );
};

export default TimeBar;
