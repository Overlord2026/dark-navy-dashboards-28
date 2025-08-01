import React from 'react';
import { Navigate } from 'react-router-dom';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
// import { MasterAdminDashboard } from '@/components/admin/MasterAdminDashboard';
import { useUser } from '@/context/UserContext';

export const MasterAdminPortal: React.FC = () => {
  const { userProfile } = useUser();

  // Check if user has master admin access
  const hasMasterAdminAccess = userProfile?.role && [
    'master_admin', 
    'system_administrator'
  ].includes(userProfile.role);

  if (!hasMasterAdminAccess) {
    return <Navigate to="/client-dashboard" replace />;
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