import { useQuery } from '@tanstack/react-query';
import type { Race, RaceResult, LapTime, PitStop } from '@/types/f1';
import * as api from '@/lib/api';

const BASE_URL = 'http://ergast.com/api/f1';

async function fetchSeasons(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/seasons.json?limit=100`);
  const data = await response.json();
  return data.MRData.SeasonTable.Seasons.map((season: { season: string }) => season.season);
}

async function fetchRaces(season: string): Promise<Race[]> {
  const response = await fetch(`${BASE_URL}/${season}.json`);
  const data = await response.json();
  return data.MRData.RaceTable.Races;
}

async function fetchRaceResults(season: string, round: string): Promise<RaceResult[]> {
  const response = await fetch(`${BASE_URL}/${season}/${round}/results.json`);
  const data = await response.json();
  return data.MRData.RaceTable.Races[0]?.Results || [];
}

async function fetchLapTimes(season: string, round: string, driverId: string): Promise<LapTime[]> {
  const response = await fetch(`${BASE_URL}/${season}/${round}/drivers/${driverId}/laps.json?limit=100`);
  const data = await response.json();
  return data.MRData.RaceTable.Races[0]?.Laps || [];
}

async function fetchPitStops(season: string, round: string): Promise<PitStop[]> {
  const response = await fetch(`${BASE_URL}/${season}/${round}/pitstops.json`);
  const data = await response.json();
  return data.MRData.RaceTable.Races[0]?.PitStops || [];
}

export function useSeasons() {
  return useQuery({
    queryKey: ['seasons'],
    queryFn: api.getSeasons,
    staleTime: Infinity, // Seasons data doesn't change
  });
}

export function useRaces(season: string) {
  return useQuery({
    queryKey: ['races', season],
    queryFn: () => api.getRaces(season),
    enabled: !!season,
    staleTime: Infinity, // Race schedule for a season doesn't change
  });
}

export function useRaceResults(season: string, round: string) {
  return useQuery({
    queryKey: ['raceResults', season, round],
    queryFn: () => api.getRaceResults(season, round),
    enabled: !!season && !!round,
    staleTime: Infinity, // Race results don't change after the race
  });
}

export function useLapTimes(season: string, round: string, driverId: string) {
  return useQuery({
    queryKey: ['lapTimes', season, round, driverId],
    queryFn: () => api.getLapTimes(season, round, driverId),
    enabled: !!season && !!round && !!driverId,
    staleTime: Infinity, // Lap times don't change after the race
  });
}

export function usePitStops(season: string, round: string) {
  return useQuery({
    queryKey: ['pitStops', season, round],
    queryFn: () => api.getPitStops(season, round),
    enabled: !!season && !!round,
    staleTime: Infinity, // Pit stops don't change after the race
  });
} 