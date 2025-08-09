import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/hooks/useOrganization';
import { OrganizationRole } from '@/types/operations';

interface RequireOrgRoleProps {
  children: React.ReactNode;
  roles: OrganizationRole[];
  fallbackPath?: string;
}

export const RequireOrgRole: React.FC<RequireOrgRoleProps> = ({ 
  children, 
  roles, 
  fallbackPath = '/unauthorized' 
}) => {
  const { user } = useAuth();
  const { currentEmployee, loading } = useOrganization();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !currentEmployee) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!roles.includes(currentEmployee.role as OrganizationRole)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};