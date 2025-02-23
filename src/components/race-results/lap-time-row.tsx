import { memo } from 'react';
import { cn } from "@/lib/utils";
import { calculateLapDelta } from "@/lib/utils/formatting";

interface LapTimeRowProps {
  lap: {
    lap: string;
    time: string;
    position: string;
  };
  previousLap: {
    time: string;
  } | null;
  pitStop: {
    duration: string;
    stop: string;
  } | undefined;
  offsetTop: number;
  rowHeight: number;
}

function LapTimeRowComponent({
  lap,
  previousLap,
  pitStop,
  offsetTop,
  rowHeight
}: LapTimeRowProps) {
  const delta = previousLap ? calculateLapDelta(lap.time, previousLap.time) : null;

  return (
    <div 
      className={cn(
        "grid grid-cols-5 gap-2 text-xs py-1.5 px-2 hover:bg-gray-100/50 dark:hover:bg-gray-500/10 rounded absolute w-full",
        pitStop && "bg-yellow-100/50 dark:bg-yellow-500/10"
      )}
      style={{
        transform: `translateY(${offsetTop}px)`,
        height: `${rowHeight}px`,
      }}
    >
      <div>{lap.lap}</div>
      <div className="flex items-center gap-1">
        <span className={
          parseInt(lap.position) === 1 ? "text-yellow-500 dark:text-yellow-400" :
          parseInt(lap.position) <= 3 ? "text-muted-foreground font-medium" : ""
        }>P{lap.position}</span>
      </div>
      <div className="flex items-center gap-2">
        <span>{lap.time}</span>
        {delta !== null && (
          <span className={cn(
            "font-medium text-[10px]",
            delta > 0 ? "text-red-500 dark:text-red-400" : 
            delta < 0 ? "text-green-500 dark:text-green-400" : 
            "text-muted-foreground"
          )}>
            ({delta > 0 ? "+" : ""}{delta.toFixed(3)})
          </span>
        )}
      </div>
      <div className="text-right text-muted-foreground">
        {parseInt(lap.position) === 1 ? "—" : "+" + lap.time}
      </div>
      <div className="text-right text-muted-foreground">
        {pitStop && (
          <span className="text-yellow-600 dark:text-yellow-400">
            {pitStop.duration}s (Stop {pitStop.stop})
          </span>
        )}
      </div>
    </div>
  );
}

export const LapTimeRow = memo(LapTimeRowComponent); 