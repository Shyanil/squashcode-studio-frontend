import {
  ArrowRight,
  CalendarDays,
  Download,
  FileJson2,
  ImagePlus,
  Plus,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge, DonutChart, MetricCard, MiniBarChart, MiniLineChart, MockVisual, SearchField } from '@/components/common';
import { Header } from '@/components/layout/Header';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import {
  dashboardStats,
  generationBars,
  mockAssets,
  mockCreatives,
  mockTemplates,
  recentActivity,
  storageBreakdown,
  usageSeries,
} from '@/constants/mockData';
import { routePaths } from '@/routes/routePaths';

const quickActions = [
  { label: 'Generate creative', description: 'Start from prompt or JSON', path: routePaths.creativeGenerator, icon: WandSparkles },
  { label: 'Build JSON prompt', description: 'Ask the AI prompt assistant', path: routePaths.promptGenerator, icon: FileJson2 },
  { label: 'Upload assets', description: 'Add logos, fonts, references', path: routePaths.assets, icon: ImagePlus },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <SearchField placeholder="Search prompts, brands, campaigns" wrapperClassName="w-full sm:w-80" />
            <Link to={routePaths.creativeGenerator}>
              <Button className="w-full sm:w-auto" type="button">
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                New creative
              </Button>
            </Link>
          </div>
        }
        description="Monitor AI usage, creative production, brand activity, assets, and campaign output from one workspace."
        title="Welcome back, Anika"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <MetricCard
            change={stat.change}
            icon={stat.icon}
            key={stat.label}
            label={stat.label}
            tone={stat.tone as 'emerald' | 'amber' | 'sky' | 'rose'}
            value={stat.value}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>AI Usage Summary</CardTitle>
              <CardDescription>Generation volume across the last 12 active periods.</CardDescription>
            </div>
            <Badge tone="green">91% monthly quota available</Badge>
          </CardHeader>
          <CardContent>
            <MiniLineChart points={usageSeries} />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {['Prompt enhancements', 'Image generations', 'Image analysis'].map((item, index) => (
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950" key={item}>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{item}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{[842, 328, 114][index]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <CardDescription>Generated media and uploaded assets.</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart items={storageBreakdown} />
            <div className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Workspace storage</span>
                <span className="font-semibold text-slate-900 dark:text-white">312 GB / 400 GB</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common workflows for the creative team.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                  key={action.path}
                  to={action.path}
                >
                  <span className="flex items-center gap-3">
                    <span className="rounded-lg bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-950 dark:text-white">{action.label}</span>
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{action.description}</span>
                    </span>
                  </span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generation Trends</CardTitle>
            <CardDescription>Daily production across prompt and image workflows.</CardDescription>
          </CardHeader>
          <CardContent>
            <MiniBarChart values={generationBars} />
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="blue">Peak: Wednesday</Badge>
              <Badge tone="amber">Avg. 67/day</Badge>
              <Badge tone="green">18% faster approvals</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Recent Generated Creatives</CardTitle>
              <CardDescription>Latest mock outputs from active campaigns.</CardDescription>
            </div>
            <Link to={routePaths.creativeLibrary}>
              <Button size="sm" type="button" variant="secondary">
                View library
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockCreatives.slice(0, 3).map((creative) => (
              <article
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
                key={creative.id}
              >
                <MockVisual title={creative.title} variant={creative.variant} />
                <div className="p-4">
                  <p className="font-semibold text-slate-950 dark:text-white">{creative.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{creative.brand}</p>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Uploaded Images</CardTitle>
            <CardDescription>Newest assets from the shared workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAssets.slice(0, 4).map((asset) => (
              <div
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                key={asset.id}
              >
                <div className="flex items-center gap-3">
                  <MockVisual aspect="aspect-square" className="h-12 w-12 p-1" title="" variant={asset.variant} />
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">{asset.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {asset.folder} · {asset.size}
                    </p>
                  </div>
                </div>
                <Download aria-hidden="true" className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Workspace-level creative events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;

              return (
                <div className="flex gap-3" key={activity.label}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.label}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Templates</CardTitle>
            <CardDescription>High-performing formats ready for campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTemplates.slice(0, 4).map((template) => {
              const Icon = template.icon;

              return (
                <div className="flex items-center justify-between gap-3" key={template.id}>
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">{template.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{template.format}</p>
                    </div>
                  </div>
                  <Badge tone="slate">{template.uses}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Team Activity</CardTitle>
            <CardDescription>Approvals, uploads, and collaboration events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {['Brand approval', 'Template saved', 'Asset reviewed', 'Campaign exported'].map((item, index) => (
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950" key={item}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{item}</p>
                  <CalendarDays aria-hidden="true" className="h-4 w-4 text-slate-400" />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {['Anika Rao', 'Kabir Mehta', 'Maya Chen', 'Elena Brooks'][index]} · {[12, 25, 43, 58][index]} min ago
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Link
        className="fixed bottom-6 right-6 hidden rounded-full bg-slate-950 p-4 text-white shadow-xl transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950 md:inline-flex"
        to={routePaths.creativeGenerator}
      >
        <Plus aria-hidden="true" className="h-5 w-5" />
        <span className="sr-only">Create</span>
      </Link>
    </div>
  );
}
