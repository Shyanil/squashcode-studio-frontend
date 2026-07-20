import { Calendar, Download, Filter, Grid3X3, Heart, List, MoreHorizontal, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge, MockVisual, SearchField } from '@/components/common';
import { Header } from '@/components/layout/Header';
import { Button, Card, CardContent, Select } from '@/components/ui';
import { mockCreatives } from '@/constants/mockData';
import type { MockCreative } from '@/constants/mockData';

const sortOptions = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Most used', value: 'used' },
  { label: 'Favorites', value: 'favorites' },
];

const collections = ['All', 'Healthcare', 'Real Estate', 'Restaurant', 'Education', 'Social Ads', 'Landing Pages'];

export default function CreativeLibraryPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [selectedCreative, setSelectedCreative] = useState<MockCreative | null>(mockCreatives[0]);

  const filteredCreatives = useMemo(
    () =>
      mockCreatives.filter((creative) =>
        `${creative.title} ${creative.brand} ${creative.campaign} ${creative.tags.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        description="Search, organize, review, and export generated creatives across every active brand and campaign."
        title="Creative Library"
      />

      <Card>
        <CardContent className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <SearchField onChange={(event) => setQuery(event.target.value)} placeholder="Search by brand, tag, campaign" value={query} wrapperClassName="w-full xl:max-w-md" />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary">
              <Filter aria-hidden="true" className="h-4 w-4" />
              Filter
            </Button>
            <Select className="w-40" options={sortOptions} />
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
              <Button aria-label="Grid view" onClick={() => setView('grid')} size="icon" type="button" variant={view === 'grid' ? 'primary' : 'ghost'}>
                <Grid3X3 aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button aria-label="List view" onClick={() => setView('list')} size="icon" type="button" variant={view === 'list' ? 'primary' : 'ghost'}>
                <List aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {collections.map((collection, index) => (
          <button
            className={
              index === 0
                ? 'shrink-0 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-950'
                : 'shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }
            key={collection}
            type="button"
          >
            {collection}
          </button>
        ))}
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className={view === 'grid' ? 'grid gap-5 md:grid-cols-2 2xl:grid-cols-3' : 'space-y-3'}>
          {filteredCreatives.map((creative) =>
            view === 'grid' ? (
              <article
                className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                key={creative.id}
                onClick={() => setSelectedCreative(creative)}
              >
                <div className="relative">
                  <MockVisual aspect="aspect-[4/3]" className="rounded-none" label={creative.aspectRatio} title={creative.title} variant={creative.variant} />
                  <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                    <Button aria-label="Favorite" size="icon" type="button" variant="secondary">
                      <Heart aria-hidden="true" className="h-4 w-4" />
                    </Button>
                    <Button aria-label="Download" size="icon" type="button" variant="secondary">
                      <Download aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-950 dark:text-white">{creative.title}</h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{creative.brand}</p>
                    </div>
                    <MoreHorizontal aria-hidden="true" className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {creative.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{creative.campaign}</span>
                    <span>{creative.date}</span>
                  </div>
                </div>
              </article>
            ) : (
              <button
                className="flex w-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-brand-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center"
                key={creative.id}
                onClick={() => setSelectedCreative(creative)}
                type="button"
              >
                <MockVisual aspect="aspect-square" className="h-24 w-24 shrink-0" title={creative.title} variant={creative.variant} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-950 dark:text-white">{creative.title}</span>
                  <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{creative.brand}</span>
                  <span className="mt-3 flex flex-wrap gap-2">
                    {creative.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </span>
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{creative.date}</span>
              </button>
            ),
          )}
        </div>

        <Card className="h-fit xl:sticky xl:top-24">
          {selectedCreative ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
                <div>
                  <h2 className="font-semibold text-slate-950 dark:text-white">Creative Details</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedCreative.id}</p>
                </div>
                <Button aria-label="Close details" onClick={() => setSelectedCreative(null)} size="icon" type="button" variant="ghost">
                  <X aria-hidden="true" className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="space-y-5">
                <MockVisual title={selectedCreative.title} variant={selectedCreative.variant} />
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{selectedCreative.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedCreative.campaign}</p>
                </div>
                <div className="grid gap-3">
                  {[
                    ['Brand', selectedCreative.brand],
                    ['Created', selectedCreative.date],
                    ['Aspect ratio', selectedCreative.aspectRatio],
                    ['Campaign', selectedCreative.campaign],
                  ].map(([label, value]) => (
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950" key={label}>
                      <span className="text-slate-500 dark:text-slate-400">{label}</span>
                      <span className="font-medium text-slate-950 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCreative.tags.map((tag) => (
                    <Badge key={tag} tone="blue">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="secondary">
                    <Download aria-hidden="true" className="h-4 w-4" />
                    Download
                  </Button>
                  <Button type="button" variant="secondary">
                    <Heart aria-hidden="true" className="h-4 w-4" />
                    Favorite
                  </Button>
                  <Button type="button" variant="secondary">
                    <Search aria-hidden="true" className="h-4 w-4" />
                    Similar
                  </Button>
                  <Button type="button" variant="danger">
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="text-center">
              <Calendar aria-hidden="true" className="mx-auto h-10 w-10 text-slate-400" />
              <h2 className="mt-4 font-semibold text-slate-950 dark:text-white">Select a creative</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Open details, actions, tags, and export options from the gallery.</p>
            </CardContent>
          )}
        </Card>
      </section>
    </div>
  );
}

