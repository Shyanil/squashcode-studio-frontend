import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, id, label, options, placeholder, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <label className="block">
        {label ? (
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
        ) : null}
        <select
          ref={ref}
          className={cn(
            'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          id={selectId}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
      </label>
    );
  },
);

Select.displayName = 'Select';

