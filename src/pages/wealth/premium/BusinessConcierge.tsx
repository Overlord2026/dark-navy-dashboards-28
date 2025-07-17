import React from 'react';
import { PremiumPlaceholder } from '@/components/premium/PremiumPlaceholder';

export default function BusinessConcierge() {
  return (
    <PremiumPlaceholder
      featureId="business-concierge-tools"
      featureName="Business Concierge Tools"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Professional business support and concierge services:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Executive assistant services</li>
          <li>Travel planning and management</li>
          <li>Event coordination</li>
          <li>Vendor management</li>
          <li>Family office administration</li>
        </ul>
      </div>
    </PremiumPlaceholder>
  );
}