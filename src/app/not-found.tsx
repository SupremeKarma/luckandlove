
'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      `404 Error: User attempted to access non-existent route: ${pathname}`
    );
  }, [pathname]);

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center text-center">
      <div>
        <h1 className="text-9xl font-bold gradient-text">404</h1>
        <p className="text-2xl font-semibold mt-4 mb-2">Oops! Page Not Found</p>
        <p className="text-muted-foreground mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="hero">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
}
