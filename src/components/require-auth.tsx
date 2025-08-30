
"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function RequireAuth({
  children,
  fallback,
  redirectTo = "/login",
}: {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [loading, isAuthenticated, redirectTo, router]);

  if (loading) return (fallback ?? <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">Loading...</div>);

  if (!isAuthenticated) {
    // We are redirecting, so we can show a loading state or nothing.
    // Returning null is clean because the layout won't flash.
    return null;
  }
  
  return <>{children}</>;
}
