import { useState } from 'react';
import { useSeasons, useRaces, useRaceResults, useLapTimes, usePitStops } from '@/lib/query/race-data';
import { useDebounce } from './useDebounce';

export function useRaceData() {
  // Raw state values
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedRace, setSelectedRace] = useState<string>('');
  const [selectedDriver, setSelectedDriver] = useState<string>('');

  // Debounced values
  const debouncedSeason = useDebounce(selectedSeason, 300);
  const debouncedRace = useDebounce(selectedRace, 300);
  const debouncedDriver = useDebounce(selectedDriver, 300);

  // Queries using debounced values
  const { 
    data: seasons = [], 
    isLoading: seasonsLoading,
    error: seasonsError 
  } = useSeasons();

  const { 
    data: races = [], 
    isLoading: racesLoading,
    error: racesError 
  } = useRaces(debouncedSeason);

  const { 
    data: raceResults = [], 
    isLoading: resultsLoading,
    error: resultsError 
  } = useRaceResults(debouncedSeason, debouncedRace);

  const { 
    data: lapTimes = [], 
    isLoading: lapTimesLoading,
    error: lapTimesError 
  } = useLapTimes(debouncedSeason, debouncedRace, debouncedDriver);

  const { 
    data: pitStops = [], 
    isLoading: pitStopsLoading,
    error: pitStopsError 
  } = usePitStops(debouncedSeason, debouncedRace);

  // Loading states
  const loading = seasonsLoading || racesLoading || resultsLoading;
  const isDebouncing = selectedSeason !== debouncedSeason || 
                      selectedRace !== debouncedRace || 
                      selectedDriver !== debouncedDriver;

  // Combined loading state
  const isLoading = loading || isDebouncing;

  // Combined error state
  const error = seasonsError?.message || racesError?.message || resultsError?.message || 
                lapTimesError?.message || pitStopsError?.message;

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    setSelectedRace('');
    setSelectedDriver('');
  };

  const handleRaceChange = (round: string) => {
    setSelectedRace(round);
    setSelectedDriver('');
  };

  const handleDriverSelect = (driverId: string) => {
    setSelectedDriver(driverId);
  };

  return {
    // Data
    seasons,
    selectedSeason,
    races,
    selectedRace,
    raceResults,
    selectedDriver,
    lapTimes,
    pitStops,

    // States
    loading: isLoading,
    lapTimesLoading: lapTimesLoading || isDebouncing,
    error,

    // Handlers
    handleSeasonChange,
    handleRaceChange,
    handleDriverSelect,
  };
} 