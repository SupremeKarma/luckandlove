"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useCart } from "@/context/cart-context";

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const { cartCount } = useCart();

  const closeMobile = () => {
    setIsMobileMenuOpen(false);
    triggerRef.current?.focus();
  };

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isMobileMenuOpen]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/food-delivery", label: "Food Delivery" },
    { href: "/wholesale", label: "Wholesale" },
    { href: "/gaming", label: "Gaming" },
    { href: "/rentals", label: "Rentals" },
    { href: "/chat", label: "Live Chat" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-app h-14 flex items-center gap-3">
        <Button
          ref={triggerRef}
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/" className="font-semibold">Luck&Love</Link>

        <div className="hidden md:flex items-center gap-6 ml-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors hover:text-foreground ${
                pathname === l.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block w-64">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search products…" />
            </div>
          </div>
          <ThemeToggle />
          <Link href="/account" className="rounded-2xl p-2 hover:bg-muted/40" aria-label="Account">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="relative rounded-2xl p-2 hover:bg-muted/40" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-foreground text-[10px] leading-5 text-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" id="mobile-menu">
          <div className="absolute inset-0 bg-black/50" onClick={closeMobile} />
          <nav
            className="absolute left-0 top-0 h-full w-[80%] max-w-xs bg-card border-r p-4 space-y-4"
            aria-label="Mobile menu"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={closeMobile}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search…" />
            </div>
            <div className="grid gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeMobile}
                  className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                    pathname === l.href ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link href="/account" onClick={closeMobile} className="rounded-2xl p-2 hover:bg-muted/40" aria-label="Account">
                  <User className="h-5 w-5" />
                </Link>
                <Link href="/cart" onClick={closeMobile} className="relative rounded-2xl p-2 hover:bg-muted/40" aria-label="Cart">
                  <ShoppingCart className="h-5 w-5" />
                   {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-foreground text-[10px] leading-5 text-center">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
