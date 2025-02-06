'use client';

import { Suspense } from 'react';
import { StandingsSkeleton } from '@/components/skeletons';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import type { DriverStanding, ConstructorStanding, Race } from '@/types/f1';

interface SeasonContentProps {
  year: string;
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
  races: (Race & {
    podium?: Array<{
      position: string;
      driverName: string;
      constructorName: string;
      nationality: string;
    }>;
  })[];
  renderFlag: (nationality: string) => React.ReactNode;
  constructorColors: { [key: string]: string };
}

export function SeasonContent({
  year,
  drivers,
  constructors,
  races,
  renderFlag,
  constructorColors,
}: SeasonContentProps) {
  return (
    <Suspense
      fallback={
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
      }
    >
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
                    constructorColors[driver.Constructors[0].name] || 'border-gray-300',
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
                        {driver.Constructors[0].name}
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
  );
} 