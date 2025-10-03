"use client";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { UserProfile } from '@/types/user';

export type { UserProfile };

interface UserContextType {
  userProfile: UserProfile | null;
  supabaseUser: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  refreshUserProfile: () => Promise<UserProfile | null>;
}

const DEFAULT_USER: UserContextType = {
  userProfile: null,
  supabaseUser: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false, error: 'Auth disabled (demo)' }),
  logout: () => {},
  updateUserProfile: () => {},
  refreshUserProfile: async () => null
};

const UserContext = createContext<UserContextType>(DEFAULT_USER);

/** Fail-soft hook: never throws; always returns a valid object. */
export const useUser = (): UserContextType => {
  try {
    return useContext(UserContext) ?? DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
};

/** Demo-safe provider: NO hooks/effects; constant value. */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserContext.Provider value={DEFAULT_USER}>
      {children}
    </UserContext.Provider>
  );
};
