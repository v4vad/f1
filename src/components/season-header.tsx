'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Breadcrumb } from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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
  );
} 