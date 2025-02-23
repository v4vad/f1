import { memo } from 'react';
import { cn } from "@/lib/utils";
import { formatStatus } from "@/lib/utils/formatting";
import { nationalityToFlag, constructorColors } from "@/lib/constants";
import type { RaceResult } from "@/types/f1";

interface RaceResultCardProps {
  result: RaceResult;
}

const renderFlag = (nationality: string) => {
  const FlagComponent = nationalityToFlag[nationality];
  if (!FlagComponent) return null;
  return <FlagComponent className="w-4 h-3 inline-block" />;
};

function RaceResultCardComponent({ result }: RaceResultCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded",
        "bg-gray-100/50 dark:bg-gray-500/10",
        "hover:bg-gray-200/50 dark:hover:bg-gray-500/20",
        "transition-colors border-l-4",
        constructorColors[result.Constructor.name] || 'border-gray-300'
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold w-4">
          {result.position}
        </span>
        <div>
          <div className="flex items-center gap-1">
            {renderFlag(result.Driver.nationality)}
            <p className="text-xs font-medium">
              {result.Driver.familyName}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {result.Constructor.name}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs">
          {result.Time ? result.Time.time : formatStatus(result.status)}
        </p>
        <p className="text-xs font-medium">{result.points} pts</p>
      </div>
    </div>
  );
}

export const RaceResultCard = memo(RaceResultCardComponent); 