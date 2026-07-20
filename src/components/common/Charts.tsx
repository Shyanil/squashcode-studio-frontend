import { cn } from '@/utils/cn';

interface MiniLineChartProps {
  className?: string;
  points: number[];
}

interface MiniBarChartProps {
  className?: string;
  values: number[];
}

interface DonutChartProps {
  items: Array<{ color: string; label: string; value: number }>;
}

export function MiniLineChart({ className, points }: MiniLineChartProps) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 44 - ((point - min) / span) * 34;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  const areaPath = `${path} L 100 50 L 0 50 Z`;

  return (
    <svg className={cn('h-28 w-full overflow-visible', className)} viewBox="0 0 100 54" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#lineFill)" />
      <path d={path} fill="none" stroke="#0f766e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

export function MiniBarChart({ className, values }: MiniBarChartProps) {
  const max = Math.max(...values);

  return (
    <div className={cn('flex h-28 items-end gap-2', className)}>
      {values.map((value, index) => (
        <div className="flex flex-1 items-end rounded-full bg-slate-100 dark:bg-slate-800" key={`${value}-${index}`}>
          <div
            className="w-full rounded-full bg-gradient-to-t from-amber-500 to-emerald-400 transition-all"
            style={{ height: `${Math.max(16, (value / max) * 100)}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ items }: DonutChartProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;
  const gradient = items
    .map((item) => {
      const start = (accumulated / total) * 100;
      accumulated += item.value;
      const end = (accumulated / total) * 100;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div className="flex items-center gap-5">
      <div
        aria-hidden="true"
        className="relative h-28 w-28 rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="absolute inset-4 rounded-full bg-white shadow-inner dark:bg-slate-900" />
        <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-slate-950 dark:text-white">
          78%
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div className="flex items-center gap-2 text-sm" key={item.label}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
            <span className="font-medium text-slate-900 dark:text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

