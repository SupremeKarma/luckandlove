
'use client';
import {
  LayoutDashboard,
  Package,
  Receipt,
  Settings as SettingsIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RequireRole } from '@/components/require-role';
import React from 'react';

function NavItem({
  icon,
  label,
  href,
  active,
}: {
  icon?: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link href={href}>
        <div
            className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                ? 'bg-muted font-semibold'
                : 'text-muted-foreground hover:bg-muted/50'
            }`}
        >
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <span>{label}</span>
        </div>
    </Link>
  );
}


function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
        { href: '/admin/orders', label: 'Orders', icon: <Receipt className="h-4 w-4" /> },
        { href: '/admin/products', label: 'Products', icon: <Package className="h-4 w-4" /> },
        { href: '/admin/settings', label: 'Settings', icon: <SettingsIcon className="h-4 w-4" /> },
    ];

    return (
        <div className="grid h-screen w-full grid-cols-[260px_1fr]">
            <aside className="border-r bg-background">
                <div className="px-4 py-4 flex items-center gap-2 border-b">
                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <div className="font-semibold">Admin Panel</div>
                        <div className="text-muted-foreground text-xs">Zenith Commerce</div>
                    </div>
                </div>
                <nav className="px-2 space-y-1 overflow-y-auto h-[calc(100vh-72px)] py-4">
                     {navItems.map((item) => (
                        <NavItem 
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            active={pathname === item.href}
                        />
                    ))}
                </nav>
            </aside>
            <main className="overflow-y-auto">{children}</main>
        </div>
    );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireRole role="admin" redirectTo="/not-authorized">
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </RequireRole>
    )
}
