import { renderHook, act } from '@testing-library/react';
import { useRaceData } from './use-race-data';
import { useSeasons, useRaces, useRaceResults, useLapTimes, usePitStops } from './queries';
import { wrapper } from '@/lib/test-utils';

// Mock the query hooks
jest.mock('./queries', () => ({
  useSeasons: jest.fn(),
  useRaces: jest.fn(),
  useRaceResults: jest.fn(),
  useLapTimes: jest.fn(),
  usePitStops: jest.fn(),
}));

describe('useRaceData', () => {
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
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    (useSeasons as jest.Mock).mockReturnValue({
      data: mockSeasons,
      isLoading: false,
      error: null,
    });

    (useRaces as jest.Mock).mockReturnValue({
      data: mockRaces,
      isLoading: false,
      error: null,
    });

    (useRaceResults as jest.Mock).mockReturnValue({
      data: mockRaceResults,
      isLoading: false,
      error: null,
    });

    (useLapTimes as jest.Mock).mockReturnValue({
      data: mockLapTimes,
      isLoading: false,
      error: null,
    });

    (usePitStops as jest.Mock).mockReturnValue({
      data: mockPitStops,
      isLoading: false,
      error: null,
    });
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useRaceData(), { wrapper });

    expect(result.current.selectedSeason).toBe('');
    expect(result.current.selectedRace).toBe('');
    expect(result.current.selectedDriver).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('updates season selection', () => {
    const { result } = renderHook(() => useRaceData(), { wrapper });

    act(() => {
      result.current.handleSeasonChange('2024');
    });

    expect(result.current.selectedSeason).toBe('2024');
  });

  it('updates race selection', () => {
    const { result } = renderHook(() => useRaceData(), { wrapper });

    act(() => {
      result.current.handleSeasonChange('2024');
      result.current.handleRaceChange('1');
    });

    expect(result.current.selectedRace).toBe('1');
  });

  it('updates driver selection', () => {
    const { result } = renderHook(() => useRaceData(), { wrapper });

    act(() => {
      result.current.handleDriverChange('max_verstappen');
    });

    expect(result.current.selectedDriver).toBe('max_verstappen');
  });

  it('shows loading state during debounce', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useRaceData(), { wrapper });

    act(() => {
      result.current.handleSeasonChange('2024');
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.loading).toBe(false);
    jest.useRealTimers();
  });

  it('handles errors from queries', () => {
    const errorMessage = 'Failed to fetch data';
    (useSeasons as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error(errorMessage),
    });

    const { result } = renderHook(() => useRaceData(), { wrapper });

    expect(result.current.error).toBe(errorMessage);
  });

  it('provides race data when all selections are made', () => {
    const { result } = renderHook(() => useRaceData(), { wrapper });

    act(() => {
      result.current.handleSeasonChange('2024');
      result.current.handleRaceChange('1');
      result.current.handleDriverChange('max_verstappen');
      jest.advanceTimersByTime(300);
    });

    expect(result.current.seasons).toEqual(mockSeasons);
    expect(result.current.races).toEqual(mockRaces);
    expect(result.current.raceResults).toEqual(mockRaceResults);
    expect(result.current.lapTimes).toEqual(mockLapTimes);
    expect(result.current.pitStops).toEqual(mockPitStops);
  });
}); 