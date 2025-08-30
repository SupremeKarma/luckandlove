
'use client';

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { ProfileRole, Profile } from '@/lib/types';
import { getSupabase } from '@/lib/supabase';
import type { AuthChangeEvent, Session, SupabaseClient, User } from '@supabase/supabase-js';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  role: ProfileRole | null;
  profile: Profile | null;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<any>;
};


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    const supabaseClient = getSupabase();
    setSupabase(supabaseClient);
    
    const fetchSessionAndProfile = async (currentUser: User | null) => {
      if (currentUser) {
        try {
            const { data, error } = await supabaseClient
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single();
            if (error) throw error;
            setProfile(data as Profile);
        } catch (e) {
          console.error("Error fetching profile:", e);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setUser(currentUser);
    }
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        await fetchSessionAndProfile(session?.user ?? null);
      } catch (e) {
        console.error("Error fetching initial session:", e);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setLoading(true);
        await fetchSessionAndProfile(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    if (!supabase) throw new Error("Supabase client not initialized.");
    return supabase.auth.signInWithPassword({ email, password: pass });
  }, [supabase]);

  const logout = useCallback(async () => {
    if (!supabase) throw new Error("Supabase client not initialized.");
    return supabase.auth.signOut();
  }, [supabase]);

  const value: AuthContextValue = { 
      user, 
      profile,
      login, 
      logout, 
      loading, 
      isAdmin: profile?.role === 'admin',
      role: profile?.role ?? null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return { ...context, isAuthenticated: !!context.user };
};
