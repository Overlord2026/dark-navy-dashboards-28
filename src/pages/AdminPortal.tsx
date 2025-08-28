import React from 'react';
import { Navigate } from 'react-router-dom';
import { AdminPortalLayout } from '@/components/admin/AdminPortalLayout';
import { AdminPortalDashboard } from '@/components/admin/AdminPortalDashboard';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export function AdminPortal() {
  const { isAdmin, userRole } = useRoleAccess();

  // Security check: only admins can access this portal
  if (!isAdmin()) {
    return (
      <AdminPortalLayout>
        <Alert className="m-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the Admin Portal. 
            Required role: Administrator or higher. Your role: {userRole || 'Unknown'}
          </AlertDescription>
        </Alert>
      </AdminPortalLayout>
    );
  }

  return (
    <AdminPortalLayout>
      <AdminPortalDashboard />
    </AdminPortalLayout>
  );
}