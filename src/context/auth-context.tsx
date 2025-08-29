
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User, Provider } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-browser";
import type { Profile, ProfileRole } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  role: ProfileRole | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithOAuth: (provider: Provider) => Promise<void>;
  signInWithEmailLink?: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Session subscription (single place)
  useEffect(() => {
    let unsub = () => {};
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);

      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        setSession(s ?? null);
      });
      unsub = sub.subscription.unsubscribe;
    })();
    return () => unsub();
  }, []);

  // Load profile when session/user changes
  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }
    void refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  async function refreshProfile() {
    if (!session?.user) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();
      
    if (!error) setProfile((data as Profile) ?? null);
  }

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    session,
    loading,
    profile,
    role: (profile?.role ?? null) as ProfileRole | null,
    refreshProfile,
    signOut: () => supabase.auth.signOut(),
    async signInWithOAuth(provider) {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/account` : undefined,
        },
      });
    },
    async signInWithEmailLink(email: string) {
      await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/account` : undefined,
        },
      });
    },
  }), [session, loading, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
