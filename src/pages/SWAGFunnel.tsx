import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { SWAGFunnelDashboard } from '@/components/leads/SWAGFunnelDashboard';

export default function SWAGFunnel() {
  return (
    <ThreeColumnLayout 
      title="SWAG Funnel Dashboard" 
      activeMainItem="analytics"
      activeSecondaryItem="swag-funnel"
    >
      <SWAGFunnelDashboard />
    </ThreeColumnLayout>
  );
}