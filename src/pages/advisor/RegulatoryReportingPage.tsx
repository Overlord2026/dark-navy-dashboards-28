import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { RegulatoryReporting } from '@/components/advisor/reporting/RegulatoryReporting';

export default function RegulatoryReportingPage() {
  return (
    <ThreeColumnLayout activeMainItem="advisor" title="Regulatory Reporting">
      <RegulatoryReporting />
    </ThreeColumnLayout>
  );
}