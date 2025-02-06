export interface Driver {
  driverId: string;
  permanentNumber?: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

export interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

export interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time?: string;
}

export interface StandingsResponse {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        season: string;
        round: string;
        DriverStandings: DriverStanding[];
      }>;
    };
  };
}

export interface RaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: {
    millis: string;
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
    AverageSpeed: {
      units: string;
      speed: string;
    };
  };
}

export interface RaceResultsResponse {
  MRData: {
    RaceTable: {
      season: string;
      round: string;
      Races: Array<Race & {
        Results: RaceResult[];
      }>;
    };
  };
}

export interface SeasonsResponse {
  MRData: {
    SeasonTable: {
      Seasons: Array<{
        season: string;
        url: string;
      }>;
    };
  };
}

export interface RaceScheduleResponse {
  MRData: {
    RaceTable: {
      season: string;
      Races: Race[];
    };
  };
}

export interface LapTime {
  number: string;  // Lap number
  Timings: Array<{
    driverId: string;
    position: string;
    time: string;
  }>;
}

export interface LapTimesResponse {
  MRData: {
    RaceTable: {
      season: string;
      round: string;
      Races: Array<Race & {
        Laps: LapTime[];
      }>;
    };
  };
}

export interface PitStop {
  driverId: string;
  lap: string;
  stop: string;
  time: string;
  duration: string;
}

export interface ChampionResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    StandingsTable: {
      season: string;
      StandingsLists: Array<{
        season: string;
        round: string;
        DriverStandings?: DriverStanding[];
        ConstructorStandings?: ConstructorStanding[];
      }>;
    };
  };
} 