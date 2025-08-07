import React from 'react';
import { ClientPortalDashboard } from '@/components/client/ClientPortalDashboard';
import { MainLayout } from '@/components/layout/MainLayout';

export default function ClientPortalPage() {
  return (
    <MainLayout>
      <ClientPortalDashboard />
    </MainLayout>
  );
}