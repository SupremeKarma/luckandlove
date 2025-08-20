import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Zenith Commerce. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm hover:underline">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm hover:underline">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
