import React from 'react';
import { PremiumPlaceholder } from '@/components/premium/PremiumPlaceholder';

export default function PrivateMarket() {
  return (
    <PremiumPlaceholder
      featureId="private-market-alpha"
      featureName="Private Market Alpha"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Access to exclusive private market investment opportunities:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Private equity deal flow</li>
          <li>Direct real estate investments</li>
          <li>Hedge fund access</li>
          <li>Alternative credit strategies</li>
          <li>Venture capital opportunities</li>
        </ul>
      </div>
    </PremiumPlaceholder>
  );
}