// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { ThemeContextProvider } from '@/components/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Responsive SSR App',
  description: 'Next.js responsive layout with SSR-safe dark mode',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Inline script to prevent flash of light theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeContextProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <header className="w-full p-4 flex justify-between items-center shadow-md dark:shadow-gray-700">
              <h1 className="text-xl font-bold">My Responsive App</h1>
            </header>

            <main className="flex-1 container mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {children}
            </main>

            <footer className="w-full p-4 text-center bg-gray-100 dark:bg-gray-800">
              &copy; {new Date().getFullYear()} My App
            </footer>
          </div>
        </ThemeContextProvider>
      </body>
    </html>
  );


}>) {
  return (
    <html lang="en" className="dark">
      <head />
      <body
        className={cn(
          'min-h-screen bg-background text-foreground font-sans antialiased'
        )}
      >
        <CartProvider>
          <div className="relative flex min-h-screen flex-col">
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
