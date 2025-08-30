
"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function RequireRole({
  role,
  children,
  fallback,
  redirectTo,
}: {
  role: "admin" | "user";
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}) {
  const { isAuthenticated, role: userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !userRole || (role === "admin" && userRole !== "admin")) {
      if (redirectTo) router.replace(redirectTo);
    }
  }, [loading, isAuthenticated, userRole, role, redirectTo, router]);

  if (loading) return fallback ?? <div>Loading…</div>;
  if (!isAuthenticated || !userRole || (role === "admin" && userRole !== "admin")) return null;
  return <>{children}</>;
}
