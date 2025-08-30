
"use client";
import Link from "next/link";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/90 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-screen-sm grid-cols-4">
        {[
          { href: "/", icon: Home, label: "Home" },
          { href: "/products", icon: ShoppingBag, label: "Shop" },
          { href: "/cart", icon: ShoppingCart, label: "Cart" },
          { href: "/account", icon: User, label: "Account" },
        ].map((i) => (
          <li key={i.href} className="text-center">
            <Link href={i.href} className="flex h-12 flex-col items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-colors">
              <i.icon className="h-5 w-5 mb-0.5" />
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
