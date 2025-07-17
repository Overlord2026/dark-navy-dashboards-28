import React from 'react';
import { FeatureGate } from '@/components/subscription/FeatureGate';

interface PremiumPlaceholderProps {
  featureId: string;
  featureName: string;
  children?: React.ReactNode;
}

export const PremiumPlaceholder: React.FC<PremiumPlaceholderProps> = ({ 
  featureId, 
  featureName, 
  children 
}) => {
  return (
    <FeatureGate
      featureId={featureId}
      featureName={featureName}
      requiredPlans={['premium', 'elite']}
      usePlanUpgradePrompt={true}
    >
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">{featureName}</h1>
          <div className="bg-card rounded-lg p-6 border">
            {children || (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Premium Feature</h2>
                <p className="text-muted-foreground">
                  This is a premium feature that requires a subscription upgrade.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </FeatureGate>
  );
};