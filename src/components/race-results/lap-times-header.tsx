import { memo } from 'react';
import type { RaceResult } from "@/types/f1";

interface LapTimesHeaderProps {
  totalLaps: number;
  selectedDriver: string;
  raceResults: RaceResult[];
}

function LapTimesHeaderComponent({
  totalLaps,
  selectedDriver,
  raceResults
}: LapTimesHeaderProps) {
  const selectedDriverResult = raceResults.find(r => r.Driver.driverId === selectedDriver);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          Total Laps: {totalLaps}
        </div>
        <div className="text-xs text-muted-foreground">
          {selectedDriverResult?.Driver.givenName} {selectedDriverResult?.Driver.familyName}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 text-sm font-medium mb-2 px-2">
        <div>Lap</div>
        <div>Position</div>
        <div>Time</div>
        <div className="text-right">Gap</div>
        <div className="text-right">Pit Stop</div>
      </div>
    </>
  );
}

export const LapTimesHeader = memo(LapTimesHeaderComponent); 