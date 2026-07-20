import { X } from 'lucide-react';
import type { PropsWithChildren } from 'react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface ModalProps extends PropsWithChildren {
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
}

export function Modal({ children, description, onClose, open, title }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div
        aria-modal="true"
        className={cn(
          'w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900',
        )}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
          </div>
          <Button aria-label="Close modal" onClick={onClose} size="icon" type="button" variant="ghost">
            <X aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

