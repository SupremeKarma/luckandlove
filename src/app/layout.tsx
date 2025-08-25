
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/components/Navigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Footer } from '@/components/footer';
import { QueryProvider } from '@/components/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zenith Commerce',
  description: 'Your one-stop shop for premium products.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <TooltipProvider>
            <CartProvider>
              <div className="relative flex min-h-screen flex-col bg-background text-foreground antialiased">
                <Navigation />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
              <SonnerToaster />
            </CartProvider>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
