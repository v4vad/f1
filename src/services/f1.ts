import { StandingsResponse, RaceScheduleResponse, RaceResultsResponse, SeasonsResponse, LapTimesResponse } from "@/types/f1";
import { getCachedData } from "@/lib/cache";

const BASE_URL = "https://ergast.com/api/f1";

// Add delay between requests to respect rate limits
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Wrapper for fetch with retry logic and rate limiting
async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      // Add a 250ms delay between requests (4 requests per second limit)
      await delay(250);
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      if (response.status === 503) {
        // If we hit the rate limit, wait a bit longer
        await delay(1000);
        continue;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(1000); // Wait longer between retries
    }
  }
  throw new Error('Max retries reached');
}

export async function getCurrentDriverStandings(): Promise<StandingsResponse> {
  return getCachedData('current-driver-standings', async () => {
    const response = await fetchWithRetry(`${BASE_URL}/current/driverStandings.json`);
    return response.json();
  });
}

export async function getCurrentSeasonSchedule(): Promise<RaceScheduleResponse> {
  return getCachedData('current-season-schedule', async () => {
    const response = await fetchWithRetry(`${BASE_URL}/current.json`);
    return response.json();
  });
}

export async function getSeasons(): Promise<SeasonsResponse> {
  return getCachedData('seasons', async () => {
    const response = await fetchWithRetry(`${BASE_URL}/seasons.json?limit=100`);
    return response.json();
  });
}

export async function getSeasonRaces(season: string): Promise<RaceScheduleResponse> {
  return getCachedData(`season-races-${season}`, async () => {
    const response = await fetchWithRetry(`${BASE_URL}/${season}.json`);
    return response.json();
  });
}

export async function getRaceResults(season: string, round: string): Promise<RaceResultsResponse> {
  return getCachedData(`race-results-${season}-${round}`, async () => {
    const response = await fetchWithRetry(`${BASE_URL}/${season}/${round}/results.json`);
    return response.json();
  });
}

export async function getLapTimes(season: string, round: string): Promise<LapTimesResponse> {
  return getCachedData(`lap-times-${season}-${round}`, async () => {
    // First, get the total number of laps
    const response = await fetchWithRetry(`${BASE_URL}/${season}/${round}/laps.json?limit=1&offset=0`);
    const data = await response.json();
    const total = parseInt(data.MRData.total);
    
    // Fetch all laps in chunks of 100 (API limit per request)
    const chunkSize = 100;
    const requests = [];
    
    for (let offset = 0; offset < total; offset += chunkSize) {
      // Add a delay between chunk requests
      await delay(250);
      requests.push(
        fetchWithRetry(`${BASE_URL}/${season}/${round}/laps.json?limit=${chunkSize}&offset=${offset}`)
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
  });
}

export async function getPitStops(season: string, round: string): Promise<PitStopResponse> {
  return getCachedData(`pit-stops-${season}-${round}`, async () => {
    const response = await fetchWithRetry(`${BASE_URL}/${season}/${round}/pitstops.json`);
    return response.json();
  });
}

export async function getDriverChampion(season: string): Promise<StandingsResponse> {
  return getCachedData(`driver-champion-${season}`, async () => {
    const response = await fetchWithRetry(`${BASE_URL}/${season}/driverStandings/1.json`);
    return response.json();
  });
}

export async function getConstructorChampion(season: string): Promise<StandingsResponse> {
  return getCachedData(`constructor-champion-${season}`, async () => {
    const response = await fetchWithRetry(`${BASE_URL}/${season}/constructorStandings/1.json`);
    return response.json();
  });
}

export async function getDriverStandings(season: string): Promise<StandingsResponse> {
  return getCachedData(`driver-standings-${season}`, async () => {
    const response = await fetchWithRetry(`${BASE_URL}/${season}/driverStandings.json`);
    return response.json();
  });
}

export async function getConstructorStandings(season: string): Promise<StandingsResponse> {
  return getCachedData(`constructor-standings-${season}`, async () => {
    const response = await fetchWithRetry(`${BASE_URL}/${season}/constructorStandings.json`);
    return response.json();
  });
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