import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '~/hooks/useAuth';
import { useAuthenticationStore } from '~/store/useAuthenticationStore';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { toast } from 'sonner';
import { TextField } from '../ui/TextField';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginForm, loginFormError, loading, setLoginForm, setLoginFormError } = useAuth();
  const { isAuthenticated, authenticate } = useAuthenticationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login();
      // Only redirect if login was successful (no mfaRequired)
      if(response?.mfaRequired){
        navigate({ to: '/auth/verify-mfa', search: { data: response } })

        return response
      }
      authenticate(response?.tokens, response?.user);
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      console.log(err.response);
      if(err.response?.status === 429){
        toast.error('Too many requests. Please try again later.', {
          position: 'top-right',
        })
        setLoginFormError({email: null, password: null})
      }
      setLoginForm({ ...loginForm, password: null })
    }
  };

  // Redirect if already authenticated (e.g., returning user)
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <TextField
                label="Email"
                id="email"
                placeholder="Enter email"
                error={loginFormError?.email}
                onErrorClear={() => setLoginFormError({ email: undefined })}
                value={loginForm.email || ''}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <TextField
                id="password"
                label="Password"
                type="password"
                placeholder="Enter password"
                value={loginForm.password || ''}
                error={loginFormError?.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
