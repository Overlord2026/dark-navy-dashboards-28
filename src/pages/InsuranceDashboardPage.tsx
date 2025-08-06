import React from 'react';
import { InsuranceDashboard } from '@/components/insurance/InsuranceDashboard';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

export default function InsuranceDashboardPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-7xl mx-auto">
          <InsuranceDashboard />
        </div>
      </div>
    </AuthWrapper>
  );
}