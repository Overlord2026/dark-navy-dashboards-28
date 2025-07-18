import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  
  // Check if user is super admin
  const isSuper = user?.user_metadata?.role === 'system_administrator';
  
  return (
    <ThreeColumnLayout title="Analytics">
      <AnalyticsDashboard 
        tenantId={isSuper ? undefined : currentTenant?.id}
        isSuper={isSuper}
      />
    </ThreeColumnLayout>
  );
};