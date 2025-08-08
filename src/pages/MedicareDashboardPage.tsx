import React from 'react';
import { MedicareDashboard } from '@/components/medicare/MedicareDashboard';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

export default function MedicareDashboardPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <MedicareDashboard />
    </AuthWrapper>
  );
}