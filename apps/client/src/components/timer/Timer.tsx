import { useEffect, useState } from "react";
import { formatTime } from "../../lib/utils";

interface TimerProps {
  times: number[];
  totalCounters: number;
}

export const Timer = ({ times, totalCounters }: TimerProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  const isRunning = times.length > 0 && times.length < totalCounters;
  const timeStart = times[0] || 0;
  const timeEnd = times.at(-1) || 0;
  const isFinisshed = times.length === totalCounters && timeEnd > timeStart;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 5);
    }, 5);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (times.length === 0) setElapsedTime(0);
  }, [times]);

  return (
    <div className="">
      <p className="font-heading font-black tabular-nums tracking-tight text-foreground ">
        {formatTime(isFinisshed ? timeEnd - timeStart : elapsedTime)}
      </p>
    </div>
  );
};
