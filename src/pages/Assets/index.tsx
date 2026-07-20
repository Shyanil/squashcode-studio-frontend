import { Download, Eye, FileImage, Filter, Grid3X3, List, UploadCloud } from 'lucide-react';
import { useState } from 'react';

import { Badge, MockVisual, SearchField } from '@/components/common';
import { Header } from '@/components/layout/Header';
import { Button, Card, CardContent, CardHeader, CardTitle, Upload } from '@/components/ui';
import { assetFolders, mockAssets } from '@/constants/mockData';
import type { MockAsset } from '@/constants/mockData';

export default function AssetsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<MockAsset>(mockAssets[0]);

  return (
    <div className="grid gap-6 animate-fade-in xl:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Header
          actions={
            <Button type="button">
              <UploadCloud aria-hidden="true" className="h-4 w-4" />
              Upload
            </Button>
          }
          description="Manage logos, icons, backgrounds, PNGs, SVGs, fonts, product imagery, and video references."
          title="Digital Assets"
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {assetFolders.map((folder) => {
            const Icon = folder.icon;

            return (
              <Card className="transition hover:-translate-y-0.5 hover:shadow-lg" key={folder.label}>
                <CardContent className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">{folder.label}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{folder.count} assets</p>
                  </div>
                  <div className="rounded-lg bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <Card>
          <CardContent className="space-y-4">
            <Upload description="Drop brand files, campaign references, product shots, fonts, or videos" label="Drag & Drop Upload" multiple />
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <SearchField placeholder="Search assets" wrapperClassName="w-full lg:max-w-md" />
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary">
                  <Filter aria-hidden="true" className="h-4 w-4" />
                  Filter
                </Button>
                <div className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
                  <Button aria-label="Grid view" onClick={() => setView('grid')} size="icon" type="button" variant={view === 'grid' ? 'primary' : 'ghost'}>
                    <Grid3X3 aria-hidden="true" className="h-4 w-4" />
                  </Button>
                  <Button aria-label="List view" onClick={() => setView('list')} size="icon" type="button" variant={view === 'list' ? 'primary' : 'ghost'}>
                    <List aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className={view === 'grid' ? 'grid gap-5 md:grid-cols-2 2xl:grid-cols-3' : 'space-y-3'}>
          {mockAssets.map((asset) =>
            view === 'grid' ? (
              <button
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                type="button"
              >
                <MockVisual aspect="aspect-[4/3]" className="rounded-none" label={asset.type} title={asset.name} variant={asset.variant} />
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950 dark:text-white">{asset.name}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{asset.folder}</p>
                    </div>
                    <Badge>{asset.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{asset.size}</span>
                    <span>{asset.updatedAt}</span>
                  </div>
                </div>
              </button>
            ) : (
              <button
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-brand-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                type="button"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="rounded-lg bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <FileImage aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-slate-950 dark:text-white">{asset.name}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{asset.folder}</span>
                  </span>
                </span>
                <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">{asset.size}</span>
              </button>
            ),
          )}
        </section>
      </div>

      <Card className="h-fit xl:sticky xl:top-24">
        <CardHeader>
          <CardTitle>Preview Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <MockVisual title={selectedAsset.name} variant={selectedAsset.variant} />
          <div>
            <h2 className="font-semibold text-slate-950 dark:text-white">{selectedAsset.name}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedAsset.folder}</p>
          </div>
          <div className="space-y-3">
            {[
              ['Type', selectedAsset.type],
              ['Size', selectedAsset.size],
              ['Updated', selectedAsset.updatedAt],
              ['Usage', '18 campaigns'],
            ].map(([label, value]) => (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950" key={label}>
                <span className="text-slate-500 dark:text-slate-400">{label}</span>
                <span className="font-semibold text-slate-950 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Storage usage</span>
              <span className="font-semibold text-slate-950 dark:text-white">78%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary">
              <Eye aria-hidden="true" className="h-4 w-4" />
              Preview
            </Button>
            <Button type="button">
              <Download aria-hidden="true" className="h-4 w-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

