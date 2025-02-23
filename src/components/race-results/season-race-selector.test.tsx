import { render, screen, fireEvent } from '@/lib/test-utils';
import { SeasonRaceSelector } from './season-race-selector';
import type { Race } from '@/types/f1';

const mockRaces: Race[] = [
  {
    season: '2024',
    round: '1',
    raceName: 'Bahrain Grand Prix',
    Circuit: {
      circuitId: 'bahrain',
      url: 'http://en.wikipedia.org/wiki/Bahrain_International_Circuit',
      circuitName: 'Bahrain International Circuit',
      Location: {
        lat: '26.0325',
        long: '50.5106',
        locality: 'Sakhir',
        country: 'Bahrain'
      }
    },
    date: '2024-03-02',
    time: '15:00:00Z'
  },
  {
    season: '2024',
    round: '2',
    raceName: 'Saudi Arabian Grand Prix',
    Circuit: {
      circuitId: 'jeddah',
      url: 'http://en.wikipedia.org/wiki/Jeddah_Corniche_Circuit',
      circuitName: 'Jeddah Corniche Circuit',
      Location: {
        lat: '21.6319',
        long: '39.1044',
        locality: 'Jeddah',
        country: 'Saudi Arabia'
      }
    },
    date: '2024-03-09',
    time: '17:00:00Z'
  }
];

describe('SeasonRaceSelector', () => {
  const defaultProps = {
    seasons: ['2024', '2023', '2022'],
    selectedSeason: '2024',
    races: mockRaces,
    selectedRace: '1',
    onSeasonChange: jest.fn(),
    onRaceChange: jest.fn(),
  };

  it('renders season and race selectors', () => {
    render(<SeasonRaceSelector {...defaultProps} />);
    
    expect(screen.getByText('Select Season')).toBeInTheDocument();
    expect(screen.getByText('Select Race')).toBeInTheDocument();
  });

  it('shows loading indicators when isLoading is true', () => {
    render(<SeasonRaceSelector {...defaultProps} isLoading={true} />);
    
    const loadingIndicators = screen.getAllByRole('status');
    expect(loadingIndicators).toHaveLength(2);
  });

  it('disables race selector when no season is selected', () => {
    render(
      <SeasonRaceSelector
        {...defaultProps}
        selectedSeason=""
      />
    );
    
    const raceSelector = screen.getByLabelText('Select Race');
    expect(raceSelector).toBeDisabled();
  });

  it('calls onSeasonChange when season is selected', () => {
    render(<SeasonRaceSelector {...defaultProps} />);
    
    const seasonSelector = screen.getByLabelText('Select Season');
    fireEvent.click(seasonSelector);
    
    const seasonOption = screen.getByText('2023');
    fireEvent.click(seasonOption);
    
    expect(defaultProps.onSeasonChange).toHaveBeenCalledWith('2023');
  });

  it('calls onRaceChange when race is selected', () => {
    render(<SeasonRaceSelector {...defaultProps} />);
    
    const raceSelector = screen.getByLabelText('Select Race');
    fireEvent.click(raceSelector);
    
    const raceOption = screen.getByText('Saudi Arabian Grand Prix');
    fireEvent.click(raceOption);
    
    expect(defaultProps.onRaceChange).toHaveBeenCalledWith('2');
  });

  it('displays all available seasons', () => {
    render(<SeasonRaceSelector {...defaultProps} />);
    
    const seasonSelector = screen.getByLabelText('Select Season');
    fireEvent.click(seasonSelector);
    
    defaultProps.seasons.forEach(season => {
      expect(screen.getByText(season)).toBeInTheDocument();
    });
  });

  it('displays all available races for selected season', () => {
    render(<SeasonRaceSelector {...defaultProps} />);
    
    const raceSelector = screen.getByLabelText('Select Race');
    fireEvent.click(raceSelector);
    
    mockRaces.forEach(race => {
      expect(screen.getByText(race.raceName)).toBeInTheDocument();
    });
  });
}); 