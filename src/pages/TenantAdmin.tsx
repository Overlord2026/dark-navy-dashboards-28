import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { TenantAdminDashboard } from '@/components/admin/TenantAdminDashboard';
import { SuperAdminDashboard } from '@/components/admin/SuperAdminDashboard';
import { useAuth } from '@/context/AuthContext';

export const TenantAdmin: React.FC = () => {
  const { user } = useAuth();
  
  // In a real implementation, you'd check the user's role from their profile
  // For now, we'll show SuperAdmin if the user email contains 'admin'
  const isSuperAdmin = user?.email?.includes('admin');

  return (
    <ThreeColumnLayout title="Administration">
      {isSuperAdmin ? <SuperAdminDashboard /> : <TenantAdminDashboard />}
    </ThreeColumnLayout>
  );
};