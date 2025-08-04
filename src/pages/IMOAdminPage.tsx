import React from 'react';
import { IMOAdminDashboard } from '@/components/insurance/IMOAdminDashboard';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

export default function IMOAdminPage() {
  return (
    <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin', 'agency_admin']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <IMOAdminDashboard />
      </div>
    </AuthWrapper>
  );
}