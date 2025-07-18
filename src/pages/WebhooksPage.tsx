import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { WebhookManager } from '@/components/webhooks/WebhookManager';

export const WebhooksPage: React.FC = () => {
  return (
    <ThreeColumnLayout title="Webhooks & CRM">
      <WebhookManager />
    </ThreeColumnLayout>
  );
};