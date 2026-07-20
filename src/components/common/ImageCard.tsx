import { ImageIcon } from 'lucide-react';

import { cn } from '@/utils/cn';

interface ImageCardProps {
  className?: string;
  imageUrl?: string;
  meta?: string;
  title: string;
}

export function ImageCard({ className, imageUrl, meta, title }: ImageCardProps) {
  return (
    <article
      className={cn(
        'overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-slate-100 dark:bg-slate-800">
        {imageUrl ? (
          <img alt={title} className="h-full w-full object-cover" src={imageUrl} />
        ) : (
          <ImageIcon aria-hidden="true" className="h-9 w-9 text-slate-400" />
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-slate-900 dark:text-white">{title}</h3>
        {meta ? <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{meta}</p> : null}
      </div>
    </article>
  );
}

