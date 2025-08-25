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
} from './ui/dropdown-menu';
import { CATEGORIES } from '@/lib/products';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Package2 className="h-6 w-6 text-primary" />
          <span className="font-bold">Zenith</span>
        </Link>
        
        <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <Link href="/products" className="text-muted-foreground transition-colors hover:text-primary">Products</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer text-muted-foreground transition-colors hover:text-primary">Categories</span>
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
              <span className="cursor-pointer text-muted-foreground transition-colors hover:text-primary">More</span>
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
          <form onSubmit={handleSearch} className="relative hidden flex-1 sm:block sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {isClient && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-6 w-6" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">Register</Link>
                    </DropdownMenuItem>
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
