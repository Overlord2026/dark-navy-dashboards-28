import React from 'react';
import { Navigate } from 'react-router-dom';
import { AdminPortalLayout } from '@/components/admin/AdminPortalLayout';
import { AdminPortalDashboard } from '@/components/admin/AdminPortalDashboard';
import { useUser } from '@/context/UserContext';

export function AdminPortal() {
  const { userProfile } = useUser();

  // Check if user has required admin role
  const hasAdminAccess = userProfile?.role && [
    'admin', 
    'system_administrator', 
    'tenant_admin',
    'superadmin'
  ].includes(userProfile.role);

  if (!hasAdminAccess) {
    return <Navigate to="/client-dashboard" replace />;
  }

  return (
    <AdminPortalLayout>
      <AdminPortalDashboard />
    </AdminPortalLayout>
  );
}