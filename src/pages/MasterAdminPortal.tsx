import React from 'react';
import { Navigate } from 'react-router-dom';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
// import { MasterAdminDashboard } from '@/components/admin/MasterAdminDashboard';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export const MasterAdminPortal: React.FC = () => {
  const { isSuperAdmin, userRole } = useRoleAccess();

  // Security check: only system administrators can access master admin portal
  if (!isSuperAdmin()) {
    return (
      <ThreeColumnLayout title="Access Denied">
        <Alert className="m-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the Master Admin Portal. 
            Required role: System Administrator. Your role: {userRole || 'Unknown'}
          </AlertDescription>
        </Alert>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout title="Master Admin Portal">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Master Admin Portal</h1>
        <p className="text-muted-foreground">Admin dashboard functionality coming soon.</p>
      </div>
    </ThreeColumnLayout>
  );
};