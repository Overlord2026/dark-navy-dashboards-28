import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { SecureMessaging } from '@/components/messaging/SecureMessaging';

export function SecureMessagesPage() {
  return (
    <ThreeColumnLayout title="Secure Messages" activeMainItem="secure-messages">
      <div className="container p-6">
        <SecureMessaging />
      </div>
    </ThreeColumnLayout>
  );
}