import { CheckCircle2, Info, TriangleAlert, XCircle } from 'lucide-react';

import { cn } from '@/utils/cn';

type ToastTone = 'success' | 'info' | 'warning' | 'error';

interface ToastProps {
  message: string;
  title: string;
  tone?: ToastTone;
}

const toneStyles: Record<ToastTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-brand-100 bg-brand-50 text-brand-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-red-200 bg-red-50 text-red-800',
};

const toneIcons = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
  error: XCircle,
};

export function Toast({ message, title, tone = 'info' }: ToastProps) {
  const Icon = toneIcons[tone];

  return (
    <div className={cn('flex gap-3 rounded-lg border p-4 shadow-sm', toneStyles[tone])} role="status">
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm opacity-80">{message}</p>
      </div>
    </div>
  );
}

