import Link from 'next/link';
import { getDriverStandings, getConstructorStandings, getSeasonRaces, getRaceResults } from "@/services/f1";
import { GB, DE, ES, MX, MC, AU, NL, FI, FR, CA, JP, DK, TH, CN, US, IT } from 'country-flag-icons/react/3x2';
import { cn } from "@/lib/utils";
import { Race } from '@/types/f1';
import { SeasonHeader } from '@/components/season-header';
import { Suspense } from 'react';
import { StandingsSkeleton } from '@/components/skeletons';
import { notFound } from 'next/navigation';

const nationalityToFlag: { [key: string]: React.ComponentType<{ className?: string }> } = {
  British: GB,
  German: DE,
  Spanish: ES,
  Mexican: MX,
  Monegasque: MC,
  Australian: AU,
  Dutch: NL,
  Finnish: FI,
  French: FR,
  Canadian: CA,
  Japanese: JP,
  Danish: DK,
  Thai: TH,
  Chinese: CN,
  American: US,
  Italian: IT
};

const constructorColors: { [key: string]: string } = {
  'Red Bull': 'border-[#3671C6]',
  'Mercedes': 'border-[#6CD3BF]',
  'Ferrari': 'border-[#F91536]',
  'McLaren': 'border-[#FF8700]',
  'Aston Martin': 'border-[#358C75]',
  'Alpine F1 Team': 'border-[#2293D1]',
  'Williams': 'border-[#37BEDD]',
  'AlphaTauri': 'border-[#5E8FAA]',
  'Alfa Romeo': 'border-[#C92D4B]',
  'Haas F1 Team': 'border-[#B6BABD]',
  // ... rest of constructor colors
};

const renderFlag = (nationality: string) => {
  const FlagComponent = nationalityToFlag[nationality];
  if (!FlagComponent) return null;
  return <FlagComponent className="w-4 h-3 inline-block" />;
};

async function getSeasonData(year: string) {
  try {
    console.log(`Fetching data for season ${year}...`);
    const [driverStandings, constructorStandings, raceResponse] = await Promise.all([
      getDriverStandings(year),
      getConstructorStandings(year),
      getSeasonRaces(year)
    ]);

    if (!driverStandings?.MRData?.StandingsTable?.StandingsLists?.[0]) {
      console.error('No driver standings found for season:', year);
      throw new Error(`No driver standings found for season ${year}`);
    }

    if (!constructorStandings?.MRData?.StandingsTable?.StandingsLists?.[0]) {
      console.error('No constructor standings found for season:', year);
      throw new Error(`No constructor standings found for season ${year}`);
    }

    const races = raceResponse.MRData.RaceTable.Races;
    console.log(`Found ${races.length} races for season ${year}`);

    // Fetch podium results for each race
    const racesWithResults = await Promise.all(
      races.map(async (race: Race) => {
        try {
          const results = await getRaceResults(year, race.round);
          const podium = results.MRData.RaceTable.Races[0]?.Results.slice(0, 3).map(result => ({
            position: result.position,
            driverName: `${result.Driver.givenName} ${result.Driver.familyName}`,
            constructorName: result.Constructor.name,
            nationality: result.Driver.nationality
          }));
          return { ...race, podium };
        } catch (error) {
          console.error(`Error fetching results for race ${race.round}:`, error);
          return { ...race, podium: [] };
        }
      })
    );

    return {
      drivers: driverStandings.MRData.StandingsTable.StandingsLists[0].DriverStandings,
      constructors: constructorStandings.MRData.StandingsTable.StandingsLists[0].ConstructorStandings,
      races: racesWithResults
    };
  } catch (error) {
    console.error('Error fetching season data:', error);
    throw error;
  }
}

interface SeasonPageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: SeasonPageProps) {
  const { year } = await params;
  try {
    await getSeasonData(year);
    return {
      title: `${year} Season - F1 Results`,
      description: `Formula 1 ${year} season standings, race results, and statistics.`,
    };
  } catch (_error) {
    return {
      title: 'Season Not Found - F1 Results',
      description: 'The requested Formula 1 season could not be found.',
    };
  }
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { year } = await params;

  try {
    const { drivers, constructors, races } = await getSeasonData(year);

    return (
      <main className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <SeasonHeader year={year} />

          <Suspense fallback={
            <div className="grid gap-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">Driver Standings</h2>
                  <StandingsSkeleton />
                </section>
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">Constructor Standings</h2>
                  <StandingsSkeleton />
                </section>
              </div>
            </div>
          }>
            <div className="grid gap-8">
              {/* Championships Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Driver Standings */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">Driver Standings</h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {drivers.map((driver) => (
                      <div
                        key={driver.Driver.driverId}
                        className={cn(
                          "flex items-center justify-between p-3 rounded bg-white/50 dark:bg-gray-800/50",
                          "hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors",
                          "border-l-4",
                          constructorColors[driver.Constructors[0]?.name] || 'border-gray-300',
                          "border-t border-r border-b border-border/40"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium w-6">{driver.position}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              {renderFlag(driver.Driver.nationality)}
                              <span className="font-medium">{driver.Driver.givenName} {driver.Driver.familyName}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {driver.Constructors[0]?.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{driver.points} pts</div>
                          <div className="text-sm text-muted-foreground">{driver.wins} wins</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Constructor Standings */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold">Constructor Standings</h2>
                  <div className="grid gap-2">
                    {constructors.map((constructor) => (
                      <div
                        key={constructor.Constructor.constructorId}
                        className={cn(
                          "flex items-center justify-between p-3 rounded bg-white/50 dark:bg-gray-800/50",
                          "hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors",
                          "border-l-4",
                          constructorColors[constructor.Constructor.name] || 'border-gray-300',
                          "border-t border-r border-b border-border/40"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium w-6">{constructor.position}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              {renderFlag(constructor.Constructor.nationality)}
                              <span className="font-medium">{constructor.Constructor.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{constructor.points} pts</div>
                          <div className="text-sm text-muted-foreground">{constructor.wins} wins</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Race Calendar */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Race Calendar</h2>
                <div className="grid gap-2">
                  {races.map((race) => (
                    <Link
                      key={race.round}
                      href={`/season/${year}/race/${race.round}`}
                      className="block"
                    >
                      <div className={cn(
                        "grid grid-cols-1 lg:grid-cols-2 items-center p-3 rounded bg-white/50 dark:bg-gray-800/50 border border-border/40",
                        "hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors"
                      )}>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium w-6">R{race.round}</span>
                          <div>
                            <div className="font-medium">{race.raceName}</div>
                            <div className="text-sm text-muted-foreground">
                              {race.Circuit.circuitName}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-6 mt-2 lg:mt-0">
                          {race.podium?.map((result) => (
                            <div key={result.position} className="flex items-center gap-2">
                              <div className={cn(
                                "w-1 h-6",
                                constructorColors[result.constructorName] || 'border-gray-300'
                              )} />
                              <div className="text-right">
                                <div className="flex items-center gap-1.5">
                                  {renderFlag(result.nationality)}
                                  <span className="text-sm font-medium">{result.driverName}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">P{result.position}</div>
                              </div>
                            </div>
                          ))}
                          <div className="text-sm text-muted-foreground text-right min-w-[80px]">
                            {new Date(race.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </Suspense>
        </div>
      </main>
    );
  } catch (error) {
    console.error(`Error rendering season ${year}:`, error);
    notFound();
  }
} 