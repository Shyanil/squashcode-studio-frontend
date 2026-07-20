import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

export function SearchField({ className, wrapperClassName, ...props }: SearchFieldProps) {
  return (
    <label className={cn('relative block', wrapperClassName)}>
      <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        className={cn(
          'h-10 w-full rounded-lg border border-slate-200 bg-white/90 pl-9 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white',
          className,
        )}
        type="search"
        {...props}
      />
    </label>
  );
}

