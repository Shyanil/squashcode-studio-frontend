import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { routePaths } from '@/routes/routePaths';

const loginSchema = z.object({
  email: z.string().email('Enter a valid work email'),
  password: z.string().min(8, 'Use at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    await login(values);
    navigate(routePaths.dashboard);
  };

  return (
    <Card>
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
          SC
        </div>
        <CardTitle>SquashCode Creative Studio</CardTitle>
        <CardDescription>Sign in with your internal workspace account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            autoComplete="email"
            error={errors.email?.message}
            label="Email"
            placeholder="name@squashcode.com"
            type="email"
            {...register('email')}
          />
          <Input
            autoComplete="current-password"
            error={errors.password?.message}
            label="Password"
            placeholder="Password"
            type="password"
            {...register('password')}
          />
          <Button className="w-full" isLoading={isSubmitting} type="submit">
            <LogIn aria-hidden="true" className="h-4 w-4" />
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

