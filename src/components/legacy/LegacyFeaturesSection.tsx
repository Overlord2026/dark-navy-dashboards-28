import React from 'react';
import { CombinedBadge, parseStatusBadges } from '@/components/pricing/CombinedBadge';
import { Badge } from '@/components/ui/badge';
import data from '@/content/pricing_content.json';
import { cn } from '@/lib/utils';

interface LegacyFeaturesSectionProps {
  planType: 'families' | 'advisor' | 'ria';
  className?: string;
}

export function LegacyFeaturesSection({ planType, className }: LegacyFeaturesSectionProps) {
  const legacy = data.legacy;
  const features = legacy[planType];

  if (!features) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">{legacy.headline}</h3>
        <p className="text-sm text-muted-foreground">{legacy.subhead}</p>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400">
          {legacy.status.toUpperCase()}
        </Badge>
      </div>
      
      <div className="grid gap-3">
        {Object.entries(features).map(([key, feature]) => {
          const statusBadges = parseStatusBadges(feature.badges || []);
          const displayLabel = 'label' in feature ? feature.label : key.replace('_', ' ');
          
          return (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex-1">
                <div className="font-medium text-sm capitalize">
                  {String(displayLabel)}
                </div>
                {feature.note && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {feature.note}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {statusBadges.map((status, index) => (
                  <CombinedBadge 
                    key={index}
                    status={status} 
                    showPlan={false}
                    className="text-xs"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LegacyFeaturesSection;