
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import {
  ShoppingCart,
  Menu,
  X,
  User,
  Package2,
  Home,
  ShoppingBag,
  Gamepad2,
  Car,
  Utensils,
  MessageSquare,
  Archive,
  Shield,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartSheet } from './cart-sheet';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { role } = useAuth();

  const mainNavItems = [
    { path: '/', label: 'Home'},
    { path: '/products', label: 'Products' },
    { path: '/food-delivery', label: 'Food'},
    { path: '/wholesale', label: 'Wholesale'},
    { path: '/gaming', label: 'Gaming'},
    { path: '/rentals', label: 'Rentals'},
    ...(role === 'admin' ? [{ path: '/admin/users', label: 'Admin' }] : []),
  ];

  const allNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Products', icon: ShoppingBag },
    { path: '/gaming', label: 'Gaming', icon: Gamepad2 },
    { path: '/food-delivery', label: 'Food Delivery', icon: Utensils },
    { path: '/wholesale', label: 'Wholesale', icon: Archive },
    { path: '/rentals', label: 'Rentals', icon: Car },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    ...(role === 'admin' ? [{ path: '/admin/users', label: 'Admin', icon: Shield }] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    if (path.startsWith('/admin')) return pathname.startsWith('/admin');
    return pathname.startsWith(path);
  };

  return (
    <>
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package2 className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">Zenith</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link href="/account" aria-label="My Account">
              <Button variant="ghost" size="icon">
                <User size={20} />
              </Button>
            </Link>

            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
                  >
                    {cartCount}
                  </Badge>
                )}
            </Button>

            {/* Mobile Menu Button */}
             <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Toggle mobile menu"
                        >
                          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] bg-background/95">
                        <SheetHeader>
                            <SheetTitle>
                                <Link href="/" className="flex items-center space-x-3" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                      <Package2 className="text-primary-foreground h-5 w-5" />
                                    </div>
                                    <span className="text-xl font-bold text-foreground">Zenith Commerce</span>
                                  </Link>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="mt-8">
                            <div className="grid gap-2">
                              {allNavItems.map((item) => (
                                <Link
                                  key={item.path}
                                  href={item.path}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                                    isActive(item.path)
                                      ? 'bg-accent text-accent-foreground'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  <item.icon size={20} />
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
    <CartSheet isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
}
