'use client';

import { RaceResultsSkeleton } from "@/components/skeletons";
import { Loader2 } from "lucide-react";

export default function RaceLoading() {
  return (
    <main className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <span>Champions</span>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Season</span>
              <Loader2 className="h-3 w-3 animate-spin" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <h1 className="text-3xl font-bold">Loading Race...</h1>
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <div className="text-sm text-muted-foreground mt-1 animate-pulse">
              <div className="h-4 w-48 bg-muted rounded" />
            </div>
          </div>
        </div>

        <RaceResultsSkeleton />
      </div>
    </main>
  );
} 