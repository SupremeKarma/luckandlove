
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/footer';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zenith Commerce - Your Ultimate Online Marketplace',
  description: 'Explore a vast range of products, food delivery, gaming tournaments, rentals, and more. All in one place.',
  generator: 'Zenith Commerce',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-background text-foreground antialiased">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
