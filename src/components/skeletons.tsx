import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ChampionCardSkeleton() {
  return (
    <Card className="overflow-hidden backdrop-blur-[2px] bg-white/50 dark:bg-gray-800/50">
      <CardHeader className="pb-2 p-4">
        <Skeleton className="h-7 w-16" />
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        {/* Driver Champion Skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white/30 to-transparent dark:from-gray-800/30 dark:to-transparent">
          <div className="absolute top-0 left-0 h-full w-1 bg-muted" />
          <div className="p-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Constructor Champion Skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white/30 to-transparent dark:from-gray-800/30 dark:to-transparent">
          <div className="absolute top-0 left-0 h-full w-1 bg-muted" />
          <div className="p-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StandingsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 rounded bg-white/50 dark:bg-gray-800/50"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function RaceResultsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Podium Skeleton */}
      <div className="grid grid-cols-3 gap-3 h-[200px]">
        {[2, 1, 3].map((position) => (
          <div key={position} className="flex items-end">
            <div className="flex flex-col items-center justify-end p-3 rounded-lg w-full bg-white/50 dark:bg-gray-800/50">
              <div className="space-y-2 w-full">
                <Skeleton className="h-6 w-8 mx-auto" />
                <Skeleton className="h-5 w-24 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Other Positions Skeleton */}
      <Card className="bg-transparent">
        <CardHeader className="py-3">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="p-2">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-white/50 dark:bg-gray-800/50"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function LapTimesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2 text-sm font-medium mb-2 px-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-16" />
        ))}
      </div>
      <div className="space-y-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-2 text-xs py-1.5 px-2 rounded"
          >
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-16" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
} 