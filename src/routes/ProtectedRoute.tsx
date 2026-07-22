import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Loader } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { routePaths } from '@/routes/routePaths';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={routePaths.login} />;
  }

  return <Outlet />;
}
