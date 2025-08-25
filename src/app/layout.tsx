
'use client';

import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/components/Navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Footer } from '@/components/footer';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <CartProvider>
              <div className="relative flex min-h-screen flex-col bg-background text-foreground font-sans antialiased">
                <Navigation />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
              <SonnerToaster />
            </CartProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
