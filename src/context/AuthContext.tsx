import { useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { AuthContext } from '@/context/auth-context';
import type { AuthContextValue } from '@/context/auth-context';
import type { AuthUser, LoginPayload } from '@/types';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading] = useState(false);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login: async (_payload: LoginPayload) => {
        // Placeholder for JWT-backed login flow.
        void _payload;
      },
      logout: () => {
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
