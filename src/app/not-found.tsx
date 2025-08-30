import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-app py-24 text-center">
      <div className="mx-auto max-w-md space-y-4">
        <div className="text-4xl font-semibold">404</div>
        <p className="text-muted-foreground">
          We couldn’t find that page. It might have moved or no longer exists.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
