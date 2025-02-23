import { Skeleton } from "@/components/ui/skeleton";

export function LapTimesLoading() {
  return (
    <div className="space-y-4">
      {/* Driver Selector Skeleton */}
      <div className="w-full max-w-xs space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Header Skeleton */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-5 gap-2 text-sm font-medium mb-2 px-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
      </div>

      {/* Lap Times Skeleton */}
      <div className="relative" style={{ height: '400px' }}>
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-2 py-1.5 px-2"
              style={{
                transform: `translateY(${i * 36}px)`,
              }}
            >
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 