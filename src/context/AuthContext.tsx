import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import runFirstLoginToolInstaller from "@/hooks/useFirstLoginToolInstaller";
import { logReactIdentity } from "@/debug/reactInspector";

logReactIdentity("AuthContext");

type AuthState = { 
  user: any | null; 
  loading: boolean;
  // Legacy compatibility properties
  session: any | null;
  userProfile: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailConfirmed: boolean;
  isQABypassActive: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requires2FA?: boolean; userId?: string }>;
  signup: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithApple: () => Promise<{ success: boolean; error?: string }>;
  signInWithMicrosoft: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  complete2FALogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
};
const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const m = await import('@/integrations/supabase/client');
        const sb:any = (m as any).supabase || (m as any).default || m;
        if (sb?.auth?.getSession) {
          const { data } = await sb.auth.getSession();
          setUser(data?.session?.user ?? null);
        } else if (sb?.auth?.user) {
          setUser(sb.auth.user() ?? null);
        }
      } finally { setLoading(false); }
    })();
  }, []);

  // Run first-login installer once after mount (deferred to next tick)
  useEffect(() => {
    const id = setTimeout(() => {
      try { runFirstLoginToolInstaller(); } catch {}
    }, 0);
    return () => clearTimeout(id);
  }, []);

  // Legacy compatibility methods (no-op implementations)
  const mockMethod = async () => ({ success: false, error: 'Not implemented' });
  const mockVoidMethod = async () => {};

  const value = useMemo(() => ({ 
    user, 
    loading,
    // Legacy compatibility properties
    session: user ? { user } : null,
    userProfile: user ? { 
      id: user.id, 
      name: user.user_metadata?.name || user.email,
      email: user.email,
      role: 'user'
    } : null,
    isAuthenticated: !!user,
    isLoading: loading,
    isEmailConfirmed: true,
    isQABypassActive: false,
    login: mockMethod,
    signup: mockMethod,
    signInWithGoogle: mockMethod,
    signInWithApple: mockMethod,
    signInWithMicrosoft: mockMethod,
    logout: mockVoidMethod,
    updateUserProfile: mockVoidMethod,
    refreshProfile: mockVoidMethod,
    resendConfirmation: mockMethod,
    resetPassword: mockMethod,
    complete2FALogin: mockMethod
  }), [user, loading]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}