import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800', className)} />;
}

