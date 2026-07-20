import { Bell, Menu, Moon, Search } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button aria-label="Open sidebar" className="lg:hidden" onClick={onMenuClick} size="icon" type="button" variant="ghost">
            <Menu aria-hidden="true" className="h-5 w-5" />
          </Button>
          <div className="hidden min-w-80 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 dark:border-slate-800 dark:bg-slate-900 md:flex">
            <Search aria-hidden="true" className="h-4 w-4" />
            <span className="text-sm">Search creatives, brands, templates</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button aria-label="Toggle theme" size="icon" type="button" variant="ghost">
            <Moon aria-hidden="true" className="h-5 w-5" />
          </Button>
          <Button aria-label="Notifications" size="icon" type="button" variant="ghost">
            <Bell aria-hidden="true" className="h-5 w-5" />
          </Button>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
            SC
          </div>
        </div>
      </div>
    </header>
  );
}

