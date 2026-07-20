import { Activity, BarChart3, Clock3, Database, Image, Layers3, PieChart, Sparkles, TrendingUp } from 'lucide-react';

import { Badge, DonutChart, MetricCard, MiniBarChart, MiniLineChart } from '@/components/common';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { generationBars, mockBrands, recentActivity, storageBreakdown, usageSeries } from '@/constants/mockData';

const analyticsMetrics = [
  { label: 'AI usage', value: '8.42M', change: '+14.8% tokens', icon: Sparkles, tone: 'violet' },
  { label: 'Images generated', value: '1,284', change: '+328 this month', icon: Image, tone: 'emerald' },
  { label: 'Storage used', value: '312 GB', change: '78% of plan', icon: Database, tone: 'amber' },
  { label: 'Avg. render time', value: '9.6s', change: '1.8s faster', icon: Clock3, tone: 'sky' },
];

const promptStats = [
  { label: 'Structured JSON prompts', value: 64 },
  { label: 'Image-only prompts', value: 21 },
  { label: 'Reference-assisted', value: 15 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        description="Measure AI generation volume, usage efficiency, storage growth, brand performance, and prompt behavior."
        title="Analytics"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsMetrics.map((metric) => (
          <MetricCard
            change={metric.change}
            icon={metric.icon}
            key={metric.label}
            label={metric.label}
            tone={metric.tone as 'emerald' | 'amber' | 'sky' | 'violet'}
            value={metric.value}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Generation Trends</CardTitle>
              <CardDescription>Monthly production and approval velocity.</CardDescription>
            </div>
            <Badge tone="green">+22% vs last month</Badge>
          </CardHeader>
          <CardContent>
            <MiniLineChart points={usageSeries} />
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                ['Approved creatives', '846'],
                ['Average variants', '4.7'],
                ['Team exports', '392'],
              ].map(([label, value]) => (
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950" key={label}>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt Statistics</CardTitle>
            <CardDescription>Prompt types used across campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {promptStats.map((stat) => (
              <div key={stat.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{stat.label}</span>
                  <span className="font-semibold text-slate-950 dark:text-white">{stat.value}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" style={{ width: `${stat.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Images Generated</CardTitle>
            <CardDescription>Daily output for this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <MiniBarChart values={generationBars} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Used</CardTitle>
            <CardDescription>Media allocation by category.</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart items={storageBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Used Aspect Ratio</CardTitle>
            <CardDescription>Format preference across generated images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ['1:1 Square', 42],
              ['4:5 Portrait', 28],
              ['9:16 Story', 19],
              ['16:9 Landscape', 11],
            ].map(([label, value]) => (
              <div className="flex items-center gap-3" key={label}>
                <span className="w-28 text-sm text-slate-500 dark:text-slate-400">{label}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-slate-950 dark:bg-white" style={{ width: `${value}%` }} />
                </div>
                <span className="w-9 text-right text-sm font-semibold text-slate-950 dark:text-white">{value}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Top Brands</CardTitle>
            <CardDescription>Generation volume by brand system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockBrands.map((brand, index) => (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800" key={brand.id}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
                    {brand.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">{brand.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{brand.industry}</p>
                  </div>
                </div>
                <Badge tone={index === 0 ? 'green' : 'slate'}>{[326, 284, 198, 142][index]} assets</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Timeline</CardTitle>
            <CardDescription>Creative workflow events with measurable impact.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800" key={activity.label}>
                  <div className="flex items-start gap-3">
                    <span className="rounded-lg bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">{activity.label}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {[TrendingUp, BarChart3, PieChart, Activity].map((IconComponent, iconIndex) =>
                      iconIndex === index ? <IconComponent aria-hidden="true" className="h-4 w-4 text-emerald-600" key={iconIndex} /> : null,
                    )}
                    Impact score {92 - index * 8}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Popular Templates</CardTitle>
            <CardDescription>Template usage by category.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {['Instagram Product Drop', 'Healthcare Awareness', 'Real Estate Flyer', 'Restaurant Story'].map((template, index) => (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-950" key={template}>
                <div className="flex items-center gap-3">
                  <Layers3 aria-hidden="true" className="h-5 w-5 text-slate-400" />
                  <span className="font-medium text-slate-950 dark:text-white">{template}</span>
                </div>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{[842, 691, 572, 439][index]} uses</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Used Brand</CardTitle>
            <CardDescription>RenewCare Clinics leads generation volume this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6 dark:from-emerald-950 dark:via-slate-900 dark:to-amber-950">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Top brand</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">RenewCare Clinics</p>
                </div>
                <Sparkles aria-hidden="true" className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ['Creatives', '326'],
                  ['Prompts', '742'],
                  ['Exports', '188'],
                ].map(([label, value]) => (
                  <div className="rounded-lg bg-white/75 p-3 dark:bg-slate-950/70" key={label}>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
