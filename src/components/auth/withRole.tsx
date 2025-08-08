import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

interface WithRoleProps {
  requiredRoles: string[];
  fallbackPath?: string;
  children: React.ReactNode;
}

export const WithRole: React.FC<WithRoleProps> = ({
  requiredRoles,
  fallbackPath = '/auth/login',
  children
}) => {
  const { user } = useAuth();
  const { userProfile } = useUser();
  const { toast } = useToast();

  // Check if user is authenticated
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check if user has required role
  const hasRequiredRole = userProfile?.role && requiredRoles.includes(userProfile.role);

  if (!hasRequiredRole) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this area.",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Higher-order component version
export function withRole<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRoles: string[],
  fallbackPath?: string
) {
  return function WithRoleComponent(props: P) {
    return (
      <WithRole requiredRoles={requiredRoles} fallbackPath={fallbackPath}>
        <WrappedComponent {...props} />
      </WithRole>
    );
  };
}