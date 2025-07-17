import React from 'react';
import { PremiumPlaceholder } from '@/components/premium/PremiumPlaceholder';

export default function AppreciatedStock() {
  return (
    <PremiumPlaceholder
      featureId="appreciated-stock-solutions"
      featureName="Appreciated Stock Solutions"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Sophisticated strategies for managing appreciated stock positions:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Tax-loss harvesting optimization</li>
          <li>Direct indexing strategies</li>
          <li>Charitable remainder trusts</li>
          <li>Exchange funds</li>
          <li>Collar strategies and hedging</li>
        </ul>
      </div>
    </PremiumPlaceholder>
  );
}