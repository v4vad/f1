import { memo } from 'react';
import { cn } from "@/lib/utils";
import { formatStatus, getPodiumColor } from "@/lib/utils/formatting";
import { nationalityToFlag, constructorColors } from "@/lib/constants";
import type { RaceResult } from "@/types/f1";

interface PodiumProps {
  results: RaceResult[];
}

const renderFlag = (nationality: string) => {
  const FlagComponent = nationalityToFlag[nationality];
  if (!FlagComponent) return null;
  return <FlagComponent className="w-4 h-3 inline-block" />;
};

function PodiumComponent({ results }: PodiumProps) {
  return (
    <div className="grid grid-cols-3 gap-3 h-[200px]">
      {/* 2nd Place */}
      <div className="flex items-end">
        {[2, 1, 3].slice(0, 1).map((pos) => {
          const result = results.find(r => r.position === pos.toString());
          if (!result) return null;
          return (
            <div
              key={result.position}
              className={cn(
                "flex flex-col items-center justify-end p-3 rounded-lg w-full",
                getPodiumColor(result.position),
                "border-b-4",
                constructorColors[result.Constructor.name] || 'border-gray-300'
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold">
                  {result.position}
                </span>
                <div className="flex items-center gap-1.5">
                  {renderFlag(result.Driver.nationality)}
                  <p className="text-sm font-medium text-center">
                    {result.Driver.familyName}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {result.Constructor.name}
                </p>
                <p className="text-xs">
                  {result.Time ? result.Time.time : formatStatus(result.status)}
                </p>
                <p className="text-sm font-medium">
                  {result.points} pts
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* 1st Place */}
      <div className="flex items-end">
        {[2, 1, 3].slice(1, 2).map((pos) => {
          const result = results.find(r => r.position === pos.toString());
          if (!result) return null;
          return (
            <div
              key={result.position}
              className={cn(
                "flex flex-col items-center justify-end p-3 rounded-lg w-full",
                getPodiumColor(result.position),
                "border-b-4",
                constructorColors[result.Constructor.name] || 'border-gray-300'
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl font-bold">
                  {result.position}
                </span>
                <div className="flex items-center gap-1.5">
                  {renderFlag(result.Driver.nationality)}
                  <p className="text-base font-medium text-center">
                    {result.Driver.familyName}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {result.Constructor.name}
                </p>
                <p className="text-sm">
                  {result.Time ? result.Time.time : formatStatus(result.status)}
                </p>
                <p className="text-base font-medium">
                  {result.points} pts
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* 3rd Place */}
      <div className="flex items-end">
        {[2, 1, 3].slice(2).map((pos) => {
          const result = results.find(r => r.position === pos.toString());
          if (!result) return null;
          return (
            <div
              key={result.position}
              className={cn(
                "flex flex-col items-center justify-end p-3 rounded-lg w-full",
                getPodiumColor(result.position),
                "border-b-4",
                constructorColors[result.Constructor.name] || 'border-gray-300'
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold">
                  {result.position}
                </span>
                <div className="flex items-center gap-1.5">
                  {renderFlag(result.Driver.nationality)}
                  <p className="text-sm font-medium text-center">
                    {result.Driver.familyName}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {result.Constructor.name}
                </p>
                <p className="text-xs">
                  {result.Time ? result.Time.time : formatStatus(result.status)}
                </p>
                <p className="text-sm font-medium">
                  {result.points} pts
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const Podium = memo(PodiumComponent); 