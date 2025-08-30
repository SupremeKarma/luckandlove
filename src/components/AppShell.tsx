
"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const sheetRef = React.useRef<HTMLDivElement>(null);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    triggerRef.current?.focus();
  };

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    if (isSidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isSidebarOpen]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (isSidebarOpen) {
      const el = sheetRef.current;
      const firstFocusable = el?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-app h-14 flex items-center gap-3">
          <Button
            ref={triggerRef}
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open sidebar"
            aria-expanded={isSidebarOpen}
            aria-controls="admin-sidebar-sheet"
            onClick={openSidebar}
          >
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

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          id="admin-sidebar-sheet"
        >
          <div className="absolute inset-0 bg-black/50" onClick={closeSidebar} />
          <div
            ref={sheetRef}
            className="absolute left-0 top-0 h-full w-[80%] max-w-xs bg-card border-r p-4 space-y-4 elev-lg"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close sidebar"
                onClick={closeSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-px bg-border" />
            <div className="min-h-0 overflow-auto pr-1">{sidebar}</div>
          </div>
        </div>
      )}
    </div>
  );
}
