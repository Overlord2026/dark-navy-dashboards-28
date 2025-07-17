import React from 'react';
import { PremiumPlaceholder } from '@/components/premium/PremiumPlaceholder';

export default function HealthPremium() {
  return (
    <PremiumPlaceholder
      featureId="full-healthcare-optimization"
      featureName="Full Healthcare Optimization"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Comprehensive healthcare optimization and concierge services:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Concierge medicine coordination</li>
          <li>Second opinion services</li>
          <li>Health advocacy and navigation</li>
          <li>Executive physical programs</li>
          <li>Advanced diagnostics coordination</li>
        </ul>
      </div>
    </PremiumPlaceholder>
  );
}