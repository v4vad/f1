import { Suspense } from 'react';
import { ChampionsClient } from './components/champions-client';
import { getSeasons, getDriverChampion, getConstructorChampion } from "@/services/f1";
import { ChampionCardSkeleton } from '@/components/skeletons';

async function getChampionsData() {
  try {
    console.log('Fetching seasons data...');
    const data = await getSeasons();
    
    if (!data?.MRData?.SeasonTable?.Seasons) {
      console.error('Invalid seasons data structure:', data);
      throw new Error('Invalid seasons data structure');
    }

    const seasonsList = data.MRData.SeasonTable.Seasons.map(s => s.season).reverse();
    console.log(`Found ${seasonsList.length} seasons`);
    
    // Get initial batch of champions (10 seasons)
    const initialChampionsData = await Promise.all(
      seasonsList.slice(0, 10).map(async (season) => {
        try {
          console.log(`Fetching champion data for season ${season}...`);
          const [driverData, constructorData] = await Promise.all([
            getDriverChampion(season),
            getConstructorChampion(season)
          ]);

          if (!driverData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0]) {
            console.error(`Invalid driver data for season ${season}:`, driverData);
            throw new Error(`Missing driver champion data for season ${season}`);
          }

          if (!constructorData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings?.[0]) {
            console.error(`Invalid constructor data for season ${season}:`, constructorData);
            throw new Error(`Missing constructor champion data for season ${season}`);
          }

          const driverStanding = driverData.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
          const constructorStanding = constructorData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0];

          return {
            season,
            driver: {
              name: `${driverStanding.Driver.givenName} ${driverStanding.Driver.familyName}`,
              nationality: driverStanding.Driver.nationality || '',
              constructor: driverStanding.Constructors[0]?.name || '',
              points: driverStanding.points || '',
              wins: driverStanding.wins || ''
            },
            constructor: {
              name: constructorStanding.Constructor.name || '',
              nationality: constructorStanding.Constructor.nationality || '',
              points: constructorStanding.points || '',
              wins: constructorStanding.wins || ''
            }
          };
        } catch (error) {
          console.error(`Error fetching champion data for season ${season}:`, error);
          // Return a placeholder for failed seasons
          return {
            season,
            driver: {
              name: 'Data Unavailable',
              nationality: '',
              constructor: '',
              points: '',
              wins: ''
            },
            constructor: {
              name: 'Data Unavailable',
              nationality: '',
              points: '',
              wins: ''
            }
          };
        }
      })
    );

    console.log('Successfully fetched all initial champion data');
    return {
      initialChampions: initialChampionsData,
      totalSeasons: seasonsList
    };
  } catch (error: unknown) {
    console.error('Error in getChampionsData:', error);
    throw new Error(`Failed to fetch champions data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default async function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[2000px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <div className="h-8 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ChampionCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ChampionsClientWrapper />
    </Suspense>
  );
}

async function ChampionsClientWrapper() {
  const { initialChampions, totalSeasons } = await getChampionsData();
  
  return (
    <ChampionsClient 
      initialChampions={initialChampions} 
      totalSeasons={totalSeasons} 
    />
  );
}
