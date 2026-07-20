import type { ReactNode } from 'react';

interface HeaderProps {
  actions?: ReactNode;
  description?: string;
  title: string;
}

export function Header({ actions, description, title }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

