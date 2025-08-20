'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, User, Package2 } from 'lucide-react';
import { CartSheet } from './cart-sheet';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Package2 className="h-6 w-6 text-accent" />
          <span className="font-bold">Zenith Commerce</span>
        </Link>
        
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="transition-colors hover:text-accent">Home</Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-accent">All Products</Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-accent">Categories</Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-accent">About</Link>
        </nav>
        
        <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:gap-4">
          <div className="relative hidden flex-1 sm:block sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10" />
          </div>
          <Link href="/account">
            <Button variant="ghost" size="icon">
              <User className="h-6 w-6" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
