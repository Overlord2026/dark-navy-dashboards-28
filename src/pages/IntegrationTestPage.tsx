import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { IntegrationTestSuite } from '@/components/testing/IntegrationTestSuite';

export default function IntegrationTestPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-surface">
        <div className="container mx-auto p-6">
          <IntegrationTestSuite />
        </div>
      </div>
    </MainLayout>
  );
}