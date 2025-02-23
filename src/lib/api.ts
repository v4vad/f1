import { cachedFetch } from './cache';
import type { Race, RaceResult, LapTime, PitStop, StandingsResponse, ChampionResponse } from '@/types/f1';

const API_BASE = '/api/f1';

async function fetchFromProxy(path: string) {
  const response = await fetch(`${API_BASE}?path=${encodeURIComponent(path)}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export async function getSeasons(): Promise<string[]> {
  try {
    const data = await fetchFromProxy('/seasons.json?limit=100');
    if (!data?.MRData?.SeasonTable?.Seasons) {
      throw new Error('Invalid response format from seasons endpoint');
    }
    return data.MRData.SeasonTable.Seasons.map((season: { season: string }) => season.season);
  } catch (error) {
    console.error('Error fetching seasons:', error);
    throw error;
  }
}

export async function getRaces(season: string): Promise<Race[]> {
  try {
    const data = await fetchFromProxy(`/${season}.json`);
    if (!data?.MRData?.RaceTable?.Races) {
      throw new Error('Invalid response format from races endpoint');
    }
    return data.MRData.RaceTable.Races;
  } catch (error) {
    console.error(`Error fetching races for season ${season}:`, error);
    throw error;
  }
}

export async function getRaceResults(season: string, round: string): Promise<RaceResult[]> {
  try {
    const data = await fetchFromProxy(`/${season}/${round}/results.json`);
    if (!data?.MRData?.RaceTable?.Races?.[0]?.Results) {
      throw new Error('Invalid response format from race results endpoint');
    }
    return data.MRData.RaceTable.Races[0].Results;
  } catch (error) {
    console.error(`Error fetching race results for ${season}/${round}:`, error);
    throw error;
  }
}

export async function getLapTimes(season: string, round: string, driverId: string): Promise<LapTime[]> {
  try {
    const data = await fetchFromProxy(`/${season}/${round}/drivers/${driverId}/laps.json?limit=100`);
    if (!data?.MRData?.RaceTable?.Races?.[0]?.Laps) {
      throw new Error('Invalid response format from lap times endpoint');
    }
    return data.MRData.RaceTable.Races[0].Laps;
  } catch (error) {
    console.error(`Error fetching lap times for ${season}/${round}/${driverId}:`, error);
    throw error;
  }
}

export async function getPitStops(season: string, round: string): Promise<PitStop[]> {
  try {
    const data = await fetchFromProxy(`/${season}/${round}/pitstops.json`);
    if (!data?.MRData?.RaceTable?.Races?.[0]?.PitStops) {
      throw new Error('Invalid response format from pit stops endpoint');
    }
    return data.MRData.RaceTable.Races[0].PitStops;
  } catch (error) {
    console.error(`Error fetching pit stops for ${season}/${round}:`, error);
    throw error;
  }
}

export async function getDriverChampion(season: string): Promise<ChampionResponse> {
  try {
    const data = await fetchFromProxy(`/${season}/driverStandings/1.json`);
    if (!data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0]) {
      throw new Error('Invalid response format from driver champion endpoint');
    }
    return data;
  } catch (error) {
    console.error(`Error fetching driver champion for season ${season}:`, error);
    throw error;
  }
}

export async function getConstructorChampion(season: string): Promise<ChampionResponse> {
  try {
    const data = await fetchFromProxy(`/${season}/constructorStandings/1.json`);
    if (!data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings?.[0]) {
      throw new Error('Invalid response format from constructor champion endpoint');
    }
    return data;
  } catch (error) {
    console.error(`Error fetching constructor champion for season ${season}:`, error);
    throw error;
  }
}

export async function getDriverStandings(season: string): Promise<StandingsResponse> {
  try {
    const data = await fetchFromProxy(`/${season}/driverStandings.json`);
    if (!data?.MRData?.StandingsTable?.StandingsLists) {
      throw new Error('Invalid response format from driver standings endpoint');
    }
    return data;
  } catch (error) {
    console.error(`Error fetching driver standings for season ${season}:`, error);
    throw error;
  }
}

export async function getConstructorStandings(season: string): Promise<StandingsResponse> {
  try {
    const data = await fetchFromProxy(`/${season}/constructorStandings.json`);
    if (!data?.MRData?.StandingsTable?.StandingsLists) {
      throw new Error('Invalid response format from constructor standings endpoint');
    }
    return data;
  } catch (error) {
    console.error(`Error fetching constructor standings for season ${season}:`, error);
    throw error;
  }
}

// Prefetch function for initial data
export async function prefetchInitialData(season: string, round: string) {
  try {
    await Promise.all([
      getSeasons(),
      getRaces(season),
      getRaceResults(season, round)
    ]);
  } catch (error) {
    console.error('Error prefetching initial data:', error);
    throw error;
  }
} 