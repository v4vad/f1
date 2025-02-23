import { renderHook, waitFor } from '@testing-library/react';
import { useSeasons, useRaces, useRaceResults, useLapTimes, usePitStops } from './queries';
import * as api from '@/lib/api';
import { wrapper } from '@/lib/test-utils';

// Mock the API module
jest.mock('@/lib/api', () => ({
  getSeasons: jest.fn(),
  getRaces: jest.fn(),
  getRaceResults: jest.fn(),
  getLapTimes: jest.fn(),
  getPitStops: jest.fn(),
}));

describe('Query Hooks', () => {
  const mockSeasons = ['2024', '2023', '2022'];
  const mockRaces = [
    { season: '2024', round: '1', raceName: 'Bahrain Grand Prix' },
    { season: '2024', round: '2', raceName: 'Saudi Arabian Grand Prix' },
  ];
  const mockRaceResults = [
    { position: '1', Driver: { driverId: 'max_verstappen', givenName: 'Max', familyName: 'Verstappen' } },
  ];
  const mockLapTimes = [
    { lap: '1', Timings: [{ driverId: 'max_verstappen', time: '1:32.000' }] },
  ];
  const mockPitStops = [
    { lap: '20', driverId: 'max_verstappen', duration: '22.000' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useSeasons', () => {
    beforeEach(() => {
      (api.getSeasons as jest.Mock).mockResolvedValue(mockSeasons);
    });

    it('fetches seasons successfully', async () => {
      const { result } = renderHook(() => useSeasons(), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockSeasons);
      });

      expect(api.getSeasons).toHaveBeenCalled();
    });

    it('handles errors', async () => {
      const error = new Error('Failed to fetch seasons');
      (api.getSeasons as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useSeasons(), { wrapper });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('useRaces', () => {
    const season = '2024';

    beforeEach(() => {
      (api.getRaces as jest.Mock).mockResolvedValue(mockRaces);
    });

    it('fetches races for a season successfully', async () => {
      const { result } = renderHook(() => useRaces(season), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockRaces);
      });

      expect(api.getRaces).toHaveBeenCalledWith(season);
    });

    it('does not fetch without a season', () => {
      renderHook(() => useRaces(''), { wrapper });
      expect(api.getRaces).not.toHaveBeenCalled();
    });
  });

  describe('useRaceResults', () => {
    const season = '2024';
    const round = '1';

    beforeEach(() => {
      (api.getRaceResults as jest.Mock).mockResolvedValue(mockRaceResults);
    });

    it('fetches race results successfully', async () => {
      const { result } = renderHook(() => useRaceResults(season, round), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockRaceResults);
      });

      expect(api.getRaceResults).toHaveBeenCalledWith(season, round);
    });

    it('does not fetch without required parameters', () => {
      renderHook(() => useRaceResults('', ''), { wrapper });
      expect(api.getRaceResults).not.toHaveBeenCalled();
    });
  });

  describe('useLapTimes', () => {
    const season = '2024';
    const round = '1';
    const driverId = 'max_verstappen';

    beforeEach(() => {
      (api.getLapTimes as jest.Mock).mockResolvedValue(mockLapTimes);
    });

    it('fetches lap times successfully', async () => {
      const { result } = renderHook(() => useLapTimes(season, round, driverId), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockLapTimes);
      });

      expect(api.getLapTimes).toHaveBeenCalledWith(season, round, driverId);
    });

    it('does not fetch without required parameters', () => {
      renderHook(() => useLapTimes('', '', ''), { wrapper });
      expect(api.getLapTimes).not.toHaveBeenCalled();
    });
  });

  describe('usePitStops', () => {
    const season = '2024';
    const round = '1';
    const driverId = 'max_verstappen';

    beforeEach(() => {
      (api.getPitStops as jest.Mock).mockResolvedValue(mockPitStops);
    });

    it('fetches pit stops successfully', async () => {
      const { result } = renderHook(() => usePitStops(season, round, driverId), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockPitStops);
      });

      expect(api.getPitStops).toHaveBeenCalledWith(season, round, driverId);
    });

    it('does not fetch without required parameters', () => {
      renderHook(() => usePitStops('', '', ''), { wrapper });
      expect(api.getPitStops).not.toHaveBeenCalled();
    });
  });
}); 