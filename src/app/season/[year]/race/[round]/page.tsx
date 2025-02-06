import { getRaceResults, getLapTimes, getPitStops } from "@/services/f1";
import type { Metadata } from 'next';
import { RaceContent } from "@/components/race-content";
import { Suspense } from "react";
import { RaceResultsSkeleton } from "@/components/skeletons";
import { notFound } from 'next/navigation';

async function getRaceData(year: string, round: string) {
  try {
    console.log(`Fetching data for race ${year}/${round}...`);
    const [raceResults, lapTimes, pitStops] = await Promise.all([
      getRaceResults(year, round),
      getLapTimes(year, round).catch(error => {
        console.error('Error fetching lap times:', error);
        return { MRData: { RaceTable: { Races: [] } } };
      }),
      getPitStops(year, round).catch(error => {
        console.error('Error fetching pit stops:', error);
        return { MRData: { RaceTable: { Races: [] } } };
      })
    ]);

    const race = raceResults.MRData.RaceTable.Races[0];
    if (!race) {
      console.error(`No race data found for ${year} round ${round}`);
      throw new Error(`No race data found for ${year} round ${round}`);
    }

    if (!race.Results?.length) {
      console.error(`No results found for ${year} round ${round}`);
      throw new Error(`No results found for ${year} round ${round}`);
    }

    const results = race.Results;
    const laps = lapTimes.MRData.RaceTable.Races[0]?.Laps || [];
    const stops = pitStops.MRData.RaceTable.Races[0]?.PitStops || [];

    console.log(`Successfully fetched race data for ${year}/${round}`);
    return {
      race,
      results,
      laps,
      stops
    };
  } catch (error) {
    console.error('Error fetching race data:', error);
    throw error;
  }
}

interface RacePageProps {
  params: Promise<{
    year: string;
    round: string;
  }>;
}

export async function generateMetadata(
  { params }: RacePageProps
): Promise<Metadata> {
  const { year, round } = await params;
  try {
    const { race } = await getRaceData(year, round);
    return {
      title: `${race.raceName} ${year} - F1 Results`,
      description: `Formula 1 ${race.raceName} ${year} race results, lap times, and pit stops.`,
    };
  } catch (_error) {
    return {
      title: 'Race Not Found - F1 Results',
      description: 'The requested Formula 1 race could not be found.',
    };
  }
}

export default async function RacePage({ params }: RacePageProps) {
  const { year, round } = await params;

  try {
    const { race, results } = await getRaceData(year, round);

    return (
      <Suspense fallback={<RaceResultsSkeleton />}>
        <RaceContent
          year={year}
          race={race}
          results={results}
        />
      </Suspense>
    );
  } catch (error) {
    console.error(`Error rendering race ${year}/${round}:`, error);
    notFound();
  }
} 