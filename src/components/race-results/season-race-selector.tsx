import { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import type { Race } from "@/types/f1";

interface SeasonRaceSelectorProps {
  seasons: string[];
  selectedSeason: string;
  races: Race[];
  selectedRace: string;
  onSeasonChange: (season: string) => void;
  onRaceChange: (round: string) => void;
  isLoading?: boolean;
}

function SeasonRaceSelectorComponent({
  seasons,
  selectedSeason,
  races,
  selectedRace,
  onSeasonChange,
  onRaceChange,
  isLoading = false
}: SeasonRaceSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          Select Season
          {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
        </label>
        <Select onValueChange={onSeasonChange} value={selectedSeason}>
          <SelectTrigger>
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((season) => (
              <SelectItem key={season} value={season}>
                {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          Select Race
          {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
        </label>
        <Select onValueChange={onRaceChange} value={selectedRace} disabled={!selectedSeason}>
          <SelectTrigger>
            <SelectValue placeholder="Select race" />
          </SelectTrigger>
          <SelectContent>
            {races.map((race) => (
              <SelectItem key={race.round} value={race.round}>
                {race.raceName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export const SeasonRaceSelector = memo(SeasonRaceSelectorComponent); 