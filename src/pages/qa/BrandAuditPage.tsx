import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BrandConsistencyAudit } from '@/components/qa/BrandConsistencyAudit';

export function BrandAuditPage() {
  return (
    <MainLayout>
      <BrandConsistencyAudit />
    </MainLayout>
  );
}