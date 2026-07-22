import { useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { User } from '@supabase/supabase-js';

import { AuthContext } from '@/context/auth-context';
import type { AuthContextValue } from '@/context/auth-context';
import type { AuthUser, LoginPayload } from '@/types';
import { supabaseClient } from '@/services/supabaseClient';

function authRedirectUrl() {
  const configuredUrl = import.meta.env.VITE_AUTH_REDIRECT_URL as string | undefined;
  const currentRedirectUrl = `${window.location.origin}/login`;
  const isLocalHost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (import.meta.env.PROD && !isLocalHost) {
    return currentRedirectUrl;
  }

  if (configuredUrl?.trim()) {
    return configuredUrl;
  }

  return currentRedirectUrl;
}

function mapSupabaseUser(user: User): AuthUser {
  const name =
    typeof user.user_metadata.name === 'string' && user.user_metadata.name.trim()
      ? user.user_metadata.name
      : user.email?.split('@')[0] ?? 'SquashCode User';

  return {
    id: user.id,
    name,
    email: user.email ?? '',
    role: 'Admin',
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabaseClient) {
      setIsLoading(false);
      return undefined;
    }

    let mounted = true;

    supabaseClient.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }

      setUser(data.session?.user ? mapSupabaseUser(data.session.user) : null);
      setIsLoading(false);
    });

    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login: async (payload: LoginPayload) => {
        if (!supabaseClient) {
          throw new Error('Supabase Auth is not configured.');
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: payload.email,
          password: payload.password,
        });

        if (error) {
          throw error;
        }

        if (data.session?.user) {
          setUser(mapSupabaseUser(data.session.user));
          return;
        }

        throw new Error('Email confirmation is required before sign in.');
      },
      logout: async () => {
        if (supabaseClient) {
          await supabaseClient.auth.signOut();
        }

        setUser(null);
      },
      resendVerification: async (email: string) => {
        if (!supabaseClient) {
          throw new Error('Supabase Auth is not configured.');
        }

        const { error } = await supabaseClient.auth.resend({
          type: 'signup',
          email,
          options: {
            emailRedirectTo: authRedirectUrl(),
          },
        });

        if (error) {
          throw error;
        }
      },
      signUp: async (payload: LoginPayload & { name: string }) => {
        if (!supabaseClient) {
          throw new Error('Supabase Auth is not configured.');
        }

        const { data, error } = await supabaseClient.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: {
            emailRedirectTo: authRedirectUrl(),
            data: {
              name: payload.name,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.session?.user) {
          setUser(mapSupabaseUser(data.session.user));
          return { needsEmailConfirmation: false };
        }

        return { needsEmailConfirmation: true };
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
