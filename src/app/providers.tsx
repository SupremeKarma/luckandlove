
"use client";
import { AuthProvider } from "@/context/auth-context";
import { QueryProvider } from '@/components/query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
        <TooltipProvider>
            <CartProvider>
                <AuthProvider>
                    {children}
                    <Toaster />
                    <SonnerToaster />
                </AuthProvider>
            </CartProvider>
        </TooltipProvider>
    </QueryProvider>
    );
}
