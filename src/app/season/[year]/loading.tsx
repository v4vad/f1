'use client';

import { StandingsSkeleton } from "@/components/skeletons";
import { Loader2 } from "lucide-react";

export default function SeasonLoading() {
  return (
    <main className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <span>Champions</span>
              <Loader2 className="h-3 w-3 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold mt-2">Loading Season...</h1>
          </div>
        </div>

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

          {/* Race Calendar Skeleton */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Race Calendar</h2>
            <div className="grid gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 lg:grid-cols-2 items-center p-3 rounded bg-white/50 dark:bg-gray-800/50 border border-border/40 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-4 bg-muted rounded" />
                    <div>
                      <div className="h-5 w-48 bg-muted rounded mb-2" />
                      <div className="h-4 w-32 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-6 mt-2 lg:mt-0">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-muted" />
                        <div className="text-right">
                          <div className="h-4 w-24 bg-muted rounded mb-1" />
                          <div className="h-3 w-8 bg-muted rounded" />
                        </div>
                      </div>
                    ))}
                    <div className="h-4 w-16 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 