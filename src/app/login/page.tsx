
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

// Simple inline SVG for GitHub icon
const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="currentColor" height="1em" width="1em" {...props}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { login, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/account');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    try {
      const { error } = await login(email, password);
      if (error) throw error;
      
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });
      router.push('/account');
    } catch (error: any) {
        setError(error.message);
        toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
        });
    }
  };

  const handleGitHubLogin = async () => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    if (error) {
        toast({
            title: "GitHub Login Failed",
            description: error.message,
            variant: "destructive",
        });
    }
  };
  
  if (loading) {
    return <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-10rem)]"
    >
      <Card className="w-full max-w-md glass-effect">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-accent">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue to Zenith Commerce</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <Button
                variant="outline"
                className="w-full"
                onClick={handleGitHubLogin}
                type="button"
            >
                <GitHubIcon className="mr-2 h-4 w-4" />
                Sign in with GitHub
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  required 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex items-center justify-end">
              <Link href="#" className="text-sm text-accent hover:underline">
                Forgot password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full font-bold">Sign In</Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-accent hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
