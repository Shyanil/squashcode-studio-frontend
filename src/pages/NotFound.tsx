import { ArrowLeft, Compass, Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { MockVisual, SearchField } from '@/components/common';
import { Button, Card, CardContent } from '@/components/ui';
import { routePaths } from '@/routes/routePaths';

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[calc(100vh-10rem)] place-items-center animate-fade-in">
      <Card className="w-full max-w-5xl overflow-hidden">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center p-8 lg:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Compass aria-hidden="true" className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">404 Page</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
              This creative route is outside the workspace.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Search for a brand, template, asset, or return to the dashboard to continue building AI-powered campaign creatives.
            </p>
            <div className="mt-6">
              <SearchField placeholder="Search Creative Studio" />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to={routePaths.dashboard}>
                <Button className="w-full sm:w-auto" type="button">
                  <Home aria-hidden="true" className="h-4 w-4" />
                  Back to dashboard
                </Button>
              </Link>
              <Link to={routePaths.creativeLibrary}>
                <Button className="w-full sm:w-auto" type="button" variant="secondary">
                  <Search aria-hidden="true" className="h-4 w-4" />
                  Browse library
                </Button>
              </Link>
            </div>
          </div>
          <CardContent className="bg-slate-50 p-6 dark:bg-slate-950 lg:p-10">
            <MockVisual aspect="aspect-[4/3]" label="Route map" title="Creative Studio navigation" variant="cyan" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ['Dashboard', routePaths.dashboard],
                ['Prompt Generator', routePaths.promptGenerator],
                ['Creative Generator', routePaths.creativeGenerator],
                ['Templates', routePaths.templates],
              ].map(([label, path]) => (
                <Link
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  key={path}
                  to={path}
                >
                  {label}
                  <ArrowLeft aria-hidden="true" className="h-4 w-4 rotate-180" />
                </Link>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

