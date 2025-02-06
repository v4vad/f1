import { StandingsResponse, RaceScheduleResponse, RaceResultsResponse, SeasonsResponse, LapTimesResponse } from "@/types/f1";

const BASE_URL = "https://ergast.com/api/f1";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429 && retries > 0) { // Rate limit hit
        console.log(`Rate limit hit, retrying in ${RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(url, retries - 1);
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Request failed, retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function getCurrentDriverStandings(): Promise<StandingsResponse> {
  const response = await fetch(`${BASE_URL}/current/driverStandings.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch driver standings');
  }
  return response.json();
}

export async function getCurrentSeasonSchedule(): Promise<RaceScheduleResponse> {
  const response = await fetch(`${BASE_URL}/current.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch race schedule');
  }
  return response.json();
}

export async function getSeasons(): Promise<SeasonsResponse> {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/seasons.json?limit=100`);
    const data = await response.json();
    
    if (!data?.MRData?.SeasonTable?.Seasons) {
      throw new Error('Invalid response format from seasons endpoint');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching seasons:', error);
    throw new Error('Failed to fetch seasons data');
  }
}

export async function getSeasonRaces(season: string): Promise<RaceScheduleResponse> {
  const response = await fetch(`${BASE_URL}/${season}.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch season races');
  }
  return response.json();
}

export async function getRaceResults(season: string, round: string): Promise<RaceResultsResponse> {
  const response = await fetch(`${BASE_URL}/${season}/${round}/results.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch race results');
  }
  return response.json();
}

export async function getLapTimes(season: string, round: string): Promise<LapTimesResponse> {
  // First, get the total number of laps
  const response = await fetch(`${BASE_URL}/${season}/${round}/laps.json?limit=1&offset=0`);
  if (!response.ok) {
    throw new Error('Failed to fetch lap times');
  }
  const data = await response.json();
  const total = parseInt(data.MRData.total);
  
  // Fetch all laps in chunks of 100 (API limit per request)
  const chunkSize = 100;
  const requests = [];
  
  for (let offset = 0; offset < total; offset += chunkSize) {
    requests.push(
      fetch(`${BASE_URL}/${season}/${round}/laps.json?limit=${chunkSize}&offset=${offset}`)
        .then(res => res.json())
    );
  }

  // Wait for all requests to complete
  const results = await Promise.all(requests);
  
  // Combine all results
  const combinedLaps = results.reduce((acc, curr) => ({
    MRData: {
      ...curr.MRData,
      RaceTable: {
        ...curr.MRData.RaceTable,
        Races: [
          {
            ...curr.MRData.RaceTable.Races[0],
            Laps: [
              ...(acc.MRData?.RaceTable?.Races[0]?.Laps || []),
              ...curr.MRData.RaceTable.Races[0].Laps
            ]
          }
        ]
      }
    }
  }), {
    MRData: {
      RaceTable: {
        Races: [{
          Laps: []
        }]
      }
    }
  });

  return combinedLaps;
}

interface PitStopResponse {
  MRData: {
    RaceTable: {
      season: string;
      round: string;
      Races: Array<{
        season: string;
        round: string;
        raceName: string;
        Circuit: {
          circuitId: string;
          url: string;
          circuitName: string;
        };
        date: string;
        time: string;
        PitStops: Array<{
          driverId: string;
          lap: string;
          stop: string;
          time: string;
          duration: string;
        }>;
      }>;
    };
  };
}

export async function getPitStops(season: string, round: string): Promise<PitStopResponse> {
  const response = await fetch(`${BASE_URL}/${season}/${round}/pitstops.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch pit stops');
  }
  return response.json();
}

interface ChampionResponse {
  MRData: {
    StandingsTable: {
      season: string;
      StandingsLists: Array<{
        season: string;
        round: string;
        DriverStandings?: Array<{
          position: string;
          points: string;
          wins: string;
          Driver: {
            driverId: string;
            permanentNumber?: string;
            code: string;
            url: string;
            givenName: string;
            familyName: string;
            dateOfBirth: string;
            nationality: string;
          };
          Constructors: Array<{
            constructorId: string;
            url: string;
            name: string;
            nationality: string;
          }>;
        }>;
        ConstructorStandings?: Array<{
          position: string;
          points: string;
          wins: string;
          Constructor: {
            constructorId: string;
            url: string;
            name: string;
            nationality: string;
          };
        }>;
      }>;
    };
  };
}

export async function getDriverChampion(season: string): Promise<ChampionResponse> {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/${season}/driverStandings/1.json`);
    const data = await response.json();
    
    if (!data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0]) {
      throw new Error('Invalid response format from driver champion endpoint');
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching driver champion for season ${season}:`, error);
    throw new Error(`Failed to fetch driver champion data for season ${season}`);
  }
}

export async function getConstructorChampion(season: string): Promise<ChampionResponse> {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/${season}/constructorStandings/1.json`);
    const data = await response.json();
    
    if (!data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings?.[0]) {
      throw new Error('Invalid response format from constructor champion endpoint');
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching constructor champion for season ${season}:`, error);
    throw new Error(`Failed to fetch constructor champion data for season ${season}`);
  }
}

export async function getDriverStandings(season: string): Promise<StandingsResponse> {
  const response = await fetch(`${BASE_URL}/${season}/driverStandings.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch driver standings');
  }
  return response.json();
}

export async function getConstructorStandings(season: string): Promise<StandingsResponse> {
  const response = await fetch(`${BASE_URL}/${season}/constructorStandings.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch constructor standings');
  }
  return response.json();
} 