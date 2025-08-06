import React from 'react';
import { HealthcareDashboard } from '@/components/healthcare/HealthcareDashboard';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

export default function HealthcareDashboardPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-7xl mx-auto">
          <HealthcareDashboard />
        </div>
      </div>
    </AuthWrapper>
  );
}