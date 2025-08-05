import React from 'react';
import { CorporateBenefitsPortal } from '@/components/enterprise/CorporateBenefitsPortal';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';

export default function CorporateBenefitsPage() {
  return (
    <ThreeColumnLayout title="Corporate Benefits" activeMainItem="corporate-benefits">
      <CorporateBenefitsPortal />
    </ThreeColumnLayout>
  );
}