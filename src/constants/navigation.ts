import {
  BarChart3,
  FileJson2,
  FolderKanban,
  ImagePlus,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { routePaths } from '@/routes/routePaths';

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: routePaths.dashboard, icon: LayoutDashboard },
  { label: 'JSON Prompt Generator', path: routePaths.promptGenerator, icon: FileJson2 },
  { label: 'Creative Generator', path: routePaths.creativeGenerator, icon: Sparkles },
  { label: 'Creative Library', path: routePaths.creativeLibrary, icon: LibraryBig },
  { label: 'Templates', path: routePaths.templates, icon: FolderKanban },
  { label: 'Assets', path: routePaths.assets, icon: ImagePlus },
  { label: 'Analytics', path: routePaths.analytics, icon: BarChart3 },
  { label: 'Users', path: routePaths.users, icon: Users },
  { label: 'Settings', path: routePaths.settings, icon: Settings },
];

export const logoutNavigationItem: NavigationItem = {
  label: 'Logout',
  path: routePaths.login,
  icon: LogOut,
};
