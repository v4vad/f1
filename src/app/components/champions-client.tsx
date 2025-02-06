'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GB, DE, ES, MX, MC, AU, NL, FI, FR, CA, JP, DK, TH, CN, US, IT } from 'country-flag-icons/react/3x2';
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Trophy, Medal, Loader2 } from 'lucide-react';
import { getDriverChampion, getConstructorChampion } from "@/services/f1";

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
  'Red Bull': 'border-[#3671C6] bg-[#3671C6]',
  'Mercedes': 'border-[#6CD3BF] bg-[#6CD3BF]',
  'Ferrari': 'border-[#F91536] bg-[#F91536]',
  'McLaren': 'border-[#FF8700] bg-[#FF8700]',
  'Aston Martin': 'border-[#358C75] bg-[#358C75]',
  'Alpine F1 Team': 'border-[#2293D1] bg-[#2293D1]',
  'Williams': 'border-[#37BEDD] bg-[#37BEDD]',
  'AlphaTauri': 'border-[#5E8FAA] bg-[#5E8FAA]',
  'Alfa Romeo': 'border-[#C92D4B] bg-[#C92D4B]',
  'Haas F1 Team': 'border-[#B6BABD] bg-[#B6BABD]',
  // Legacy teams
  'Red Bull Racing': 'border-[#3671C6] bg-[#3671C6]',
  'Mercedes AMG': 'border-[#6CD3BF] bg-[#6CD3BF]',
  'Brawn GP': 'border-[#B0D915] bg-[#B0D915]',
  'Renault': 'border-[#FFF500] bg-[#FFF500]',
  'Racing Point': 'border-[#F596C8] bg-[#F596C8]',
  'Force India': 'border-[#FF5F0F] bg-[#FF5F0F]',
  'Toro Rosso': 'border-[#469BFF] bg-[#469BFF]',
  'Lotus F1': 'border-[#FFB800] bg-[#FFB800]',
  'Sauber': 'border-[#9B0000] bg-[#9B0000]',
  'Manor Marussia': 'border-[#323232] bg-[#323232]',
  'Marussia': 'border-[#6E0000] bg-[#6E0000]',
  'Caterham': 'border-[#016F37] bg-[#016F37]',
  'HRT': 'border-[#B2945B] bg-[#B2945B]',
  'Virgin': 'border-[#F7051D] bg-[#F7051D]',
  'Toyota': 'border-[#CC1E1D] bg-[#CC1E1D]',
  'Super Aguri': 'border-[#D82E2E] bg-[#D82E2E]',
  'Spyker': 'border-[#FF6E14] bg-[#FF6E14]',
  'Midland': 'border-[#D82E2E] bg-[#D82E2E]',
  'Jordan': 'border-[#FFC700] bg-[#FFC700]',
  'BAR': 'border-[#D82E2E] bg-[#D82E2E]',
  'Minardi': 'border-[#000000] bg-[#000000]',
  'Jaguar': 'border-[#316E35] bg-[#316E35]',
  'Prost': 'border-[#0F1FDB] bg-[#0F1FDB]',
  'Arrows': 'border-[#FF8700] bg-[#FF8700]',
};

interface Champion {
  season: string;
  driver: {
    name: string;
    nationality: string;
    constructor: string;
    points: string;
    wins: string;
  };
  constructor: {
    name: string;
    nationality: string;
    points: string;
    wins: string;
  };
}

interface ChampionsClientProps {
  initialChampions: Champion[];
  totalSeasons: string[];
}

const renderFlag = (nationality: string) => {
  const FlagComponent = nationalityToFlag[nationality];
  if (!FlagComponent) return null;
  return <FlagComponent className="w-4 h-3 inline-block" />;
};

const BATCH_SIZE = 10;

const groupByDecade = (champions: Champion[]) => {
  const grouped = champions.reduce((acc, champion) => {
    const decade = Math.floor(parseInt(champion.season) / 10) * 10;
    if (!acc[decade]) {
      acc[decade] = [];
    }
    acc[decade].push(champion);
    return acc;
  }, {} as Record<number, Champion[]>);

  // Sort decades in descending order
  return Object.entries(grouped)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
    .map(([decade, champions]) => ({
      decade: `${decade}s`,
      champions
    }));
};

export function ChampionsClient({ initialChampions, totalSeasons }: ChampionsClientProps) {
  const [champions, setChampions] = useState<Champion[]>(initialChampions);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalSeasons.length > BATCH_SIZE);
  const loadingRef = useRef<HTMLDivElement>(null);
  const currentPage = useRef(1);

  const loadMoreChampions = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const startIndex = currentPage.current * BATCH_SIZE;
    const nextSeasons = totalSeasons.slice(startIndex, startIndex + BATCH_SIZE);

    try {
      const newChampions = await Promise.all(
        nextSeasons.map(async (season) => {
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

      setChampions(prev => [...prev, ...newChampions]);
      currentPage.current += 1;
      setHasMore((currentPage.current * BATCH_SIZE) < totalSeasons.length);
    } catch (error) {
      console.error('Error loading more champions:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, totalSeasons]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreChampions();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreChampions]);

  const groupedChampions = groupByDecade(champions);

  return (
    <main className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Formula 1 Champions</h1>
            <p className="text-sm text-muted-foreground">
              {totalSeasons.length} seasons of F1 champions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/race-results">
              <Button variant="outline" className="gap-2">
                Race Results
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="space-y-12">
          {groupedChampions.map(({ decade, champions }) => (
            <section key={decade} className="space-y-6">
              <h2 className="text-2xl font-bold text-muted-foreground">{decade}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {champions.map((champion) => (
                  <Link
                    key={champion.season}
                    href={`/season/${champion.season}`}
                    className="block"
                  >
                    <Card 
                      className="overflow-hidden backdrop-blur-[2px] bg-white/50 dark:bg-gray-800/50 border border-border/40 shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-200 hover:bg-white/70 dark:hover:bg-gray-800/70 hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)] hover:scale-[1.02]"
                    >
                      <CardHeader className="pb-2 p-4">
                        <CardTitle className="text-xl font-bold">{champion.season}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 p-4 pt-0">
                        {/* Driver Champion */}
                        <div className={cn(
                          "relative overflow-hidden",
                          "bg-gradient-to-br from-white/30 to-transparent dark:from-gray-800/30 dark:to-transparent"
                        )}>
                          <div className={cn(
                            "absolute top-0 left-0 h-full w-1",
                            constructorColors[champion.driver.constructor]?.split(' ')[1] || 'bg-gray-300'
                          )} />
                          <div className="p-3">
                            <div className="space-y-2">
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <Trophy className="h-3.5 w-3.5" />
                                Driver&apos;s Champion
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  {renderFlag(champion.driver.nationality)}
                                  <span className="text-base font-bold">{champion.driver.name}</span>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">
                                    {champion.driver.constructor}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>{champion.driver.points} points</span>
                                    <span className="font-medium">{champion.driver.wins} wins</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Constructor Champion */}
                        <div className={cn(
                          "relative overflow-hidden",
                          "bg-gradient-to-br from-white/30 to-transparent dark:from-gray-800/30 dark:to-transparent"
                        )}>
                          <div className={cn(
                            "absolute top-0 left-0 h-full w-1",
                            constructorColors[champion.constructor.name]?.split(' ')[1] || 'bg-gray-300'
                          )} />
                          <div className="p-3">
                            <div className="space-y-2">
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <Medal className="h-3.5 w-3.5" />
                                Constructor&apos;s Champion
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  {renderFlag(champion.constructor.nationality)}
                                  <span className="text-base font-bold">{champion.constructor.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="font-medium">{champion.constructor.points} points</span>
                                  <span className="font-medium">{champion.constructor.wins} wins</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Loading indicator */}
        <div ref={loadingRef} className="py-12 flex justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more champions...
            </div>
          )}
          {!hasMore && champions.length > BATCH_SIZE && (
            <div className="text-sm text-muted-foreground">
              No more seasons to load
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 