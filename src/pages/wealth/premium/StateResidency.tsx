import React from 'react';
import { PremiumPlaceholder } from '@/components/premium/PremiumPlaceholder';

export default function StateResidency() {
  return (
    <PremiumPlaceholder
      featureId="state-residency-analysis"
      featureName="State Residency Analysis"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Comprehensive state residency planning and analysis:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>State tax burden comparisons</li>
          <li>Residency establishment strategies</li>
          <li>Documentation requirements</li>
          <li>Trust and estate considerations</li>
          <li>Audit defense planning</li>
        </ul>
      </div>
    </PremiumPlaceholder>
  );
}