import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, id, label, ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <label className="block">
        {label ? (
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
        ) : null}
        <textarea
          ref={ref}
          className={cn(
            'min-h-28 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          id={textareaId}
          {...props}
        />
        {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
      </label>
    );
  },
);

Textarea.displayName = 'Textarea';

