'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSeasons, getSeasonRaces, getRaceResults, getLapTimes, getPitStops } from "@/services/f1";
import { Race, RaceResult } from "@/types/f1";
import { useEffect } from 'react';
import { GB, DE, ES, MX, MC, AU, NL, FI, FR, CA, JP, DK, TH, CN, US, IT } from 'country-flag-icons/react/3x2';
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const nationalityToFlag: { [key: string]: React.ComponentType<{ className?: string }> } = {
  British: GB,
  German: DE,
  Spanish: ES,
  Mexican: MX,
  Monegasque: MC,
  Australian: AU,
  Dutch: NL,
  Finnish: FI,
  French: FR,
  Canadian: CA,
  Japanese: JP,
  Danish: DK,
  Thai: TH,
  Chinese: CN,
  American: US,
  Italian: IT
};

const constructorColors: { [key: string]: string } = {
  'Red Bull': 'border-[#3671C6]',
  'Mercedes': 'border-[#6CD3BF]',
  'Ferrari': 'border-[#F91536]',
  'McLaren': 'border-[#FF8700]',
  'Aston Martin': 'border-[#358C75]',
  'Alpine F1 Team': 'border-[#2293D1]',
  'Williams': 'border-[#37BEDD]',
  'AlphaTauri': 'border-[#5E8FAA]',
  'Alfa Romeo': 'border-[#C92D4B]',
  'Haas F1 Team': 'border-[#B6BABD]',
  // Legacy teams
  'Renault': 'border-[#FFF500]',
  'Racing Point': 'border-[#F596C8]',
  'Force India': 'border-[#FF5F0F]',
  'Toro Rosso': 'border-[#469BFF]',
  'Lotus F1': 'border-[#FFB800]',
  'Sauber': 'border-[#9B0000]',
  'Manor Marussia': 'border-[#323232]',
  'Marussia': 'border-[#6E0000]',
  'Caterham': 'border-[#016F37]',
  'HRT': 'border-[#B2945B]',
  'Virgin': 'border-[#F7051D]',
  'Brawn': 'border-[#B0D915]',
  'Toyota': 'border-[#CC1E1D]',
  'Super Aguri': 'border-[#D82E2E]',
  'Spyker': 'border-[#FF6E14]',
  'Midland': 'border-[#D82E2E]',
  'Jordan': 'border-[#FFC700]',
  'BAR': 'border-[#D82E2E]',
  'Minardi': 'border-[#000000]',
  'Jaguar': 'border-[#316E35]',
  'Prost': 'border-[#0F1FDB]',
  'Arrows': 'border-[#FF8700]',
};

export default function Home() {
  const [seasons, setSeasons] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<string>('');
  const [raceResults, setRaceResults] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [lapTimes, setLapTimes] = useState<Array<{lap: string; time: string; position: string}>>([]);
  const [lapTimesLoading, setLapTimesLoading] = useState(false);
  const [pitStops, setPitStops] = useState<Array<{lap: string; duration: string; stop: string}>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      setError(null);
      try {
        const data = await getSeasons();
        const seasonsList = data.MRData.SeasonTable.Seasons.map(s => s.season).reverse();
        setSeasons(seasonsList);
      } catch (error) {
        setError('Failed to fetch seasons. Please try again.');
        console.error('Error fetching seasons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  const handleSeasonChange = async (season: string) => {
    setSelectedSeason(season);
    setSelectedRace('');
    setRaceResults([]);
    setError(null);
    setLoading(true);
    
    try {
      const data = await getSeasonRaces(season);
      setRaces(data.MRData.RaceTable.Races);
    } catch (error) {
      setError('Failed to fetch races. Please try again.');
      console.error('Error fetching races:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRaceChange = async (round: string) => {
    setSelectedRace(round);
    setError(null);
    setLoading(true);
    
    try {
      const data = await getRaceResults(selectedSeason, round);
      setRaceResults(data.MRData.RaceTable.Races[0].Results);
    } catch (error) {
      setError('Failed to fetch race results. Please try again.');
      console.error('Error fetching race results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDriverSelect = async (driverId: string) => {
    setSelectedDriver(driverId);
    if (!selectedSeason || !selectedRace) return;
    
    setLapTimesLoading(true);
    setError(null);
    try {
      const [lapData, pitData] = await Promise.all([
        getLapTimes(selectedSeason, selectedRace),
        getPitStops(selectedSeason, selectedRace)
      ]);

      if (!lapData.MRData.RaceTable.Races[0]) {
        throw new Error('No lap data available for this race');
      }

      // Process lap times
      const driverLaps = lapData.MRData.RaceTable.Races[0].Laps
        .map(lap => ({
          lap: lap.number,
          time: lap.Timings.find(t => t.driverId === driverId)?.time || '',
          position: lap.Timings.find(t => t.driverId === driverId)?.position || ''
        }))
        .filter(lap => lap.time && lap.time !== '+' && lap.position)
        .sort((a, b) => parseInt(a.lap) - parseInt(b.lap));
      
      // Process pit stops
      const driverPitStops = pitData.MRData.RaceTable.Races[0]?.PitStops
        ?.filter((stop) => stop.driverId === driverId)
        .map((stop) => ({
          lap: stop.lap,
          duration: stop.duration,
          stop: stop.stop
        })) || [];

      setLapTimes(driverLaps);
      setPitStops(driverPitStops);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch lap times. Please try again.');
      console.error('Error fetching data:', error);
    } finally {
      setLapTimesLoading(false);
    }
  };

  const getPodiumColor = (position: string) => {
    switch (position) {
      case "1":
        return "bg-yellow-200/70 dark:bg-yellow-500/30 min-h-[160px]";
      case "2":
        return "bg-gray-200/70 dark:bg-gray-500/30 min-h-[130px]";
      case "3":
        return "bg-orange-200/70 dark:bg-orange-500/30 min-h-[100px]";
      default:
        return "";
    }
  };

  const formatStatus = (status: string) => {
    if (status === "Finished" || status.includes("+")) return status;
    if (status.includes("Accident")) return "DNF - Accident";
    if (status.includes("Engine")) return "DNF - Engine";
    if (status.includes("Mechanical")) return "DNF - Mechanical";
    if (status.includes("Transmission")) return "DNF - Transmission";
    if (status.includes("Hydraulics")) return "DNF - Hydraulics";
    if (status.includes("Brakes")) return "DNF - Brakes";
    if (status.includes("Electrical")) return "DNF - Electrical";
    if (status.includes("Retired")) return "DNF - Retired";
    if (status.includes("Disqualified")) return "DSQ";
    return `DNF - ${status}`;
  };

  const renderFlag = (nationality: string) => {
    const FlagComponent = nationalityToFlag[nationality];
    if (!FlagComponent) return null;
    return <FlagComponent className="w-4 h-3 inline-block" />;
  };

  const calculateLapDelta = (currentTime: string, previousTime: string) => {
    if (!previousTime || !currentTime) return null;
    
    const convertToSeconds = (time: string) => {
      const parts = time.split(':');
      if (parts.length === 2) {
        return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
      }
      return parseFloat(parts[0]);
    };

    const current = convertToSeconds(currentTime);
    const previous = convertToSeconds(previousTime);
    const delta = current - previous;
    
    return delta;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-lg">Loading...</div>
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Formula 1 Race Results</h1>
          <ThemeToggle />
        </div>
      
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}
      
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Select Season</label>
              <Select onValueChange={handleSeasonChange} value={selectedSeason}>
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
              <label className="text-sm font-medium">Select Race</label>
              <Select onValueChange={handleRaceChange} value={selectedRace} disabled={!selectedSeason}>
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

          {raceResults.length > 0 && (
            <div className="space-y-4">
              {/* Podium */}
              <div className="grid grid-cols-3 gap-3 h-[200px]">
                {/* 2nd Place */}
                <div className="flex items-end">
                  {[2, 1, 3].slice(0, 1).map((pos) => {
                    const result = raceResults.find(r => r.position === pos.toString());
                    if (!result) return null;
                    return (
                      <div
                        key={result.position}
                        className={`flex flex-col items-center justify-end p-3 rounded-lg w-full ${getPodiumColor(result.position)} border-b-4 ${constructorColors[result.Constructor.name] || 'border-gray-300'}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg font-bold">
                            {result.position}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {renderFlag(result.Driver.nationality)}
                            <p className="text-sm font-medium text-center">
                              {result.Driver.familyName}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            {result.Constructor.name}
                          </p>
                          <p className="text-xs">
                            {result.Time ? result.Time.time : formatStatus(result.status)}
                          </p>
                          <p className="text-sm font-medium">
                            {result.points} pts
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* 1st Place */}
                <div className="flex items-end">
                  {[2, 1, 3].slice(1, 2).map((pos) => {
                    const result = raceResults.find(r => r.position === pos.toString());
                    if (!result) return null;
                    return (
                      <div
                        key={result.position}
                        className={`flex flex-col items-center justify-end p-3 rounded-lg w-full ${getPodiumColor(result.position)} border-b-4 ${constructorColors[result.Constructor.name] || 'border-gray-300'}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xl font-bold">
                            {result.position}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {renderFlag(result.Driver.nationality)}
                            <p className="text-base font-medium text-center">
                              {result.Driver.familyName}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground text-center">
                            {result.Constructor.name}
                          </p>
                          <p className="text-sm">
                            {result.Time ? result.Time.time : formatStatus(result.status)}
                          </p>
                          <p className="text-base font-medium">
                            {result.points} pts
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* 3rd Place */}
                <div className="flex items-end">
                  {[2, 1, 3].slice(2).map((pos) => {
                    const result = raceResults.find(r => r.position === pos.toString());
                    if (!result) return null;
                    return (
                      <div
                        key={result.position}
                        className={`flex flex-col items-center justify-end p-3 rounded-lg w-full ${getPodiumColor(result.position)} border-b-4 ${constructorColors[result.Constructor.name] || 'border-gray-300'}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg font-bold">
                            {result.position}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {renderFlag(result.Driver.nationality)}
                            <p className="text-sm font-medium text-center">
                              {result.Driver.familyName}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            {result.Constructor.name}
                          </p>
                          <p className="text-xs">
                            {result.Time ? result.Time.time : formatStatus(result.status)}
                          </p>
                          <p className="text-sm font-medium">
                            {result.points} pts
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rest of Results */}
              <Card className="bg-transparent shadow-none">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Other Positions</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {raceResults.slice(3).map((result) => (
                      <div
                        key={result.position}
                        className={`flex items-center justify-between p-2 rounded bg-gray-100/50 dark:bg-gray-500/10 hover:bg-gray-200/50 dark:hover:bg-gray-500/20 transition-colors border-l-4 ${constructorColors[result.Constructor.name] || 'border-gray-300'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold w-4">
                            {result.position}
                          </span>
                          <div>
                            <div className="flex items-center gap-1">
                              {renderFlag(result.Driver.nationality)}
                              <p className="text-xs font-medium">
                                {result.Driver.familyName}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {result.Constructor.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs">
                            {result.Time ? result.Time.time : formatStatus(result.status)}
                          </p>
                          <p className="text-xs font-medium">{result.points} pts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lap Times Section */}
              <Card className="bg-transparent shadow-none">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Lap Times Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="w-full max-w-xs">
                      <label className="text-sm font-medium mb-1 block">Select Driver</label>
                      <Select onValueChange={handleDriverSelect} value={selectedDriver}>
                        <SelectTrigger disabled={lapTimesLoading}>
                          <SelectValue placeholder="Choose a driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {raceResults.map((result) => (
                            <SelectItem key={result.Driver.driverId} value={result.Driver.driverId}>
                              <div className="flex items-center gap-2">
                                <span className="w-4 text-right">{result.position}.</span>
                                {renderFlag(result.Driver.nationality)}
                                {result.Driver.familyName}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {lapTimesLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="text-sm text-muted-foreground">Loading lap times...</div>
                      </div>
                    ) : lapTimes.length > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm text-muted-foreground">
                            Total Laps: {lapTimes.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {raceResults.find(r => r.Driver.driverId === selectedDriver)?.Driver.givenName} {raceResults.find(r => r.Driver.driverId === selectedDriver)?.Driver.familyName}
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-sm font-medium mb-2 px-2">
                          <div>Lap</div>
                          <div>Position</div>
                          <div>Time</div>
                          <div className="text-right">Gap</div>
                          <div className="text-right">Pit Stop</div>
                        </div>
                        <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
                          {lapTimes.map((lap, index) => {
                            const pitStop = pitStops.find(p => p.lap === lap.lap);
                            const previousLap = index > 0 ? lapTimes[index - 1] : null;
                            const delta = previousLap ? calculateLapDelta(lap.time, previousLap.time) : null;
                            
                            return (
                              <div 
                                key={`${lap.lap}-${lap.position}`} 
                                className={cn(
                                  "grid grid-cols-5 gap-2 text-xs py-1.5 px-2 hover:bg-gray-100/50 dark:hover:bg-gray-500/10 rounded",
                                  pitStop && "bg-yellow-100/50 dark:bg-yellow-500/10"
                                )}
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
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
