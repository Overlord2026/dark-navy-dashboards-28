import React, { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

type PersonaType = 'client' | 'advisor' | 'accountant' | 'attorney' | 'admin' | 'system_administrator' | 'tenant_admin';

interface PersonaGuardProps {
  children: React.ReactNode;
  allowedPersonas: PersonaType[];
  fallbackPath?: string;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PersonaGuard error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-destructive">Something went wrong</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

export function PersonaGuard({ children, allowedPersonas, fallbackPath = '/select-persona' }: PersonaGuardProps) {
  const { user, session, userProfile, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth/profile
  if (isLoading) {
    return <LoadingFallback />;
  }

  // If not authenticated, redirect to signin with return path
  if (!isAuthenticated || !user) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?redirect=${returnTo}`} replace />;
  }

  // Get persona from profile or app_metadata
  const getPersona = (): PersonaType | null => {
    // First check user profile from database
    if (userProfile?.role) {
      return userProfile.role as PersonaType;
    }
    
    // Fallback to JWT app_metadata
    const appMetadata = session?.user?.app_metadata;
    if (appMetadata?.role) {
      return appMetadata.role as PersonaType;
    }
    
    return null;
  };

  const userPersona = getPersona();

  // If no persona found, redirect to persona selection
  if (!userPersona) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check if user's persona is allowed
  const isAuthorized = allowedPersonas.includes(userPersona);

  if (!isAuthorized) {
    // Redirect unauthorized personas to appropriate fallback
    return <Navigate to={fallbackPath} replace />;
  }

  // Wrap children with Suspense and ErrorBoundary
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}