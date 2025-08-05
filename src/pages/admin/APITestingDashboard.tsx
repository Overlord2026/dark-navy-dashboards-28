import React from 'react';
import { APIStatusDashboard } from '@/components/admin/APIStatusDashboard';
import { QAWarningBanner } from '@/components/admin/QAWarningBanner';
import { APIIntegrationAudit } from '@/components/admin/APIIntegrationAudit';

export default function APITestingDashboard() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Integration Testing</h1>
          <p className="text-muted-foreground">
            Live testing of all API connections and integrations
          </p>
        </div>
      </div>
      
      <QAWarningBanner />
      <APIStatusDashboard />
      <APIIntegrationAudit />
    </div>
  );
}