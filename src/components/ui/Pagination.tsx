import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface PaginationProps {
  onNext?: () => void;
  onPrevious?: () => void;
  page: number;
  totalPages: number;
}

export function Pagination({ onNext, onPrevious, page, totalPages }: PaginationProps) {
  return (
    <nav className="flex items-center justify-between gap-3" aria-label="Pagination">
      <Button disabled={page <= 1} onClick={onPrevious} type="button" variant="secondary">
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        Previous
      </Button>
      <span className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </span>
      <Button disabled={page >= totalPages} onClick={onNext} type="button" variant="secondary">
        Next
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </Button>
    </nav>
  );
}

