
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ProfileRole, Profile } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

// A type that is compatible with the old user/profile structure
// to minimize changes in other components.
type MockUser = {
  id: string;
  email: string;
  full_name: string;
  role: ProfileRole;
  avatar_url?: string;
}

type AuthContextValue = {
  user: MockUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: ProfileRole | null;
  profile: MockUser | null; // For compatibility
  login: (email: string) => void;
  signOut: () => void;
};


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on the client
    try {
      const storedUser = localStorage.getItem('zenithUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('zenithUser');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string) => {
    // This is a mock login.
    const userData: MockUser = { 
      id: new Date().toISOString(), // simple unique id
      email, 
      full_name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user' 
    };
    setUser(userData);
    localStorage.setItem('zenithUser', JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('zenithUser');
  };

  const value: AuthContextValue = { 
      user, 
      login, 
      signOut, 
      loading, 
      isAuthenticated: !!user, 
      isAdmin: user?.role === 'admin',
      role: user?.role ?? null,
      profile: user, // For compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
