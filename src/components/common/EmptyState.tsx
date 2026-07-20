import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  action?: ReactNode;
  description?: string;
  title: string;
}

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
      <Inbox aria-hidden="true" className="mx-auto h-10 w-10 text-slate-400" />
      <h2 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">{title}</h2>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

