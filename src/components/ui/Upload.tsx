import { UploadCloud } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

interface UploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  description?: string;
  label?: string;
}

export function Upload({ className, description = 'PNG, JPG, SVG, or PDF assets', label = 'Upload files', ...props }: UploadProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center transition hover:border-brand-500 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
        className,
      )}
    >
      <UploadCloud aria-hidden="true" className="h-8 w-8 text-brand-600" />
      <span className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-100">{label}</span>
      <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</span>
      <input className="sr-only" type="file" {...props} />
    </label>
  );
}

