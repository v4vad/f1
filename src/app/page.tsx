import { Suspense } from 'react';
import { ChampionsClient } from './components/champions-client';
import { getSeasons, getDriverChampion, getConstructorChampion } from "@/services/f1";

async function getChampionsData() {
  try {
    const data = await getSeasons();
    const seasonsList = data.MRData.SeasonTable.Seasons.map(s => s.season).reverse();
    
    // Get initial batch of champions (10 seasons)
    const initialChampionsData = await Promise.all(
      seasonsList.slice(0, 10).map(async (season) => {
        const [driverData, constructorData] = await Promise.all([
          getDriverChampion(season),
          getConstructorChampion(season)
        ]);

        const driverStanding = driverData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings?.[0];
        const constructorStanding = constructorData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings?.[0];

        return {
          season,
          driver: {
            name: `${driverStanding?.Driver.givenName} ${driverStanding?.Driver.familyName}`,
            nationality: driverStanding?.Driver.nationality || '',
            constructor: driverStanding?.Constructors[0].name || '',
            points: driverStanding?.points || '',
            wins: driverStanding?.wins || ''
          },
          constructor: {
            name: constructorStanding?.Constructor.name || '',
            nationality: constructorStanding?.Constructor.nationality || '',
            points: constructorStanding?.points || '',
            wins: constructorStanding?.wins || ''
          }
        };
      })
    );

    return {
      initialChampions: initialChampionsData,
      totalSeasons: seasonsList
    };
  } catch (error) {
    console.error('Error fetching champions:', error);
    throw error;
  }
}

export default async function Home() {
  const { initialChampions, totalSeasons } = await getChampionsData();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-lg">Loading champions...</div>
        </div>
      </div>
    }>
      <ChampionsClient initialChampions={initialChampions} totalSeasons={totalSeasons} />
    </Suspense>
  );
}
