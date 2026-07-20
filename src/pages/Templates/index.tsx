import { Eye, Filter, Star, WandSparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge, MockVisual, SearchField } from '@/components/common';
import { Header } from '@/components/layout/Header';
import { Button, Card, CardContent, Modal } from '@/components/ui';
import { mockTemplates, templateCategories } from '@/constants/mockData';
import type { MockTemplate } from '@/constants/mockData';

export default function TemplatesPage() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<MockTemplate | null>(null);

  const filteredTemplates = useMemo(
    () =>
      mockTemplates.filter((template) => {
        const matchesCategory = category === 'All' || template.category === category;
        const matchesQuery = `${template.title} ${template.category} ${template.format}`.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      }),
    [category, query],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Header description="Browse campaign-ready templates for social ads, stories, banners, posters, flyers, and industry packs." title="Templates Marketplace" />

      <Card>
        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchField onChange={(event) => setQuery(event.target.value)} placeholder="Search templates" value={query} wrapperClassName="w-full lg:max-w-md" />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary">
              <Filter aria-hidden="true" className="h-4 w-4" />
              Filters
            </Button>
            <Button type="button">
              <WandSparkles aria-hidden="true" className="h-4 w-4" />
              Generate from template
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {templateCategories.map((item) => (
          <button
            className={
              category === item
                ? 'shrink-0 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-950'
                : 'shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }
            key={item}
            onClick={() => setCategory(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;

          return (
            <article
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              key={template.id}
            >
              <div className="relative">
                <MockVisual aspect="aspect-[3/4]" className="rounded-none" label={template.category} title={template.title} variant={template.variant} />
                <button
                  className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/30 group-hover:opacity-100"
                  onClick={() => setSelectedTemplate(template)}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg">
                    <Eye aria-hidden="true" className="h-4 w-4" />
                    Preview
                  </span>
                </button>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-slate-950 dark:text-white">{template.title}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{template.format}</p>
                  </div>
                  <Icon aria-hidden="true" className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex items-center justify-between">
                  <Badge tone="blue">{template.category}</Badge>
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Star aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
                    {template.uses} uses
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <Modal
        description={selectedTemplate ? `${selectedTemplate.category} · ${selectedTemplate.format} · ${selectedTemplate.uses} uses` : undefined}
        onClose={() => setSelectedTemplate(null)}
        open={Boolean(selectedTemplate)}
        title={selectedTemplate?.title ?? 'Template preview'}
      >
        {selectedTemplate ? (
          <div className="space-y-4">
            <MockVisual aspect="aspect-[16/10]" label={selectedTemplate.category} title={selectedTemplate.title} variant={selectedTemplate.variant} />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                <p className="text-xs text-slate-500">Format</p>
                <p className="mt-1 font-semibold text-slate-950 dark:text-white">{selectedTemplate.format}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                <p className="text-xs text-slate-500">Category</p>
                <p className="mt-1 font-semibold text-slate-950 dark:text-white">{selectedTemplate.category}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                <p className="text-xs text-slate-500">Usage</p>
                <p className="mt-1 font-semibold text-slate-950 dark:text-white">{selectedTemplate.uses}</p>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button onClick={() => setSelectedTemplate(null)} type="button" variant="secondary">
                <X aria-hidden="true" className="h-4 w-4" />
                Close
              </Button>
              <Button type="button">
                <WandSparkles aria-hidden="true" className="h-4 w-4" />
                Use template
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
