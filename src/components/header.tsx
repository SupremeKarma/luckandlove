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
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Label } from './ui/label';

export function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [isClient, setIsClient] = useState(false);

  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    setIsClient(true);
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
      await signInWithEmailAndPassword(auth, email, password);
      // The dropdown will close automatically, and the user state will update.
    } catch (error: any) {
      setAuthError(error.message);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // The dropdown will close automatically, and the user state will update.
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700/50 bg-black/30 backdrop-blur-lg">
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
            </DropdownMenuContent>
          </DropdownMenu>

        </nav>
        
        <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:gap-4">
          <div className="hidden flex-1 sm:block sm:max-w-xs">
            {/* Search input is now on the main page */}
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
                    <DropdownMenuLabel>Sign In or Register</DropdownMenuLabel>
                    <div className="p-2">
                       <form className="space-y-2">
                          <Input id="email" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-800/80"/>
                          <Input id="password" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-800/80"/>
                         {authError && <p className="text-destructive text-xs p-1">{authError}</p>}
                         <div className="flex gap-2 pt-2">
                            <Button type="submit" onClick={handleLogin} className="w-full">Login</Button>
                            <Button type="submit" variant="secondary" onClick={handleRegister} className="w-full">Register</Button>
                         </div>
                       </form>
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
