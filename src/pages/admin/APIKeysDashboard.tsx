import React from 'react';
import { APIKeyManager } from '@/components/admin/APIKeyManager';
import { QAWarningBanner } from '@/components/admin/QAWarningBanner';

export default function APIKeysDashboard() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Key Management</h1>
          <p className="text-muted-foreground">
            Configure and validate all production API keys and secrets
          </p>
        </div>
      </div>
      
      <QAWarningBanner />
      <APIKeyManager />
    </div>
  );
}