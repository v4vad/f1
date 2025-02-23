import { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RaceResult } from "@/types/f1";

interface DriverSelectorProps {
  raceResults: RaceResult[];
  selectedDriver: string;
  onDriverSelect: (driverId: string) => void;
  disabled?: boolean;
}

function DriverSelectorComponent({
  raceResults,
  selectedDriver,
  onDriverSelect,
  disabled
}: DriverSelectorProps) {
  return (
    <div className="w-full max-w-xs">
      <label className="text-sm font-medium mb-1 block">Select Driver</label>
      <Select onValueChange={onDriverSelect} value={selectedDriver}>
        <SelectTrigger disabled={disabled}>
          <SelectValue placeholder="Choose a driver" />
        </SelectTrigger>
        <SelectContent>
          {raceResults.map((result) => (
            <SelectItem key={result.Driver.driverId} value={result.Driver.driverId}>
              <div className="flex items-center gap-2">
                <span className="w-4 text-right">{result.position}.</span>
                {result.Driver.familyName}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export const DriverSelector = memo(DriverSelectorComponent); 