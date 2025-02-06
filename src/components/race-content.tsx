'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GB, DE, ES, MX, MC, AU, NL, FI, FR, CA, JP, DK, TH, CN, US, IT } from 'country-flag-icons/react/3x2';
import { Breadcrumb } from "@/components/breadcrumb";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Race, RaceResult } from "@/types/f1";

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
  'Red Bull': 'border-[#3671C6]',
  'Mercedes': 'border-[#6CD3BF]',
  'Ferrari': 'border-[#F91536]',
  'McLaren': 'border-[#FF8700]',
  'Aston Martin': 'border-[#358C75]',
  'Alpine F1 Team': 'border-[#2293D1]',
  'Williams': 'border-[#37BEDD]',
  'AlphaTauri': 'border-[#5E8FAA]',
  'Alfa Romeo': 'border-[#C92D4B]',
  'Haas F1 Team': 'border-[#B6BABD]',
  // Legacy teams
  'Red Bull Racing': 'border-[#3671C6]',
  'Mercedes AMG': 'border-[#6CD3BF]',
  'Brawn GP': 'border-[#B0D915]',
  'Renault': 'border-[#FFF500]',
  'Racing Point': 'border-[#F596C8]',
  'Force India': 'border-[#FF5F0F]',
  'Toro Rosso': 'border-[#469BFF]',
  'Lotus F1': 'border-[#FFB800]',
  'Sauber': 'border-[#9B0000]',
  'Manor Marussia': 'border-[#323232]',
  'Marussia': 'border-[#6E0000]',
  'Caterham': 'border-[#016F37]',
  'HRT': 'border-[#B2945B]',
  'Virgin': 'border-[#F7051D]',
  'Toyota': 'border-[#CC1E1D]',
  'Super Aguri': 'border-[#D82E2E]',
  'Spyker': 'border-[#FF6E14]',
  'Midland': 'border-[#D82E2E]',
  'Jordan': 'border-[#FFC700]',
  'BAR': 'border-[#D82E2E]',
  'Minardi': 'border-[#000000]',
  'Jaguar': 'border-[#316E35]',
  'Prost': 'border-[#0F1FDB]',
  'Arrows': 'border-[#FF8700]',
};

const renderFlag = (nationality: string) => {
  const FlagComponent = nationalityToFlag[nationality];
  if (!FlagComponent) return null;
  return <FlagComponent className="w-4 h-3 inline-block" />;
};

const getPodiumColor = (position: string) => {
  switch (position) {
    case "1":
      return "bg-yellow-200/70 dark:bg-yellow-500/30 min-h-[160px]";
    case "2":
      return "bg-gray-200/70 dark:bg-gray-500/30 min-h-[130px]";
    case "3":
      return "bg-orange-200/70 dark:bg-orange-500/30 min-h-[100px]";
    default:
      return "";
  }
};

const formatStatus = (status: string) => {
  if (status === "Finished" || status.includes("+")) return status;
  if (status.includes("Accident")) return "DNF - Accident";
  if (status.includes("Engine")) return "DNF - Engine";
  if (status.includes("Mechanical")) return "DNF - Mechanical";
  if (status.includes("Transmission")) return "DNF - Transmission";
  if (status.includes("Hydraulics")) return "DNF - Hydraulics";
  if (status.includes("Brakes")) return "DNF - Brakes";
  if (status.includes("Electrical")) return "DNF - Electrical";
  if (status.includes("Retired")) return "DNF - Retired";
  if (status.includes("Disqualified")) return "DSQ";
  return `DNF - ${status}`;
};

interface RaceContentProps {
  year: string;
  race: Race;
  results: RaceResult[];
}

export function RaceContent({ year, race, results }: RaceContentProps) {
  return (
    <main className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Breadcrumb
              items={[
                { label: 'Champions', href: '/' },
                { label: year, href: `/season/${year}` },
                { label: race.raceName }
              ]}
            />
            <h1 className="text-3xl font-bold mt-2">{race.raceName}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(race.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="space-y-8">
          {/* Podium */}
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

          {/* Rest of Results */}
          <Card className="bg-transparent shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Other Positions</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="grid grid-cols-2 gap-2">
                {results.slice(3).map((result) => (
                  <div
                    key={result.position}
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
} 