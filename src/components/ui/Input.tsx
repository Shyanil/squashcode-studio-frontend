import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, id, label, ...props }, ref) => {
  const inputId = id ?? props.name;

  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span> : null}
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        id={inputId}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
});

Input.displayName = 'Input';

