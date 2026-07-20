import { Loader2 } from 'lucide-react';

import { cn } from '@/utils/cn';

interface LoaderProps {
  className?: string;
  label?: string;
}

export function Loader({ className, label = 'Loading' }: LoaderProps) {
  return (
    <div className={cn('inline-flex items-center gap-2 text-sm text-slate-500', className)} role="status">
      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

