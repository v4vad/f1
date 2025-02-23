import { getSeasons, getRaces, getRaceResults, getLapTimes, getPitStops, prefetchInitialData } from './api';
import { cache } from './cache';

// Mock the cache module
jest.mock('./cache', () => ({
  cache: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('API Module', () => {
  const mockResponse = { ok: true, json: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
  });

  describe('getSeasons', () => {
    const mockSeasons = { MRData: { SeasonTable: { Seasons: [{ season: '2024' }] } } };

    beforeEach(() => {
      mockResponse.json.mockResolvedValue(mockSeasons);
    });

    it('returns cached data if available', async () => {
      const cachedSeasons = ['2024', '2023'];
      (cache.get as jest.Mock).mockReturnValue(cachedSeasons);

      const result = await getSeasons();

      expect(result).toEqual(cachedSeasons);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('fetches and caches data if not in cache', async () => {
      (cache.get as jest.Mock).mockReturnValue(null);

      const result = await getSeasons();

      expect(result).toEqual(['2024']);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://ergast.com/api/f1/seasons.json?limit=100'
      );
      expect(cache.set).toHaveBeenCalledWith('seasons', ['2024']);
    });

    it('handles API errors', async () => {
      (cache.get as jest.Mock).mockReturnValue(null);
      (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(getSeasons()).rejects.toThrow('API Error');
    });
  });

  describe('getRaces', () => {
    const season = '2024';
    const mockRaces = {
      MRData: {
        RaceTable: {
          Races: [
            { season: '2024', round: '1', raceName: 'Bahrain Grand Prix' }
          ]
        }
      }
    };

    beforeEach(() => {
      mockResponse.json.mockResolvedValue(mockRaces);
    });

    it('returns cached data if available', async () => {
      const cachedRaces = [{ season: '2024', round: '1', raceName: 'Bahrain Grand Prix' }];
      (cache.get as jest.Mock).mockReturnValue(cachedRaces);

      const result = await getRaces(season);

      expect(result).toEqual(cachedRaces);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('fetches and caches data if not in cache', async () => {
      (cache.get as jest.Mock).mockReturnValue(null);

      const result = await getRaces(season);

      expect(result).toEqual(mockRaces.MRData.RaceTable.Races);
      expect(global.fetch).toHaveBeenCalledWith(
        `https://ergast.com/api/f1/${season}.json`
      );
      expect(cache.set).toHaveBeenCalledWith(`races-${season}`, mockRaces.MRData.RaceTable.Races);
    });
  });

  describe('getRaceResults', () => {
    const season = '2024';
    const round = '1';
    const mockResults = {
      MRData: {
        RaceTable: {
          Races: [{
            Results: [
              { position: '1', Driver: { driverId: 'max_verstappen' } }
            ]
          }]
        }
      }
    };

    beforeEach(() => {
      mockResponse.json.mockResolvedValue(mockResults);
    });

    it('returns cached data if available', async () => {
      const cachedResults = [{ position: '1', Driver: { driverId: 'max_verstappen' } }];
      (cache.get as jest.Mock).mockReturnValue(cachedResults);

      const result = await getRaceResults(season, round);

      expect(result).toEqual(cachedResults);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('fetches and caches data if not in cache', async () => {
      (cache.get as jest.Mock).mockReturnValue(null);

      const result = await getRaceResults(season, round);

      expect(result).toEqual(mockResults.MRData.RaceTable.Races[0].Results);
      expect(global.fetch).toHaveBeenCalledWith(
        `https://ergast.com/api/f1/${season}/${round}/results.json`
      );
      expect(cache.set).toHaveBeenCalledWith(
        `results-${season}-${round}`,
        mockResults.MRData.RaceTable.Races[0].Results
      );
    });
  });

  describe('prefetchInitialData', () => {
    const season = '2024';
    const round = '1';

    it('prefetches all required data', async () => {
      await prefetchInitialData(season, round);

      expect(global.fetch).toHaveBeenCalledTimes(3); // seasons, races, results
      expect(cache.set).toHaveBeenCalledTimes(3);
    });

    it('handles errors during prefetch', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Prefetch Error'));

      await expect(prefetchInitialData(season, round)).rejects.toThrow('Prefetch Error');
    });
  });
}); 