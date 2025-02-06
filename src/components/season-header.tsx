'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Breadcrumb } from '@/components/breadcrumb';

interface SeasonHeaderProps {
  year: string;
}

export function SeasonHeader({ year }: SeasonHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <Breadcrumb
          items={[
            { label: 'Champions', href: '/' },
            { label: year }
          ]}
        />
        <h1 className="text-3xl font-bold mt-2">{year} Season</h1>
      </div>
      <ThemeToggle />
    </div>
  );
} 