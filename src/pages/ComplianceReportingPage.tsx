import React from 'react';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { ComplianceMonitor } from '@/components/security/ComplianceMonitor';

export const ComplianceReportingPage: React.FC = () => {
  return (
    <AuthWrapper 
      requireAuth={true} 
      allowedRoles={['admin', 'system_administrator', 'tenant_admin']}
    >
      <div className="container mx-auto px-4 py-8">
        <ComplianceMonitor />
      </div>
    </AuthWrapper>
  );
};