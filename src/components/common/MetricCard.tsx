import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface MetricCardProps {
  change?: string;
  className?: string;
  icon: LucideIcon;
  label: string;
  tone?: 'emerald' | 'amber' | 'sky' | 'rose' | 'violet';
  value: string;
}

const toneStyles = {
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
  sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200',
};

export function MetricCard({ change, className, icon: Icon, label, tone = 'sky', value }: MetricCardProps) {
  return (
    <Card className={cn('overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl', className)}>
      <CardContent className="relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
            {change ? <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-300">{change}</p> : null}
          </div>
          <div className={cn('rounded-lg p-3', toneStyles[tone])}>
            <Icon aria-hidden="true" className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

