
"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppShell({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-app h-14 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="font-semibold">Store Manager</div>
          <div className="ml-auto" />
        </div>
      </header>

      <div className="container-app grid lg:grid-cols-[260px_1fr] gap-6 py-6">
        <aside className="hidden lg:block">{sidebar}</aside>
        <main className="min-w-0">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[80%] max-w-xs bg-card p-4 elev-lg">{sidebar}</div>
        </div>
      )}
    </div>
  );
}
