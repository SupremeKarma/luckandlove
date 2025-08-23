import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'Zenith Commerce',
  description: 'Discover our curated collection of high-quality products. Built for the modern shopper.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col bg-background text-foreground font-sans antialiased">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
      </body>
    </html>
  );
}
