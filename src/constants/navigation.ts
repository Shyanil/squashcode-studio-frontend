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
  status?: 'coming-soon';
}

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: routePaths.dashboard, icon: LayoutDashboard, status: 'coming-soon' },
  { label: 'JSON Prompt Generator', path: routePaths.promptGenerator, icon: FileJson2 },
  { label: 'Creative Generator', path: routePaths.creativeGenerator, icon: Sparkles },
  { label: 'Creative Library', path: routePaths.creativeLibrary, icon: LibraryBig, status: 'coming-soon' },
  { label: 'Templates Marketplace', path: routePaths.templates, icon: FolderKanban, status: 'coming-soon' },
  { label: 'Digital Assets', path: routePaths.assets, icon: ImagePlus, status: 'coming-soon' },
  { label: 'Analytics', path: routePaths.analytics, icon: BarChart3, status: 'coming-soon' },
  { label: 'Users', path: routePaths.users, icon: Users, status: 'coming-soon' },
  { label: 'Settings', path: routePaths.settings, icon: Settings, status: 'coming-soon' },
];

export const logoutNavigationItem: NavigationItem = {
  label: 'Logout',
  path: routePaths.login,
  icon: LogOut,
};
