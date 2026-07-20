import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import AssetsPage from '@/pages/Assets';
import AnalyticsPage from '@/pages/Analytics';
import CreativeGeneratorPage from '@/pages/CreativeGenerator';
import CreativeLibraryPage from '@/pages/CreativeLibrary';
import DashboardPage from '@/pages/Dashboard';
import LoginPage from '@/pages/Login';
import NotFoundPage from '@/pages/NotFound';
import PromptGeneratorPage from '@/pages/PromptGenerator';
import SettingsPage from '@/pages/Settings';
import TemplatesPage from '@/pages/Templates';
import UsersPage from '@/pages/Users';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { routePaths } from '@/routes/routePaths';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
        path={routePaths.login}
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route element={<DashboardPage />} path={routePaths.dashboard} />
          <Route element={<PromptGeneratorPage />} path={routePaths.promptGenerator} />
          <Route element={<CreativeGeneratorPage />} path={routePaths.creativeGenerator} />
          <Route element={<CreativeLibraryPage />} path={routePaths.creativeLibrary} />
          <Route element={<TemplatesPage />} path={routePaths.templates} />
          <Route element={<AssetsPage />} path={routePaths.assets} />
          <Route element={<AnalyticsPage />} path={routePaths.analytics} />
          <Route element={<UsersPage />} path={routePaths.users} />
          <Route element={<SettingsPage />} path={routePaths.settings} />
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Route>
      <Route element={<Navigate replace to={routePaths.dashboard} />} path="*" />
    </Routes>
  );
}
