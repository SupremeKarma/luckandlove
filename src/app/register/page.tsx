
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const supabase = getSupabase();
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (!supabase) {
        setError('Supabase client is not available.');
        toast({
            title: "Error",
            description: "Could not connect to authentication service.",
            variant: "destructive",
        });
        return;
    }

    try {
      // The handle_new_user trigger now creates the profile for us.
      // We pass the full_name in the metadata so the trigger can use it.
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      setSuccessMessage("Registration successful! Please check your email to confirm your account.");
      toast({
        title: "Account Created!",
        description: "Please check your email to complete registration.",
      });
      // Optionally redirect user after a delay
      setTimeout(() => router.push('/login'), 3000);

    } catch (error: any) {
      console.error("Registration Error:", error);
      setError(error.message || 'An unknown error occurred during registration.');
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
          <CardTitle className="text-3xl font-bold text-accent">Create an Account</CardTitle>
          <CardDescription>Join Zenith Commerce and start exploring</CardDescription>
        </CardHeader>
         {successMessage ? (
            <CardContent>
                <div className="text-center text-green-400 bg-green-500/10 p-4 rounded-md">
                    <p>{successMessage}</p>
                </div>
            </CardContent>
         ) : (
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Your Name" 
                    required 
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
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
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                 <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      required 
                      placeholder="••••••••"
                      className="pl-10"
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                 </div>
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full font-bold">Create Account</Button>
            </CardFooter>
          </form>
         )}
         <div className="text-center text-sm text-muted-foreground pt-4">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-accent hover:underline">
              Sign in
            </Link>
          </div>
      </Card>
    </motion.div>
  );
}
