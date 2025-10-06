"use client";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

// Force rebuild - removed useFirstLoginToolInstaller call (Oct 6, 2025)

type AuthValue = {
  user: any | null;
  session?: any | null;
  loading: boolean;
  // Legacy compatibility properties
  userProfile?: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailConfirmed: boolean;
  isQABypassActive: boolean;
  login: (...args: any[]) => Promise<{ success: boolean; error?: string; requires2FA?: boolean; userId?: string }>;
  signup: (...args: any[]) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithApple: () => Promise<{ success: boolean; error?: string }>;
  signInWithMicrosoft: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void> | void;
  updateUserProfile: (profile: any) => Promise<void> | void;
  refreshProfile: () => Promise<void> | void;
  resendConfirmation: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  complete2FALogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
};

const DEFAULT_AUTH: AuthValue = {
  user: null,
  session: null,
  loading: false,
  userProfile: null,
  isAuthenticated: false,
  isLoading: false,
  isEmailConfirmed: true,
  isQABypassActive: false,
  login: async () => ({ success: false, error: "Auth disabled (demo)" }),
  signup: async () => ({ success: false, error: "Auth disabled (demo)" }),
  signInWithGoogle: async () => ({ success: false, error: "Auth disabled (demo)" }),
  signInWithApple: async () => ({ success: false, error: "Auth disabled (demo)" }),
  signInWithMicrosoft: async () => ({ success: false, error: "Auth disabled (demo)" }),
  logout: async () => {},
  updateUserProfile: async () => {},
  refreshProfile: async () => {},
  resendConfirmation: async () => ({ success: false, error: "Auth disabled (demo)" }),
  resetPassword: async () => ({ success: false, error: "Auth disabled (demo)" }),
  complete2FALogin: async () => ({ success: false, error: "Auth disabled (demo)" })
};

const AuthCtx = createContext<AuthValue>(DEFAULT_AUTH);

/** Fail-soft hook: never throws; always returns a valid object. */
export function useAuth(): AuthValue {
  try {
    return useContext(AuthCtx) ?? DEFAULT_AUTH;
  } catch {
    return DEFAULT_AUTH;
  }
}

/** Demo-safe provider: NO hooks/effects; constant value. */
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthCtx.Provider value={DEFAULT_AUTH}>
      {children}
    </AuthCtx.Provider>
  );
}
