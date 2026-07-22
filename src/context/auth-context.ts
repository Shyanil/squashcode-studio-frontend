import { createContext } from 'react';

import type { AuthUser, LoginPayload } from '@/types';

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  signUp: (payload: LoginPayload & { name: string }) => Promise<{ needsEmailConfirmation: boolean }>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
