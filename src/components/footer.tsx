'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary/5 mt-16 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-accent mb-4 block">
              Zenith
            </Link>
            <p className="text-sm text-muted-foreground">Your one-stop shop for everything you can imagine. Built for the future of commerce.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4">Shop</p>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-accent">Store</Link></li>
              <li><Link href="/wholesale" className="text-sm text-muted-foreground hover:text-accent">Wholesale</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4">Services</p>
            <ul className="space-y-2">
              <li><Link href="/food-delivery" className="text-sm text-muted-foreground hover:text-accent">Food Delivery</Link></li>
              <li><Link href="/gaming" className="text-sm text-muted-foreground hover:text-accent">Gaming</Link></li>
              <li><Link href="/rentals" className="text-sm text-muted-foreground hover:text-accent">Rentals</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4">Follow Us</p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-accent"><Facebook /></a>
              <a href="#" className="text-muted-foreground hover:text-accent"><Twitter /></a>
              <a href="#" className="text-muted-foreground hover:text-accent"><Instagram /></a>
              <a href="#" className="text-muted-foreground hover:text-accent"><Linkedin /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Zenith. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
