import React from 'react';
import { PremiumPlaceholder } from '@/components/premium/PremiumPlaceholder';

export default function FamilyLegacyBox() {
  return (
    <PremiumPlaceholder
      featureId="family-legacy-box"
      featureName="Family Legacy Box™"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Comprehensive family legacy planning and documentation:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Multi-generational wealth transfer planning</li>
          <li>Family constitution development</li>
          <li>Digital asset preservation</li>
          <li>Family history documentation</li>
          <li>Legacy value preservation</li>
        </ul>
      </div>
    </PremiumPlaceholder>
  );
}