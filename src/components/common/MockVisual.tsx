import { Sparkles } from 'lucide-react';

import type { MockCreative } from '@/constants/mockData';
import { cn } from '@/utils/cn';

interface MockVisualProps {
  aspect?: string;
  className?: string;
  label?: string;
  title: string;
  variant?: MockCreative['variant'];
  imageUrl?: string;
}

const variantStyles: Record<NonNullable<MockVisualProps['variant']>, string> = {
  coral: 'from-rose-400 via-orange-300 to-amber-100',
  mint: 'from-emerald-400 via-teal-200 to-sky-100',
  indigo: 'from-indigo-500 via-sky-300 to-slate-100',
  amber: 'from-amber-400 via-orange-200 to-stone-100',
  rose: 'from-fuchsia-400 via-rose-300 to-orange-100',
  cyan: 'from-cyan-400 via-blue-200 to-emerald-100',
};

export function MockVisual({
  aspect = 'aspect-[4/3]',
  className,
  label,
  title,
  variant = 'mint',
  imageUrl,
}: MockVisualProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-gradient-to-br p-4',
        imageUrl && 'bg-slate-950 p-0',
        aspect,
        variantStyles[variant],
        className,
      )}
    >
      {imageUrl ? (
        <img
          alt={title}
          className="absolute inset-0 z-0 h-full w-full object-contain"
          src={imageUrl}
        />
      ) : (
        <>
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/35 blur-sm" />
          <div className="absolute -bottom-10 left-8 h-32 w-32 rounded-full bg-slate-950/10 blur-md" />
        </>
      )}
      {!imageUrl ? (
        <div className="relative z-10 flex h-full flex-col justify-between rounded-lg border border-white/40 bg-white/35 p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
              {label ?? 'AI Creative'}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
            </span>
          </div>
          <div>
            <div className="mb-3 h-12 w-20 rounded-lg bg-white/60 shadow-sm" />
            <p className="max-w-[12rem] text-lg font-bold leading-tight text-slate-950">{title}</p>
            <div className="mt-3 flex gap-2">
              <span className="h-2 w-16 rounded-full bg-white/70" />
              <span className="h-2 w-10 rounded-full bg-white/50" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
