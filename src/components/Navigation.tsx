
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const closeMobile = () => setIsMobileMenuOpen(false);

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
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
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
          <Link href="/cart" className="rounded-2xl p-2 hover:bg-muted/40" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
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
                <Link href="/cart" onClick={closeMobile} className="rounded-2xl p-2 hover:bg-muted/40" aria-label="Cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
