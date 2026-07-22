import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle2, LogIn, MailCheck, RefreshCw, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { routePaths } from '@/routes/routePaths';

const squashCodeLogoUrl = 'https://squashcode.com/wp-content/uploads/2021/05/squashcode-logo.png';

const loginSchema = z.object({
  name: z.string().max(80, 'Keep the name under 80 characters').optional(),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Use at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type AuthMode = 'signup' | 'signin';

function errorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Unable to complete authentication. Please try again.';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, resendVerification, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signup');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routePaths.creativeGenerator, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    setFormError('');
    setNotice('');

    try {
      if (mode === 'signup') {
        if (!values.name?.trim()) {
          setError('name', { message: 'Enter the user name' });
          return;
        }

        const result = await signUp({
          name: values.name.trim(),
          email: values.email,
          password: values.password,
        });

        if (result.needsEmailConfirmation) {
          setVerificationEmail(values.email);
          setNotice('User created in Supabase. Check your email and click the confirmation link before signing in.');
          return;
        }
      } else {
        await login({
          email: values.email,
          password: values.password,
        });
      }

      const fromPath =
        typeof location.state === 'object' &&
        location.state !== null &&
        'from' in location.state &&
        typeof location.state.from === 'object' &&
        location.state.from !== null &&
        'pathname' in location.state.from &&
        typeof location.state.from.pathname === 'string'
          ? location.state.from.pathname
          : routePaths.creativeGenerator;

      navigate(fromPath, { replace: true });
    } catch (error) {
      setFormError(errorMessage(error));
    }
  };

  const handleResendVerification = async () => {
    if (!verificationEmail) {
      setFormError('Enter the email first, then resend the verification email.');
      return;
    }

    setIsResending(true);
    setFormError('');
    setNotice('');

    try {
      await resendVerification(verificationEmail);
      setNotice('Verification email sent again. Check your inbox.');
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(420px,0.9fr)_1.1fr]">
      <section className="flex min-h-screen flex-col justify-center bg-white px-6 py-10 dark:bg-slate-950 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <img alt="SquashCode" className="h-12 w-auto object-contain" src={squashCodeLogoUrl} />
          <div className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
              SquashCode Studio
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">
              {mode === 'signup' ? 'Create your workspace user' : 'Sign in to your workspace'}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Supabase Auth will create and manage the user account for this studio.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              className={[
                'rounded-md px-3 py-2 text-sm font-semibold transition',
                mode === 'signup'
                  ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
              ].join(' ')}
              type="button"
              onClick={() => {
                setMode('signup');
                setFormError('');
                setNotice('');
              }}
            >
              Create user
            </button>
            <button
              className={[
                'rounded-md px-3 py-2 text-sm font-semibold transition',
                mode === 'signin'
                  ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
              ].join(' ')}
              type="button"
              onClick={() => {
                setMode('signin');
                setFormError('');
                setNotice('');
              }}
            >
              Sign in
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {mode === 'signup' ? (
              <Input
                autoComplete="name"
                error={errors.name?.message}
                label="User name"
                placeholder="Shyanil Mishra"
                type="text"
                {...register('name')}
              />
            ) : null}
            <Input
              autoComplete="email"
              error={errors.email?.message}
              label="Email"
              placeholder="name@squashcode.com"
              type="email"
              {...register('email')}
            />
            <Input
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              error={errors.password?.message}
              label="Password"
              placeholder="Minimum 6 characters"
              type="password"
              {...register('password')}
            />
            {formError ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100">
                {formError}
              </div>
            ) : null}
            {notice ? (
              <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                <div className="flex gap-2">
                  <MailCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{notice}</span>
                </div>
                {verificationEmail ? (
                  <Button
                    className="h-9"
                    isLoading={isResending}
                    size="sm"
                    type="button"
                    variant="secondary"
                    onClick={handleResendVerification}
                  >
                    <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
                    Resend verification email
                  </Button>
                ) : null}
              </div>
            ) : null}
            <Button
              className="h-11 w-full"
              isLoading={isSubmitting}
              type="submit"
            >
              {mode === 'signup' ? (
                <UserPlus aria-hidden="true" className="h-4 w-4" />
              ) : (
                <LogIn aria-hidden="true" className="h-4 w-4" />
              )}
              {mode === 'signup' ? 'Create Supabase user' : 'Sign in'}
            </Button>
          </form>
        </div>
      </section>

      <section className="hidden min-h-screen bg-slate-950 text-white lg:block">
        <div className="relative flex h-full flex-col justify-between overflow-hidden p-12">
          <img
            alt=""
            className="absolute right-10 top-10 h-20 w-auto opacity-10"
            src={squashCodeLogoUrl}
          />
          <div className="relative z-10 max-w-xl pt-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-200">
              Production workspace
            </p>
            <h2 className="mt-5 text-5xl font-semibold leading-tight tracking-normal">
              Generate JSON prompts and campaign creatives from one clean account.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              The finished tools are active now. Library, analytics, templates, assets, and settings
              are marked coming soon while deployment continues.
            </p>
          </div>

          <div className="relative z-10 grid gap-4 rounded-xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
            {[
              'Supabase user created on sign up',
              'JSON Prompt Generator protected by session',
              'Creative Generator tied to authenticated user',
            ].map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-emerald-300" />
                <span className="text-sm text-slate-100">{item}</span>
              </div>
            ))}
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-brand-100">
              Continue to active tools
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
