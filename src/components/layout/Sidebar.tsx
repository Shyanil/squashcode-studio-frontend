import { NavLink } from 'react-router-dom';

import { logoutNavigationItem, navigationItems } from '@/constants/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const LogoutIcon = logoutNavigationItem.icon;
  const { logout } = useAuth();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
          SC
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">SquashCode</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">Creative Studio</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white',
                  isActive && 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-100',
                )
              }
              end={item.path === '/'}
              key={item.path}
              onClick={onClose}
              to={item.path}
            >
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.status === 'coming-soon' ? (
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  Soon
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <NavLink
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
          onClick={() => {
            void logout();
            onClose();
          }}
          to={logoutNavigationItem.path}
        >
          <LogoutIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
          <span>{logoutNavigationItem.label}</span>
        </NavLink>
      </div>
    </aside>
  );
}
