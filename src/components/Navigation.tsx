
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Store,
  Utensils,
  Building,
  Gamepad2,
  Car,
  MessageSquare,
  Shield,
  LogIn,
  LogOut,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartSheet } from './cart-sheet';
import { useToast } from '@/hooks/use-toast';

const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-primary hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};


export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  const { isAuthenticated, signOut, loading, isAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    signOut();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };
  
  const allNavItems = [
    { href: '/products', label: 'Store', icon: Store },
    { href: '/food-delivery', label: 'Food', icon: Utensils },
    { href: '/wholesale', label: 'Wholesale', icon: Building },
    { href: '/gaming', label: 'Gaming', icon: Gamepad2 },
    { href: '/rentals', label: 'Rentals', icon: Car },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
     ...(isAdmin ? [{ href: '/admin/users', label: 'Admin', icon: Shield }] : []),
  ];

  return (
    <>
    <header className="bg-primary/30 backdrop-blur-sm sticky top-0 z-40 border-b border-white/10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-accent">
           <Package2 className="h-7 w-7" />
           Zenith
        </Link>
        <div className="hidden md:flex items-center space-x-2">
          {allNavItems.map(item => (
            <NavItem key={item.href} href={item.href}>
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </NavItem>
          ))}
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart className="h-6 w-6 text-white hover:text-accent" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
                >
                  {cartCount}
                </Badge>
              )}
          </Button>

          {loading ? (
             <Button variant="ghost" size="icon" className="w-9 h-9 animate-pulse bg-muted/50 rounded-full" />
          ) : isAuthenticated ? (
            <>
              <Link href="/account">
                <Button variant="ghost" size="icon">
                  <User className="h-6 w-6 text-white hover:text-accent" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-6 w-6 text-white hover:text-accent" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:flex">
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Button>
               <Button variant="ghost" size="icon" className="sm:hidden">
                <LogIn className="h-6 w-6 text-white hover:text-accent" />
              </Button>
            </Link>
          )}

           {/* Mobile Menu Button */}
             <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Toggle mobile menu"
                        >
                          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] bg-background/95 p-4">
                        <SheetHeader className="mb-8">
                            <SheetTitle>
                                <Link href="/" className="flex items-center space-x-3" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                      <Package2 className="text-primary-foreground h-5 w-5" />
                                    </div>
                                    <span className="text-xl font-bold text-foreground">Zenith Commerce</span>
                                  </Link>
                            </SheetTitle>
                        </SheetHeader>
                        <nav>
                            <div className="grid gap-2">
                              {allNavItems.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                                    usePathname() === item.href
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
      </nav>
    </header>
    <CartSheet isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
}
