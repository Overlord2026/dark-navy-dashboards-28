
import React from 'react';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { EdgeFunctionActivityDashboard } from '@/components/admin/EdgeFunctionActivityDashboard';

export default function EdgeFunctionActivity() {
  return (
    <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin']}>
      <div className="min-h-screen bg-background p-6">
        <EdgeFunctionActivityDashboard />
      </div>
    </AdminRoute>
  );
}
