import type { PropsWithChildren } from 'react';

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="grid min-h-screen bg-slate-50 px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center">{children}</div>
    </main>
  );
}

