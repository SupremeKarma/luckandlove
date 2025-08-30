"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <html>
      <body className="container-app py-24 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="text-2xl font-semibold">Something went wrong</div>
          <div className="text-sm text-muted-foreground">{error.message}</div>
          <button className="button-primary" onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  );
}
