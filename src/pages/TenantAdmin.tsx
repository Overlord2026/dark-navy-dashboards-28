import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { TenantAdminDashboard } from '@/components/admin/TenantAdminDashboard';
import { SuperAdminDashboard } from '@/components/admin/SuperAdminDashboard';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export const TenantAdmin: React.FC = () => {
  const { isSuperAdmin, isTenantAdmin, isAdmin, userRole } = useRoleAccess();
  
  // Security check: only admins can access this page
  if (!isAdmin()) {
    return (
      <ThreeColumnLayout title="Access Denied">
        <Alert className="m-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the administration panel. 
            Required role: Administrator or higher. Your role: {userRole || 'Unknown'}
          </AlertDescription>
        </Alert>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout title="Administration">
      {isSuperAdmin() ? <SuperAdminDashboard /> : <TenantAdminDashboard />}
    </ThreeColumnLayout>
  );
};