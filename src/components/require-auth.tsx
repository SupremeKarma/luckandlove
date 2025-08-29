"use client";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useRouter } from "next/navigation";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;     // shown while checking session
  unauth?: ReactNode;       // shown when not signed in (or redirect)
  redirectTo?: string;      // optional redirect when not authed
};

export function RequireAuth({ children, fallback, unauth, redirectTo }: Props) {
  const mounted = useHasMounted();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!mounted) return;

    let unsub = () => {};
    (async () => {
      const { data } = await supabase.auth.getSession();
      setAuthed(!!data.session);

      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        setAuthed(!!session);
        if (!session && redirectTo) {
          router.push(redirectTo);
        }
      });
      unsub = sub.subscription.unsubscribe;
    })();

    return () => unsub();
  }, [mounted, redirectTo, router]);

  useEffect(() => {
    if (authed === false && redirectTo) {
      router.push(redirectTo);
    }
  }, [authed, redirectTo, router]);

  if (!mounted || authed === null) return (fallback ?? <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">Loading...</div>);

  if (!authed) {
    if (redirectTo) {
      // Router will handle redirection, return loading state
      return (fallback ?? <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">Loading...</div>);
    }
    return unauth ?? <div>Please sign in to continue.</div>;
  }

  return <>{children}</>;
}
