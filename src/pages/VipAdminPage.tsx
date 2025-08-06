import React from 'react';
import { Navigate } from 'react-router-dom';
import { VipBulkInviteManager } from '@/components/vip/VipBulkInviteManager';
import { useUser } from '@/context/UserContext';

export default function VipAdminPage() {
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
    <div className="container mx-auto p-6">
      <VipBulkInviteManager />
    </div>
  );
}