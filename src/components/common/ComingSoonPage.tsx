import { FileJson2, Hourglass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Header } from '@/components/layout/Header';
import { Button, Card, CardContent } from '@/components/ui';
import { routePaths } from '@/routes/routePaths';

interface ComingSoonPageProps {
  title: string;
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="animate-fade-in space-y-6">
      <Header
        description="Deployment in progress. This section will be available after the next build phase."
        title={title}
      />

      <Card>
        <CardContent className="flex min-h-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-100">
            <Hourglass aria-hidden="true" className="h-7 w-7" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
            Coming soon
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            {title} is not live yet
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            This page is intentionally locked while deployment work is still in progress.
            Use the finished generator tools for now.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to={routePaths.promptGenerator}>
              <Button className="w-full sm:w-auto" type="button" variant="secondary">
                <FileJson2 aria-hidden="true" className="h-4 w-4" />
                JSON Prompt Generator
              </Button>
            </Link>
            <Link to={routePaths.creativeGenerator}>
              <Button className="w-full sm:w-auto" type="button">
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                Creative Generator
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
