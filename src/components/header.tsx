'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, User, Package2 } from 'lucide-react';
import { CartSheet } from './cart-sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { CATEGORIES } from '@/lib/products';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/firebase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    setIsClient(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Package2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">FutureMart</span>
        </Link>
        
        <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <Link href="/products" className="text-gray-300 transition-colors hover:text-primary">Products</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer text-gray-300 transition-colors hover:text-primary">Categories</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {CATEGORIES.map((category) => (
                <DropdownMenuSub key={category.name}>
                  <DropdownMenuSubTrigger>
                    {category.name}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {category.subcategories.map((sub) => (
                      <Link key={sub} href={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}>
                        <DropdownMenuItem>
                          {sub}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer text-gray-300 transition-colors hover:text-primary">More</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild><Link href="/ride-sharing">Ride Sharing</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/food-delivery">Food Delivery</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/rentals">Rentals</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/gaming">Gaming</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/chat">Chat</Link></DropdownMenuItem>
               <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/test-emulator">Test Emulator</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </nav>
        
        <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:gap-4">
          <div className="hidden flex-1 sm:block sm:max-w-xs">
             <form onSubmit={handleSearch}>
               <div className="relative">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input
                   type="search"
                   placeholder="Search products..."
                   className="w-full rounded-lg bg-background pl-8"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
             </form>
          </div>

          {isClient && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-6 w-6" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {user ? (
                  <>
                    <DropdownMenuLabel>Welcome, {user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Sign In</DropdownMenuLabel>
                    <div className="p-2">
                       <form className="space-y-2" onSubmit={handleLogin}>
                          <Input id="email" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-800/80"/>
                          <Input id="password" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-800/80"/>
                         {authError && <p className="text-destructive text-xs p-1">{authError}</p>}
                         <div className="flex gap-2 pt-2">
                            <Button type="submit" className="w-full">Login</Button>
                         </div>
                       </form>
                       <div className="mt-4 text-center text-sm">
                         Don't have an account?{' '}
                         <Link href="/register" className="font-medium text-primary hover:underline">
                           Sign up
                         </Link>
                       </div>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
