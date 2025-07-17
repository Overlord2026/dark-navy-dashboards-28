import React from 'react';
import { PremiumPlaceholder } from '@/components/premium/PremiumPlaceholder';

export default function HighNetWorthTax() {
  return (
    <PremiumPlaceholder
      featureId="high-net-worth-tax"
      featureName="High Net Worth Tax Strategies"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Advanced tax strategies for high net worth individuals including:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Estate tax planning and minimization strategies</li>
          <li>Gift tax optimization</li>
          <li>Generation-skipping transfer tax planning</li>
          <li>Advanced trust structures</li>
          <li>International tax considerations</li>
        </ul>
      </div>
    </PremiumPlaceholder>
  );
}